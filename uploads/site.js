// shared nav + footer + scroll animations for IH-FoA site
(function() {

  // ─── NAV SCROLL SHRINK ───
  const nav = document.getElementById('site-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ─── SCROLL REVEAL ───
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

  // ─── COUNTER ANIMATION ───
  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // ─── TESTIMONIAL CAROUSEL ───
  const track = document.querySelector('.testi-track');
  const dots  = document.querySelectorAll('.testi-dot');
  if (track && dots.length) {
    let current = 0;
    const cards = track.querySelectorAll('.testi-card');
    const total = Math.ceil(cards.length / 3);

    function goTo(idx) {
      current = idx;
      const cardW = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${current * cardW * 3}px)`;
      dots.forEach((d,i) => d.classList.toggle('active', i === current));
    }

    dots.forEach((d,i) => d.addEventListener('click', () => goTo(i)));

    let autoTimer = setInterval(() => goTo((current + 1) % total), 5000);
    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('mouseleave', () => { autoTimer = setInterval(() => goTo((current + 1) % total), 5000); });
  }

  // ─── ACTIVE NAV LINK ───
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ─── FAQ ACCORDION ───
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        const ans = o.nextElementSibling;
        if (ans && ans.classList.contains('faq-a')) {
          ans.style.maxHeight = '0';
          ans.style.paddingBottom = '0';
        }
      });
      if (!isOpen) {
        item.classList.add('open');
        const ans = item.nextElementSibling;
        if (ans && ans.classList.contains('faq-a')) {
          ans.style.maxHeight = ans.scrollHeight + 'px';
          ans.style.paddingBottom = '20px';
        }
      }
    });
  });

  // ─── LOAD BLOG POSTS ───
  function loadBlogPosts() {
    const grid = document.querySelector('.blog-grid');
    if (!grid) return;

    // Clear existing content
    grid.innerHTML = '';

    // Check if BLOG_POSTS is available (from blog-data.js)
    if (typeof BLOG_POSTS !== 'undefined' && BLOG_POSTS.length > 0) {
      // Load from data
      const posts = BLOG_POSTS.slice(0, 3);

      posts.forEach((post, index) => {
        const card = document.createElement('a');
        card.href = post.slug;
        card.className = 'blog-card';
        card.setAttribute('data-reveal', '');
        card.setAttribute('data-delay', (index + 1).toString());
        card.style.textDecoration = 'none';
        card.style.display = 'block';
        card.style.color = 'inherit';

        card.innerHTML = `
          <div class="blog-thumb">
            <img loading="lazy" src="${post.image}" alt="${post.title}" style="width:100%; height:200px; object-fit:cover;">
          </div>
          <div class="blog-body" style="padding:24px;">
            <div class="blog-tag">${post.category.toUpperCase()}</div>
            <h4 style="margin:12px 0 16px;">${post.title}</h4>
            <div class="blog-meta">
              <span>${new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>${post.readTime}</span>
            </div>
          </div>
        `;

        grid.appendChild(card);
      });
    } else {
      // Fallback for local development (file:// protocol)
      const fallbackPosts = [
        {
          title: "OSHA's Crystalline Silica Standard: A Complete Field Guide for Manufacturing Compliance",
          category: "Silica Safety",
          date: "Apr 15, 2026",
          readTime: "12 min read",
          image: "images/blog-silica-dust.webp",
          slug: "blog/crystalline-silica.html"
        }
      ];

      fallbackPosts.forEach((post, index) => {
        const card = document.createElement('a');
        card.href = post.slug;
        card.className = 'blog-card';
        card.setAttribute('data-reveal', '');
        card.setAttribute('data-delay', (index + 1).toString());
        card.style.textDecoration = 'none';
        card.style.display = 'block';
        card.style.color = 'inherit';

        card.innerHTML = `
          <div class="blog-thumb">
            <img loading="lazy" src="${post.image}" alt="${post.title}" style="width:100%; height:200px; object-fit:cover;">
          </div>
          <div class="blog-body" style="padding:24px;">
            <div class="blog-tag">${post.category.toUpperCase()}</div>
            <h4 style="margin:12px 0 16px;">${post.title}</h4>
            <div class="blog-meta">
              <span>${post.date}</span>
              <span>${post.readTime}</span>
            </div>
          </div>
        `;

        grid.appendChild(card);
      });
    }
  }

  // Load blog posts on page load
  loadBlogPosts();

})();
