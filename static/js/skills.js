document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#skills .skill-tag').forEach((tag, index) => {
        tag.style.opacity = 0;
        setTimeout(() => {
            tag.style.transition = 'opacity 0.6s';
            tag.style.opacity = 1;
        }, 200 + index * 100);
    });
}); 