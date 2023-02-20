'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////
// Button scrolling

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());
  // console.log(window.scrollX, window.scrollY);
  // console.log(
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrolling
  // Old school way:

  // Without smoothness
  // window.scrollTo(s1coords.left, s1coords.top + window.scrollY);

  // With smoothness
  // window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: 'smooth',
  // });

  // Modern way:
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

/////////////////////////////
// Page navigation

// Attaching the same event handler on ALL THE ELEMENTS (not a good practice)
// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     // console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Using Event Delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  const id = e.target.getAttribute('href');
  if (e.target.classList.contains('nav__link')) {
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

///////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // If the click happened outside the tab but inside the tab container then do nothing
  if (!clicked) return;

  // Removing the active class from every tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  // Removing the active class from all 3 contents
  tabsContent.forEach(content => {
    content.classList.remove('operations__content--active');
  });

  // Applying the active class on the tab which was clicked
  clicked.classList.add('operations__tab--active');

  // Showing the content of the selected tab
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibilings = link.closest('.nav').querySelectorAll('.nav__link');
    sibilings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
      const logo = link.closest('.nav').querySelector('img');
      logo.style.opacity = this;
    });
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////
// Sticky navigation: The scroll event
// Bad practice:
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Sticky navigation: The Intersection Observer API

// const obsCallback = function (entries, observer) {
//   // entries.forEach(entry => console.log(entry));
//   entries.forEach(entry => {
//     if (entry.isIntersecting === true) {
//       nav.classList.add('sticky');
//     } else nav.classList.remove('sticky');
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: 0.2,
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

const header = document.querySelector('.header');
headerObserver.observe(header);

///////////////////////////////////////////
// Revealing sections on scroll

const revealSection = function (entries, observer) {
  const [entry] = entries;

  // Guard clause
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  // sectionObserver.unobserve(entry.target);
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

const allSections = document.querySelectorAll('.section');
allSections.forEach(section => {
  // section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

///////////////////////////////
// Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');

// const loadImg = function (entries, observer) {
//   entries.forEach(entry => {
//     if (!entry.isIntersecting) return;
//     entry.target.src = entry.target.dataset.src;

//     entry.target.addEventListener('load', function () {
//       entry.target.classList.remove('lazy-img');
//     });
//     observer.unobserve(entry.target);
//   });
// };

// const imgObserver = new IntersectionObserver(loadImg, {
//   root: null,
//   threshold: 0,
//   rootMargin: '-200px',
// });
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//////////////////////////////////////////
// Slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  // Dots
  const dotContainer = document.querySelector('.dots');

  // Temporary
  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(.3) translateX(-1400px)';
  // slider.style.overflow = 'visible';

  let currSlide = 0;
  const maxSlide = slides.length - 1;

  // Functions

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide='${i}'></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (currSlide === maxSlide) currSlide = 0;
    else {
      currSlide++;
    }

    goToSlide(currSlide);
    activateDot(currSlide);
  };

  const prevSlide = function () {
    if (currSlide === 0) currSlide = maxSlide;
    else {
      currSlide--;
    }
    goToSlide(currSlide);
    activateDot(currSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers
  btnLeft.addEventListener('click', prevSlide);
  btnRight.addEventListener('click', nextSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
///////////////////////////////////////////
// Creating and inserting cookie message
// const header = document.querySelector('.header');
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML =
//   'We use cookies for improved functionality and analytics <button class="btn btn--close--cookie">Got it! </button>';
// header.append(message);

// Deleting cookie message on click
// document.querySelector('.btn--close--cookie').addEventListener('click', () => {
//   message.remove();
// });

// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// Using getComputedStyle to INCREASE the existing height
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////

/*

// The ‘root’ in CSS (where we define CSS variables) is the document.documentElement in JavaScript.
// So we can use this to change/set CSS variables like this:
// document.documentElement.style.setProperty('--color-primary', 'red');

const logo = document.querySelector('.nav__logo');

console.log(logo);

console.log(logo.src);
console.log(logo.getAttribute('alt'));

// Accessing and setting DATA attributes
logo.dataset.versionNumber = '3';
console.log(logo.dataset.versionNumber);

const h1 = document.querySelector('h1');
const alerth1 = function () {
  alert('mouseenter: EVENT TRIGGERED!');
  // To only listen for event once:
  // h1.removeEventListener('mouseenter', alerth1);
};

// h1.onmouseenter = alerth1;

// h1.addEventListener('mouseenter', alerth1);

// Deleting the event handler based on time passed
setTimeout(() => {
  h1.removeEventListener('mouseenter', alerth1);
}, 5000);

// Event Propagation ==================================================================

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK');
  // console.log(e.target);
  // console.log(e.currentTarget);
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINKS');
  // console.log(e.target);
  // console.log(e.currentTarget);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV');
    // console.log(e.target);
    // console.log(e.currentTarget);
  },
  true
);

// ================================================================================

const h1 = document.querySelector('h1');

// DOM Traversing

// Going downwards (children)
console.log(h1.children);
console.log(h1.childNodes);
console.log(h1.childElementCount);
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.firstElementChild);
console.log(h1.lastChild);

// Going upwards (parents)
console.log(h1.parentElement);
console.log(h1.parentNode);
console.log(h1.closest('.header'));

// Going sideways (sibilings)
console.log(h1.nextElementSibling);
console.log(h1.previousElementSibling);
// [...h1.parentElement.children].forEach(el => {
//   if (el !== h1) el.style.transform = 'scale(.5)';
// });
*/

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('DOM Content Loaded!', e);
});

window.addEventListener('load', function (e) {
  console.log('Resources also loaded!', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   e.returnValue = '';
//   console.log(e);
// });
