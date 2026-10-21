// Portfolio : navigation, filtre des projets et bascule clair/sombre.
const root = document.documentElement;
const toggleTheme = document.querySelector('.theme-toggle');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.nav-link')];
const progressBar = document.querySelector('.scroll-progress');
const filterButtons = [...document.querySelectorAll('.filter')];
const projectCards = [...document.querySelectorAll('.project-card')];

// Conserve le thème choisi, sans serveur ni compte utilisateur.
try {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
} catch (_) { /* Le site fonctionne aussi si le stockage est bloqué. */ }
const updateThemeLabel = () => {
  const light = root.dataset.theme === 'light';
  toggleTheme?.setAttribute('aria-label', light ? 'Passer en thème sombre' : 'Passer en thème clair');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f5f8fc' : '#080e1a');
};
updateThemeLabel();
toggleTheme?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch (_) {}
  updateThemeLabel();
});

const closeMenu = () => {
  nav?.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Ouvrir le menu');
};
menuButton?.addEventListener('click', () => {
  const willOpen = !nav?.classList.contains('is-open');
  nav?.classList.toggle('is-open', willOpen);
  menuButton?.setAttribute('aria-expanded', String(willOpen));
  menuButton?.setAttribute('aria-label', willOpen ? 'Fermer le menu' : 'Ouvrir le menu');
});
navLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => {
  if (!event.target.closest('.site-nav') && !event.target.closest('.menu-toggle')) closeMenu();
});

const sections = [...document.querySelectorAll('main section[id]')];
function updateScrollIndicators() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
  let current = sections[0]?.id;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 145) current = section.id;
  }
  navLinks.forEach(link => {
    const selected = link.getAttribute('href') === '#' + current;
    link.classList.toggle('active', selected);
    if (selected) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', updateScrollIndicators, { passive:true });
window.addEventListener('resize', updateScrollIndicators);
updateScrollIndicators();

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .10 });
  document.querySelectorAll('.reveal').forEach(item => observer.observe(item));
} else {
  document.querySelectorAll('.reveal').forEach(item => item.classList.add('is-visible'));
}

filterButtons.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  projectCards.forEach(card => {
    const show = category === 'tous' || card.dataset.category === category;
    card.hidden = !show;
    if (show) count++;
  });
  if (document.getElementById('visible-projects')) document.getElementById('visible-projects').textContent = String(count).padStart(2, '0');
}));

if (document.getElementById('current-year')) document.getElementById('current-year').textContent = new Date().getFullYear();
