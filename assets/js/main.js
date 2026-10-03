/**
 * Amruta Chauhan — Main Interactive Script
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      mainNav.classList.toggle('is-open');
    });

    // Close drawer when clicking any link
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
      });
    });

    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
      }
    });

    // Auto-close if screen expands beyond 1024px
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && mainNav.classList.contains('is-open')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
      }
    });
  }

  // 1.5 Smart Sticky Header
  const header = document.getElementById('site-header');
  let isInShowcase = false;
  if (header) {
    let lastScrollY = window.scrollY;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Keep header hidden while inside full-screen showcase
          if (isInShowcase) {
            header.classList.add('is-hidden');
            ticking = false;
            return;
          }
          const currentScrollY = window.scrollY;
          if (currentScrollY > 50) {
            header.classList.add('is-scrolled');
          } else {
            header.classList.remove('is-scrolled');
          }
          const delta = currentScrollY - lastScrollY;
          if (Math.abs(delta) > 10) {
            if (delta > 0 && currentScrollY > 150) {
              header.classList.add('is-hidden');
            } else if (delta < 0) {
              header.classList.remove('is-hidden');
            }
            lastScrollY = currentScrollY;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // 2. Back to Top Smooth Scroll
  const backToTopTriggers = document.querySelectorAll('[data-scroll-top]');
  backToTopTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // 3. Creative Process Step Hover & Click Selection (Archidex style)
  const processRows = document.querySelectorAll('.process-row');
  processRows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      processRows.forEach((r) => r.classList.remove('is-active'));
      row.classList.add('is-active');
    });
    row.addEventListener('click', () => {
      processRows.forEach((r) => r.classList.remove('is-active'));
      row.classList.add('is-active');
    });
  });

  const processTable = document.querySelector('.process-table-wrap');
  if (processTable) {
    processTable.addEventListener('mouseleave', () => {
      processRows.forEach((r) => r.classList.remove('is-active'));
    });
  }

  // 4. Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal-up');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // 5. Animated Stats Counter (500+, 90+, 100+)
  const statNumbers = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            const suffix = el.getAttribute('data-suffix') || '+';
            const duration = 2500;
            const startTime = performance.now();

            const updateCounter = (now) => {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(eased * target);
              el.textContent = `${current}${suffix}`;
              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = `${target}${suffix}`;
              }
            };

            requestAnimationFrame(updateCounter);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    statNumbers.forEach((stat) => counterObserver.observe(stat));
  }

  // 6. Archidex 3D Title Scroll & Interactive Hover Animation (rr_title_anim)
  function initTitleAnim() {
    const titleElements = document.querySelectorAll('.rr_title_anim');
    if (!titleElements.length || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const setupAnimations = () => {
      titleElements.forEach((splitTextLine) => {
        let lines = [];
        let words = [];

        if (typeof SplitType !== 'undefined') {
          const itemSplitted = new SplitType(splitTextLine, { types: 'lines, words' });
          lines = itemSplitted.lines || [];
          words = itemSplitted.words || [];
        } else {
          // Reliable fallback if SplitType is not defined
          const parts = splitTextLine.innerHTML.split(/<br\s*\/?>/i);
          splitTextLine.innerHTML = '';
          parts.forEach((part) => {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'line';
            lineDiv.innerHTML = part.trim();
            splitTextLine.appendChild(lineDiv);
            lines.push(lineDiv);
          });
        }

        if (!lines || !lines.length) return;

        gsap.set(splitTextLine, { perspective: 400 });

        // A. Scroll-Triggered 3D Unfolding Reveal Animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: splitTextLine,
            start: 'top 90%',
            end: 'bottom 60%',
            scrub: false,
            markers: false,
            toggleActions: 'play none none reverse',
          },
        });

        tl.from(lines, {
          duration: 1,
          delay: 0.25,
          opacity: 0,
          rotationX: -80,
          force3D: true,
          transformOrigin: 'top center -50',
          stagger: 0.2,
          ease: 'power2.out',
        });

        // B. Interactive 3D Ripple Unfold Animation on Mouse Hover (Removed per request)
        // Hover animation removed while keeping the scroll/load reveal animation intact.
      });
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setupAnimations);
    } else {
      setupAnimations();
    }
  }

  initTitleAnim();

  // 7. Featured Collection Showcase (Pinned Archidex Curtain Mask Reveal)
  function initShowcaseSnapSlider() {
    const portfolioArea = document.querySelector('.rr-portfolio-area');
    if (!portfolioArea) return;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const snapSlides = gsap.utils.toArray('.rr-snap-slide');
      if (snapSlides.length <= 1) return;

      // Set initial states: Slide 0 visible; others clipped from bottom
      snapSlides.forEach((slide, i) => {
        if (i === 0) {
          gsap.set(slide, { clipPath: 'inset(0% 0% 0% 0%)', zIndex: 1 });
        } else {
          gsap.set(slide, { clipPath: 'inset(100% 0% 0% 0%)', zIndex: i + 1 });
        }
      });

      // Pin .rr-portfolio-area and animate each slide sequentially
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: portfolioArea,
          pin: true,
          start: 'top top',
          end: () => `+=${snapSlides.length * window.innerHeight}`,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onEnter: () => {
            isInShowcase = true;
            if (header) header.classList.add('is-hidden');
          },
          onLeave: () => {
            isInShowcase = false;
            if (header) header.classList.remove('is-hidden');
          },
          onEnterBack: () => {
            isInShowcase = true;
            if (header) header.classList.add('is-hidden');
          },
          onLeaveBack: () => {
            isInShowcase = false;
            if (header) header.classList.remove('is-hidden');
          },
        },
      });

      // Reveal slides upward from bottom to top
      for (let i = 1; i < snapSlides.length; i++) {
        tl.to(snapSlides[i], {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          duration: 1,
        });
        if (i < snapSlides.length - 1) {
          tl.to({}, { duration: 0.35 });
        }
      }
      tl.to({}, { duration: 0.5 });
    });

    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  initShowcaseSnapSlider();

  // 7. Sticky Smooth Vertical Slide Split-Screen Showcase (Down-to-Top Slide Motion, No Fade, 1 Scroll Per Slide)
  const showcaseSection = document.getElementById('showcase-split-section');
  const showcasePanels = document.querySelectorAll('.showcase-panel');
  const showcaseDots = document.querySelectorAll('.showcase-indicator-dot');

  if (showcaseSection && showcasePanels.length > 0) {
    let activeIdx = 0;
    let ticking = false;

    const updateActiveShowcase = (index) => {
      if (index === activeIdx) return;
      activeIdx = index;

      showcasePanels.forEach((panel, i) => {
        let offset = i - index;
        if (offset < 0) offset = 0;
        panel.style.setProperty('--slide-offset', offset.toString());
        if (i === index) {
          panel.classList.add('is-active');
        } else {
          panel.classList.remove('is-active');
        }
      });
    };

    const handleShowcaseScroll = () => {
      if (window.innerWidth <= 1024) {
        showcasePanels.forEach((panel) => {
          panel.style.removeProperty('--slide-offset');
          panel.classList.add('is-active');
        });
        return;
      }

      const rect = showcaseSection.getBoundingClientRect();
      const scrollableDistance = showcaseSection.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 0) {
        updateActiveShowcase(0);
        return;
      }

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      // Thresholds: Slide 0 (< 0.25), Slide 1 (0.25 - 0.75), Slide 2 (>= 0.75)
      let targetIndex = 0;
      if (progress >= 0.75) {
        targetIndex = 2;
      } else if (progress >= 0.25) {
        targetIndex = 1;
      } else {
        targetIndex = 0;
      }
      
      updateActiveShowcase(targetIndex);
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleShowcaseScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Initialize initial state
    handleShowcaseScroll();
  }

  // 8. Subpage: Collection Category Filter & Project Modal
  const filterBtns = document.querySelectorAll('.filter-btn');
  const collectionCards = document.querySelectorAll('.collection-card');
  let currentVisibleCards = Array.from(collectionCards);
  let currentModalIndex = 0;

  if (filterBtns.length > 0 && collectionCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter') || 'all';
        currentVisibleCards = [];

        collectionCards.forEach((card) => {
          const category = card.getAttribute('data-category') || '';
          if (filterValue === 'all' || category.includes(filterValue)) {
            card.style.display = 'flex';
            currentVisibleCards.push(card);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Project Detail Modal
  const modalBackdrop = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('project-modal-close');
  const modalImg = document.getElementById('modal-project-img');
  const modalTag = document.getElementById('modal-project-tag');
  const modalTitle = document.getElementById('modal-project-title');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalMetaLocation = document.getElementById('modal-meta-location');
  const modalMetaMedium = document.getElementById('modal-meta-medium');
  const modalMetaYear = document.getElementById('modal-meta-year');
  const modalPrevBtn = document.getElementById('modal-prev');
  const modalNextBtn = document.getElementById('modal-next');

  if (modalBackdrop && collectionCards.length > 0) {
    const populateModal = (card) => {
      const title = card.getAttribute('data-title') || card.querySelector('.collection-card-title')?.textContent || '';
      const category = card.getAttribute('data-category-label') || card.querySelector('.collection-card-category')?.textContent || '';
      const desc = card.getAttribute('data-full-desc') || card.querySelector('.collection-card-desc')?.textContent || '';
      const img = card.querySelector('img')?.getAttribute('src') || '';
      const location = card.getAttribute('data-location') || 'Ahmedabad, India';
      const medium = card.getAttribute('data-medium') || 'Custom Site-Specific Installation';
      const year = card.getAttribute('data-year') || '2024–2026';

      if (modalTitle) modalTitle.textContent = title;
      if (modalTag) modalTag.textContent = category;
      if (modalDesc) modalDesc.textContent = desc;
      
      // fade out and in effect for image
      if (modalImg) {
        modalImg.style.opacity = '0';
        setTimeout(() => {
          modalImg.src = img;
          modalImg.style.opacity = '1';
        }, 150);
      }
      
      if (modalMetaLocation) modalMetaLocation.textContent = location;
      if (modalMetaMedium) modalMetaMedium.textContent = medium;
      if (modalMetaYear) modalMetaYear.textContent = year;
    };

    collectionCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        // Prevent opening if clicking direct child link if any
        if (e.target.closest('a') && !e.target.closest('.collection-card-cta')) return;

        currentModalIndex = currentVisibleCards.indexOf(card);
        if(currentModalIndex === -1) currentModalIndex = 0;

        populateModal(card);
        modalBackdrop.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      });
    });

    const navigateModal = (direction) => {
      if (currentVisibleCards.length === 0) return;
      currentModalIndex += direction;
      if (currentModalIndex < 0) currentModalIndex = currentVisibleCards.length - 1;
      if (currentModalIndex >= currentVisibleCards.length) currentModalIndex = 0;
      
      const targetCard = currentVisibleCards[currentModalIndex];
      populateModal(targetCard);
    };

    if (modalPrevBtn) {
      modalPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateModal(-1);
      });
    }

    if (modalNextBtn) {
      modalNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateModal(1);
      });
    }

    const closeModal = () => {
      modalBackdrop.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('is-active')) {
        closeModal();
      } else if (e.key === 'ArrowRight' && modalBackdrop.classList.contains('is-active')) {
        navigateModal(1);
      } else if (e.key === 'ArrowLeft' && modalBackdrop.classList.contains('is-active')) {
        navigateModal(-1);
      }
    });
  }

  // 9. Subpage: FAQ Accordion (Contact Page)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        faqItems.forEach((i) => i.classList.remove('is-open'));
        if (!isOpen) {
          item.classList.add('is-open');
        }
      });
    }
  });

  // 10. Subpage: Contact Form Submission Handling
  const contactForm = document.getElementById('commission-inquiry-form');
  const formToast = document.getElementById('form-success-toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting Inquiry...';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          contactForm.reset();
          if (formToast) {
            formToast.classList.add('is-visible');
            setTimeout(() => {
              formToast.classList.remove('is-visible');
            }, 6000);
          }
        }, 800);
      }
    });
  }

  // 11. Newsletter Form Submission Handling
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      if (input && input.value) {
        if (btn) btn.textContent = 'Subscribed!';
        setTimeout(() => {
          form.reset();
          if (btn) btn.textContent = 'Subscribe';
        }, 3000);
      }
    });
  });
});
