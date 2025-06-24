document.addEventListener('DOMContentLoaded', function() {
    const emailLink = document.querySelector('#contact a[href^="mailto:"]');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            const email = this.getAttribute('href').replace('mailto:', '');
            navigator.clipboard.writeText(email).then(() => {
                const tooltip = document.createElement('div');
                tooltip.textContent = 'Email copied to clipboard!';
                tooltip.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #667eea;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    z-index: 10000;
                    animation: fadeInOut 3s ease;
                `;
                document.body.appendChild(tooltip);
                setTimeout(() => { tooltip.remove(); }, 3000);
            });
        });
    }
}); 