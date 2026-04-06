/**
 * ══════════════════════════════════════════════
 * AUREVEIL — Interactions & Animations
 * ══════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── 1. LOADER ─────────────────────────────────
  const loader = document.getElementById('loader');
  const loaderCount = document.getElementById('loaderCount');
  let count = 0;

  const countInterval = setInterval(() => {
    count += Math.floor(Math.random() * 5) + 1;
    if (count >= 100) {
      count = 100;
      clearInterval(countInterval);
      loaderCount.innerText = '100';
      
      // Remove loader
      setTimeout(() => {
        loader.classList.add('done');
        document.body.classList.remove('loading');
        
        // Trigger initial animations
        document.querySelectorAll('.headline-line').forEach((el) => {
          setTimeout(() => {
            el.style.transform = 'translateY(0)';
            el.style.opacity = '1';
          }, parseInt(el.getAttribute('data-delay')) || 0);
        });
      }, 500);
    } else {
      loaderCount.innerText = ('00' + count).slice(-3); // Padding with zeros
    }
  }, 20);


  // ── 2. CUSTOM CURSOR ──────────────────────────
  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');

  // Only enable on non-touch devices
  if (window.matchMedia("(pointer: fine)").matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let trailX = window.innerWidth / 2;
    let trailY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    // Smooth trail animation
    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;
      cursorTrail.style.left = `${trailX}px`;
      cursorTrail.style.top = `${trailY}px`;
      requestAnimationFrame(animateTrail);
    };
    animateTrail();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .chip, .watch-card, select, input, textarea');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }


  // ── 3. NAVBAR & MOBILE MENU ───────────────────
  const navbar = document.getElementById('navbar');
  const navHamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  navHamburger.addEventListener('click', () => {
    navHamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      navHamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  // ── 4. SCROLL REVEAL (Intersection Observer) ──
  const revealElements = document.querySelectorAll('.reveal-section, .reveal-card, .reveal-left, .reveal-right, .reveal-up');
  
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translate(0, 0) scale(1)';
      observer.unobserve(entry.target);
    });
  }, revealOptions);

  // Set initial states
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
    
    if (el.classList.contains('reveal-left')) el.style.transform = 'translateX(-50px)';
    else if (el.classList.contains('reveal-right')) el.style.transform = 'translateX(50px)';
    else if (el.classList.contains('reveal-up') || el.classList.contains('reveal-section')) el.style.transform = 'translateY(50px)';
    else if (el.classList.contains('reveal-card')) {
      el.style.transform = 'translateY(30px) scale(0.95)';
      // Stagger cards in collection
      if (el.id === 'cardEclipsePrime') el.style.transitionDelay = '0.2s';
      if (el.id === 'cardAurumNoir') el.style.transitionDelay = '0.4s';
    }
    
    revealObserver.observe(el);
  });


  // ── 5. STAT COUNTER ANIMATION ─────────────────
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        
        statNumbers.forEach(stat => {
          const target = +stat.getAttribute('data-target');
          const duration = 2000; // 2 seconds
          const increment = target / (duration / 16); // 60fps
          let current = 0;

          const updateCounter = () => {
            current += increment;
            if (current < target) {
              stat.innerText = Math.ceil(current);
              requestAnimationFrame(updateCounter);
            } else {
              stat.innerText = target;
            }
          };
          updateCounter();
        });
      }
    });
  }, { threshold: 0.5 });

  if (document.querySelector('.stats-bar')) {
    statsObserver.observe(document.querySelector('.stats-bar'));
  }


  // ── 6. 3D TILT EFFECT ON CARDS ────────────────
  const tiltCards = document.querySelectorAll('.tilt-card');
  
  if (window.matchMedia("(pointer: fine)").matches) {
    tiltCards.forEach(card => {
      const inner = card.querySelector('.card-inner');
      const img = card.querySelector('.card-watch-img');
      const glass = card.querySelector('.card-glass-overlay');

      card.addEventListener('mousemove', (e) => {
        const rect = inner.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top; // y position within the element
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;
        
        inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        img.style.transform = `scale(1.1) rotate(5deg) translateZ(50px) translateX(${rotateY * -1}px) translateY(${rotateX}px)`;
      });

      card.addEventListener('mouseleave', () => {
        inner.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        inner.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        img.style.transform = `scale(1) rotate(0deg) translateZ(0px)`;
        img.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        
        setTimeout(() => {
          inner.style.transition = '';
          img.style.transition = '';
        }, 600);
      });
    });
  }


  // ── 7. AI TERMINAL TYPING EFFECT ──────────────
  const typingText = document.getElementById('typingText');
  const aiSection = document.getElementById('experience');
  const aiCards = document.querySelectorAll('.ai-card');
  
  const textToType = "Analyzing portfolio... Establishing preferences... Match sequence generating. 3 matches found with >90% correlation to style 'Avant-Garde Skeleton'. Displaying results.";
  let typingIndex = 0;
  let typingStarted = false;

  const typeWriter = () => {
    if (typingIndex < textToType.length) {
      typingText.innerHTML += textToType.charAt(typingIndex);
      typingIndex++;
      setTimeout(typeWriter, Math.random() * 30 + 10);
    } else {
      // Finished typing, cycle through cards
      cycleAiCards();
    }
  };

  const aiObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !typingStarted) {
      typingStarted = true;
      setTimeout(typeWriter, 500);
    }
  }, { threshold: 0.5 });

  if (aiSection) aiObserver.observe(aiSection);

  function cycleAiCards() {
    let currentCard = 0;
    setInterval(() => {
      aiCards.forEach(card => card.classList.remove('active-card'));
      aiCards[currentCard].classList.add('active-card');
      
      currentCard = (currentCard + 1) % aiCards.length;
    }, 3000);
  }


  // ── 8. SMOOTH ANCHOR SCROLLING ────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - (window.innerWidth < 768 ? 60 : 80);
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });


  // ── 9. FORM SUBMISSION MOCK ───────────────────
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const btn = document.getElementById('formSubmit');
      const originalText = btn.querySelector('.submit-text').innerText;
      
      btn.querySelector('.submit-text').innerText = 'Transmitting...';
      btn.style.opacity = '0.7';
      btn.style.pointerEvents = 'none';
      
      // Simulate network request
      setTimeout(() => {
        formSuccess.classList.add('show');
        contactForm.reset();
        
        setTimeout(() => {
          btn.querySelector('.submit-text').innerText = originalText;
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'auto';
        }, 1000);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          formSuccess.classList.remove('show');
        }, 5000);
        
      }, 1500);
    });
  }
});
