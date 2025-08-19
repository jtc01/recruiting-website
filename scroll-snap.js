let scrollTimeout;
const scrollDebounceDelay = 30; // ms after scroll stops
let isAutoScrolling = false;
let lastScrollPosition = window.pageYOffset;
let lastScrollDirection = null; // 'up' or 'down'

window.addEventListener('scroll', () => {
  const currentScrollPosition = window.pageYOffset;
  
  // If we're auto-scrolling and user scrolls, stop the auto-scroll
  if (isAutoScrolling) {
    isAutoScrolling = false;
    clearTimeout(scrollTimeout);
    return;
  }
  
  // Determine scroll direction
  if (currentScrollPosition > lastScrollPosition) {
    lastScrollDirection = 'down';
  } else if (currentScrollPosition < lastScrollPosition) {
    lastScrollDirection = 'up';
  }
  
  lastScrollPosition = currentScrollPosition;
  
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

    const distanceToTop = Math.abs(sectionTop - scrollTop);

    // Check if this section is in the direction user was scrolling
    const sectionIsBelow = sectionTop > scrollTop;
    const sectionIsAbove = sectionTop < scrollTop;
    
    let shouldConsiderSection = false;
    
    if (lastScrollDirection === 'down' && sectionIsBelow) {
        shouldConsiderSection = true;
    } else if (lastScrollDirection === 'up' && sectionIsAbove) {
        shouldConsiderSection = true;
    } else if (lastScrollDirection === null) {
        // No direction detected, consider all sections (fallback)
        shouldConsiderSection = true;
    }
    
    if (shouldConsiderSection && distanceToTop < smallestDistance) {
        smallestDistance = distanceToTop;
        closestSection = section;
    }
    });

    if (closestSection) {
        smoothScrollToSection(closestSection);
    }
}

function smoothScrollToSection(section) {
    if (isAutoScrolling) return;

    isAutoScrolling = true;

        const targetPosition = section.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;

        let startTime = null;

        function animation(currentTime) {
        // Check if auto-scroll was interrupted
        if (!isAutoScrolling) {
            return; // Exit animation if flag was cleared
        }
        
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        window.scrollTo(0, startPosition + (distance * easeOut));
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        } else {
            isAutoScrolling = false;
        }
    }

    requestAnimationFrame(animation);
}