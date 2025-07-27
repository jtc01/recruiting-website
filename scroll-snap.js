let scrollTimeout;
const scrollDebounceDelay = 30; // ms after scroll stops
let isAutoScrolling = false;

window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(snapToNearestSection, scrollDebounceDelay);
});

function snapToNearestSection() {
    if (isAutoScrolling) return
    const sections = document.querySelectorAll('.snap-section');
    const viewportHeight = window.innerHeight;
    const scrollTop = window.pageYOffset;

    let closestSection = null;
    let smallestDistance = Infinity;

    sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const sectionTop = scrollTop + rect.top;

    const sectionCenter = sectionTop + (rect.height / 2);
    const viewportCenter = scrollTop + (viewportHeight / 2);
    const distanceToCenter = Math.abs(sectionCenter - viewportCenter);

    if (distanceToCenter < smallestDistance) {
        smallestDistance = distanceToCenter;
        closestSection = section;
    }
    });

    if (closestSection) {
    smoothScrollToSection(closestSection);
    }
}

function smoothScrollToSection(section) {
    if (isAutoScrolling) return;  // Exit if already auto-scrolling
  
    isAutoScrolling = true;  // Set flag before starting
    const targetPosition = section.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 200; // ms

    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        window.scrollTo(0, startPosition + (distance * easeOut));

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
        else{
            isAutoScrolling = false;
        }
    }

    requestAnimationFrame(animation);
}