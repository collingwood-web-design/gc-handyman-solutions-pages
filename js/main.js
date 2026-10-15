(function () {
  "use strict";

  // Mobile menu
  var toggle = document.getElementById("menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  if (toggle && mobileMenu) {
    toggle.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  // Sticky header shadow + scroll-to-top button
  var header = document.getElementById("site-header");
  var scrollTop = document.getElementById("scroll-top");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-stuck", y > 52);
    if (scrollTop) scrollTop.classList.toggle("is-visible", y > 800);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (scrollTop) {
    scrollTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Card icons slide in when scrolled into view
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Reviews slider
  var slider = document.querySelector(".reviews__slider");
  if (slider) {
    var track = slider.querySelector(".reviews__track");
    var reviews = track.querySelectorAll(".review");
    var index = 0;
    var timer;

    function perView() {
      return window.matchMedia("(max-width: 767px)").matches ? 1 : 2;
    }

    function maxIndex() {
      return Math.max(0, reviews.length - perView());
    }

    function go(i) {
      var max = maxIndex();
      if (i > max) i = 0;
      if (i < 0) i = max;
      index = i;
      track.style.transform = "translateX(-" + (index * 100 / perView()) + "%)";
    }

    function start() {
      stop();
      timer = setInterval(function () { go(index + 1); }, 6000);
    }

    function stop() {
      if (timer) clearInterval(timer);
    }

    slider.querySelector(".reviews__arrow--prev").addEventListener("click", function () { go(index - 1); start(); });
    slider.querySelector(".reviews__arrow--next").addEventListener("click", function () { go(index + 1); start(); });
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    window.addEventListener("resize", function () { go(index); markLongReviews(); });

    function markLongReviews() {
      reviews.forEach(function (review) {
        if (review.classList.contains("is-expanded")) return;
        var text = review.querySelector(".review__text");
        review.classList.toggle("has-more", text.scrollHeight > text.clientHeight + 1);
      });
    }

    reviews.forEach(function (review) {
      review.querySelector(".review__more").addEventListener("click", function () {
        var expanded = review.classList.toggle("is-expanded");
        this.textContent = expanded ? "Hide" : "Read more";
      });
    });

    markLongReviews();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(markLongReviews);
    start();
  }

  // Service area map lightbox
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    document.querySelectorAll(".lightbox-link").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        lbImg.src = link.getAttribute("href");
        lbImg.alt = link.getAttribute("title") || "";
        lightbox.hidden = false;
      });
    });
    function closeLightbox() { lightbox.hidden = true; }
    lightbox.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  var yearEl = document.getElementById("copyright-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
