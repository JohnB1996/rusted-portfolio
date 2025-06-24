document.addEventListener('DOMContentLoaded', function() {
    // Typing effect for hero title
    const heroTitle = document.querySelector('#home.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        setTimeout(typeWriter, 1000);
    }
    // Smooth scroll for CTA buttons
    document.querySelectorAll('#home.hero .cta-buttons a').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}); 