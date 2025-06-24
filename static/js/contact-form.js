// Contact Form Handler with GitHub Issues API
class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.alert = document.getElementById('alert');
        this.loading = document.getElementById('loading');
        this.submitBtn = document.getElementById('submitBtn');
        
        // GitHub repository details (replace with your actual repo)
        this.githubRepo = 'JohnB1996/rusted-portfolio'; // Replace with actual repo
        this.githubApiUrl = `https://api.github.com/repos/${this.githubRepo}/issues`;
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.loadStoredData();
        this.setupPrism();
    }
    
    setupPrism() {
        // Initialize Prism.js for syntax highlighting
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    }
    
    loadStoredData() {
        // Load previously entered data from localStorage
        const storedData = localStorage.getItem('contactFormData');
        if (storedData) {
            try {
                const data = JSON.parse(storedData);
                if (data.name) document.getElementById('name').value = data.name;
                if (data.email) document.getElementById('email').value = data.email;
                if (data.subject) document.getElementById('subject').value = data.subject;
            } catch (e) {
                console.log('No stored form data found');
            }
        }
    }
    
    saveFormData() {
        // Save form data to localStorage
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value
        };
        localStorage.setItem('contactFormData', JSON.stringify(formData));
    }
    
    showAlert(message, type = 'success') {
        this.alert.textContent = message;
        this.alert.className = `alert alert-${type}`;
        this.alert.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.alert.style.display = 'none';
        }, 5000);
    }
    
    setLoading(loading) {
        this.loading.style.display = loading ? 'block' : 'none';
        this.submitBtn.disabled = loading;
        this.submitBtn.textContent = loading ? 'Sending...' : 'Send Message';
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form data
        if (!this.validateForm(data)) {
            return;
        }
        
        // Save form data to localStorage
        this.saveFormData();
        
        // Show loading state
        this.setLoading(true);
        
        try {
            await this.submitToGitHub(data);
            this.showAlert('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.form.reset();
            localStorage.removeItem('contactFormData'); // Clear stored data after successful submission
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showAlert('Failed to send message. Please try again or contact me directly.', 'error');
        } finally {
            this.setLoading(false);
        }
    }
    
    validateForm(data) {
        if (!data.name || !data.email || !data.subject || !data.message) {
            this.showAlert('Please fill in all required fields.', 'error');
            return false;
        }
        
        if (data.name.length < 2) {
            this.showAlert('Name must be at least 2 characters long.', 'error');
            return false;
        }
        
        if (data.message.length < 10) {
            this.showAlert('Message must be at least 10 characters long.', 'error');
            return false;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showAlert('Please enter a valid email address.', 'error');
            return false;
        }
        
        return true;
    }
    
    async submitToGitHub(data) {
        const issueData = {
            title: `Contact Form: ${data.subject}`,
            body: this.formatIssueBody(data),
            labels: ['contact-form', 'portfolio']
        };
        
        const response = await fetch(this.githubApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify(issueData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`GitHub API Error: ${errorData.message || response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Issue created successfully:', result);
        
        // Show notification
        this.showNotification('Message sent successfully!', 'Your contact form submission has been received.');
        
        return result;
    }
    
    formatIssueBody(data) {
        const inquiryType = this.getInquiryType(data.subject);
        
        return `## Contact Form Submission

**From:** ${data.name}  
**Email:** ${data.email}  
**Subject:** ${data.subject}  
**Inquiry Type:** ${inquiryType}

### Message:
${data.message}

---
*Submitted via portfolio contact form on ${new Date().toLocaleString()}*

**Next Steps:**
- [ ] Review inquiry details
- [ ] Determine appropriate response timeline
- [ ] Prepare technical proposal if needed
- [ ] Schedule follow-up if required
`;
    }
    
    getInquiryType(subject) {
        const typeMap = {
            'Job Opportunity': 'Career/Employment',
            'Project Collaboration': 'Partnership/Project',
            'Freelance Work': 'Freelance/Contract',
            'Technical Consulting': 'Consulting/Advisory',
            'Architecture Review': 'Technical Review',
            'General Inquiry': 'General Information',
            'Technical Question': 'Technical Support'
        };
        
        return typeMap[subject] || 'General';
    }
    
    showNotification(title, body) {
        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: '/favicon.ico' // Add your favicon path
            });
        }
        
        // Also show in-page notification
        this.showAlert(title, 'success');
    }
}

// Request notification permission on page load
document.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // Initialize the contact form handler
    new ContactFormHandler();
});

// Add some utility functions for localStorage management
const ContactUtils = {
    clearStoredData() {
        localStorage.removeItem('contactFormData');
    },
    
    getStoredData() {
        const data = localStorage.getItem('contactFormData');
        return data ? JSON.parse(data) : null;
    },
    
    hasStoredData() {
        return localStorage.getItem('contactFormData') !== null;
    }
};

// Make utils available globally for debugging
window.ContactUtils = ContactUtils;
