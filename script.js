
// document.addEventListener('DOMContentLoaded', () => {
//   const navToggle = document.querySelector('.nav-toggle');
//   const navMenu = document.querySelector('.nav-menu');
//   if (navToggle && navMenu) {
//     navToggle.addEventListener('click', () => {
//       navMenu.classList.toggle('open');
//       navToggle.classList.toggle('open');
//     });
//   }

//   const revealEls = document.querySelectorAll('[data-reveal]');
//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) entry.target.classList.add('revealed');
//     });
//   }, { threshold: 0.15 });
//   revealEls.forEach((el) => observer.observe(el));

//   const slides = Array.from(document.querySelectorAll('.slider-slide'));
//   const dots = Array.from(document.querySelectorAll('.slider-dot'));
//   if (slides.length) {
//     let index = 0;
//     const show = (i) => {
//       slides.forEach((slide, idx) => slide.classList.toggle('active', idx === i));
//       dots.forEach((dot, idx) => dot.classList.toggle('active', idx === i));
//     };
//     dots.forEach((dot, idx) => dot.addEventListener('click', () => {
//       index = idx; show(index);
//     }));
//     show(index);
//     if (slides.length > 1) {
//       setInterval(() => {
//         index = (index + 1) % slides.length;
//         show(index);
//       }, 4800);
//     }
//   }

//   const galleryCards = document.querySelectorAll('[data-gallery-item]');
//   const modal = document.querySelector('.gallery-modal');
//   if (galleryCards.length && modal) {
//     const modalTitle = modal.querySelector('.gallery-modal-title');
//     const modalText = modal.querySelector('.gallery-modal-text');
//     const modalMeta = modal.querySelector('.gallery-modal-meta');
//     const closeBtn = modal.querySelector('.gallery-modal-close');

//     galleryCards.forEach((card) => {
//       card.addEventListener('click', () => {
//         modalTitle.textContent = card.dataset.title || 'Intervention';
//         modalText.textContent = card.dataset.description || '';
//         modalMeta.textContent = card.dataset.meta || '';
//         modal.classList.add('open');
//       });
//     });

//     closeBtn.addEventListener('click', () => modal.classList.remove('open'));
//     modal.addEventListener('click', (e) => {
//       if (e.target === modal) modal.classList.remove('open');
//     });
//     document.addEventListener('keydown', (e) => {
//       if (e.key === 'Escape') modal.classList.remove('open');
//     });
//   }
// });

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      body.classList.toggle('nav-open');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        body.classList.remove('nav-open');
      });
    });
  }

  const revealElements = document.querySelectorAll('[data-reveal]');

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  }

  const modal = document.querySelector('.gallery-modal');
  const modalTitle = document.querySelector('.gallery-modal-title');
  const modalText = document.querySelector('.gallery-modal-text');
  const modalMeta = document.querySelector('.gallery-modal-meta');
  const modalClose = document.querySelector('.gallery-modal-close');
  const galleryItems = document.querySelectorAll('[data-gallery-item]');

  const openModal = (item) => {
    if (!modal || !item) return;

    modalTitle.textContent = item.dataset.title || 'Intervention';
    modalText.textContent = item.dataset.description || '';
    modalMeta.textContent = item.dataset.meta || '';
    modal.classList.add('open');
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => openModal(item));
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });

  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slider-slide');

  if (slider && slides.length > 1) {
    let currentSlide = 0;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    };

    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 5000);
  }

  const autoSlider = document.querySelector('[data-auto-slider]');
  if (autoSlider) {
    const track = autoSlider.querySelector('.interventions-track');
    const cards = Array.from(track.querySelectorAll('.intervention-card'));
    const prevButton = autoSlider.querySelector('.interventions-arrow-prev');
    const nextButton = autoSlider.querySelector('.interventions-arrow-next');
    const selectButtons = autoSlider.querySelectorAll('.intervention-select');
    let currentIndex = 0;
    let autoSlide = null;

    const getVisibleCards = () => {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    };

    const getGap = () => {
      if (!track || !cards.length) return 0;
      const trackStyles = window.getComputedStyle(track);
      return parseFloat(trackStyles.columnGap || trackStyles.gap || '0');
    };

    const getMaxIndex = () => {
      const visibleCards = getVisibleCards();
      return Math.max(0, cards.length - visibleCards);
    };

    const getCenteredIndex = (index) => {
      const visibleCards = getVisibleCards();
      const maxIndex = getMaxIndex();

      if (visibleCards === 1) {
        return Math.min(index, maxIndex);
      }

      if (visibleCards === 2) {
        return Math.min(index, maxIndex);
      }

      return Math.min(Math.max(index - 1, 0), maxIndex);
    };

    const setActiveCard = (activeIndex) => {
      cards.forEach((card, index) => {
        card.classList.toggle('is-active', index === activeIndex);
      });
    };

    const updateSlider = (activeIndex = currentIndex, shouldAnimate = true) => {
      if (!cards.length) return;

      const safeIndex = Math.max(0, Math.min(activeIndex, cards.length - 1));
      const gap = getGap();
      const cardWidth = cards[0].offsetWidth + gap;
      const translateIndex = getCenteredIndex(safeIndex);

      currentIndex = safeIndex;
      setActiveCard(currentIndex);

      track.style.transition = shouldAnimate ? 'transform 0.7s ease' : 'none';
      track.style.transform = `translateX(-${translateIndex * cardWidth}px)`;
    };

    const goToCard = (index, shouldAnimate = true) => {
      updateSlider(index, shouldAnimate);
    };

    const nextSlide = () => {
      const nextIndex = (currentIndex + 1) % cards.length;
      goToCard(nextIndex);
    };

    const prevSlide = () => {
      const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
      goToCard(prevIndex);
    };

    const stopAutoSlide = () => {
      if (autoSlide) {
        clearInterval(autoSlide);
        autoSlide = null;
      }
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      if (cards.length > 1) {
        autoSlide = setInterval(nextSlide, 3200);
      }
    };

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
      });
    }

    cards.forEach((card, index) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('.intervention-more')) return;
        goToCard(index);
        startAutoSlide();
      });
    });

    selectButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const card = button.closest('.intervention-card');
        const index = cards.indexOf(card);
        if (index !== -1) {
          goToCard(index);
          startAutoSlide();
        }
      });
    });

    autoSlider.addEventListener('mouseenter', stopAutoSlide);
    autoSlider.addEventListener('mouseleave', startAutoSlide);

    window.addEventListener('resize', () => {
      updateSlider(currentIndex, false);
    });

    updateSlider(0, false);
    startAutoSlide();
  }

  const params = new URLSearchParams(window.location.search);
  const interventionId = params.get('intervention');

  if (interventionId && modal) {
    const targetCard = document.querySelector(`[data-gallery-item][data-id="${interventionId}"]`);

    if (targetCard) {
      setTimeout(() => {
        targetCard.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        openModal(targetCard);
      }, 350);
    }
  }
});