/* Inner pages: reveal on entry, phone menu, zoomable images, copy buttons. */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var M = window.Motion;

  // Reveal once on entry
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  // Phone menu
  var nav = document.querySelector('.bar nav'), btn = document.querySelector('.bar .menu');
  if (btn) btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open); btn.textContent = open ? 'Close' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && M && !reduce) M.animate(nav.querySelectorAll('li'), { opacity: [0, 1], y: [14, 0] }, { delay: M.stagger(0.04), duration: 0.4 });
  });
  if (nav) nav.addEventListener('click', function (e) { if (e.target.closest('a') && nav.classList.contains('open')) btn.click(); });

  // Lightbox for [data-zoom] images
  var lb = document.createElement('div');
  lb.className = 'lb'; lb.hidden = true; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image');
  lb.innerHTML = '<figure style="margin:0"><img alt=""><p></p></figure><button type="button">Close</button>';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('p'), lbBtn = lb.querySelector('button'), opener = null;
  function openLb(img) {
    opener = img; lbImg.src = img.getAttribute('data-full') || img.currentSrc || img.src; lbImg.alt = img.alt;
    lbCap.textContent = img.getAttribute('data-caption') || img.alt; lb.hidden = false; document.body.style.overflow = 'hidden'; lbBtn.focus();
    if (M && !reduce) M.animate(lbImg, { opacity: [0, 1], scale: [0.94, 1] }, { type: 'spring', stiffness: 260, damping: 26 });
  }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; if (opener) opener.focus(); }
  document.querySelectorAll('img[data-zoom]').forEach(function (img) {
    img.tabIndex = 0; img.setAttribute('role', 'button');
    img.addEventListener('click', function () { openLb(img); });
    img.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(img); } });
  });
  lbBtn.addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  // Copy account numbers
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-copy');
      (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(function () {
        var t = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = t; }, 1400);
      }).catch(function () { b.textContent = v; });
    });
  });

  // Spring lift on cards under a fine pointer
  if (M && !reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.board, .proj article, .acct, .portrait .ph, .letter').forEach(function (el) {
      el.addEventListener('pointerenter', function () { M.animate(el, { y: -5 }, { type: 'spring', stiffness: 320, damping: 26 }); });
      el.addEventListener('pointerleave', function () { M.animate(el, { y: 0 }, { type: 'spring', stiffness: 240, damping: 24 }); });
    });
  }
})();
