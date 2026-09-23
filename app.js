const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
});

menu?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  menu.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
});

function setupCatalog(root) {
  const cards = [...root.querySelectorAll('.product-card')];
  const groups = [...root.querySelectorAll('[data-filter-group]')];
  const search = root.querySelector('[data-catalog-search]');
  const counter = root.querySelector('[data-catalog-count]');
  const empty = root.querySelector('[data-catalog-empty]');
  const state = {};

  groups.forEach((group) => { state[group.dataset.filterGroup] = 'all'; });

  const plural = (n) => {
    const tail = n % 100 > 10 && n % 100 < 20 ? 0 : n % 10;
    if (tail === 1) return 'категория';
    if (tail > 1 && tail < 5) return 'категории';
    return 'категорий';
  };

  const apply = () => {
    const query = (search?.value || '').trim().toLowerCase();
    let shown = 0;

    cards.forEach((card) => {
      const byGroups = Object.entries(state).every(([key, value]) =>
        value === 'all' || (card.dataset[key] || '').split(' ').includes(value));
      const haystack = ((card.dataset.search || '') + ' ' + card.textContent).toLowerCase();
      const byQuery = !query || haystack.includes(query);
      card.hidden = !(byGroups && byQuery);
      if (!card.hidden) shown += 1;
    });

    if (counter) counter.textContent = shown + ' ' + plural(shown) + ' из ' + cards.length;
    if (empty) empty.hidden = shown !== 0;
  };

  groups.forEach((group) => {
    const buttons = [...group.querySelectorAll('.filter')];
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        state[group.dataset.filterGroup] = button.dataset.filter;
        buttons.forEach((item) => {
          const active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        apply();
      });
      button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));
    });
  });

  search?.addEventListener('input', apply);
  apply();
}

document.querySelectorAll('[data-catalog]').forEach(setupCatalog);

const hero = document.querySelector('.hero');
const directionLinks = [...document.querySelectorAll('[data-hero-target]')];
const heroNavLinks = [...document.querySelectorAll('[data-hero-nav]')];
const heroPanels = [...document.querySelectorAll('[data-hero-panel]')];

function setHeroScene(scene) {
  if (!hero || !scene) return;
  hero.dataset.heroScene = scene;
  directionLinks.forEach((link) => {
    link.classList.toggle('is-active', link.dataset.heroTarget === scene);
  });
  heroPanels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.heroPanel === scene);
  });
}

const coarsePointer = window.matchMedia('(hover: none)').matches;

directionLinks.forEach((link) => {
  const activate = () => setHeroScene(link.dataset.heroTarget);
  link.addEventListener('mouseenter', activate);
  link.addEventListener('focus', activate);
  link.addEventListener('click', (event) => {
    // На сенсорном экране навести курсор нельзя: первое касание показывает сцену,
    // второе — открывает страницу направления.
    if (coarsePointer && !link.classList.contains('is-active')) {
      event.preventDefault();
      activate();
    }
  });
});

heroNavLinks.forEach((link) => {
  const activate = () => setHeroScene(link.dataset.heroNav);
  link.addEventListener('mouseenter', activate);
  link.addEventListener('focus', activate);
});

const revealItems = [...document.querySelectorAll('.reveal')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -7% 0px',
  });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const inquiryButtons = [...document.querySelectorAll('[data-open-inquiry]')];

if (inquiryButtons.length) {
  const inquiryDialog = document.createElement('dialog');
  inquiryDialog.className = 'inquiry-dialog';
  inquiryDialog.setAttribute('aria-labelledby', 'inquiry-title');
  inquiryDialog.innerHTML = `
    <div class="inquiry-shell">
      <button class="inquiry-close" type="button" aria-label="Закрыть анкету">×</button>
      <p class="eyebrow">Предварительный запрос</p>
      <h2 id="inquiry-title">Расскажите о задаче</h2>
      <p>После заполнения откроется письмо с подготовленным текстом. Проверьте его и отправьте из своей почтовой программы.</p>
      <form class="inquiry-form">
        <label>Ваше имя<input name="name" autocomplete="name" required></label>
        <label>Компания<input name="company" autocomplete="organization"></label>
        <label>Телефон<input name="phone" type="tel" autocomplete="tel" required></label>
        <label>Электронная почта<input name="email" type="email" autocomplete="email"></label>
        <label class="field-wide">Что вас интересует<input name="interest" required></label>
        <label class="field-wide">Комментарий<textarea name="comment" placeholder="Категории, ориентировочный объём, задача проекта"></textarea></label>
        <p class="inquiry-note">Сайт не принимает оплату и не отправляет данные автоматически.</p>
        <button class="button button-dark" type="submit">Подготовить письмо</button>
      </form>
    </div>`;
  document.body.append(inquiryDialog);

  const inquiryForm = inquiryDialog.querySelector('.inquiry-form');
  const interestField = inquiryForm.elements.interest;
  const closeButton = inquiryDialog.querySelector('.inquiry-close');

  inquiryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      interestField.value = button.dataset.interest || '';
      inquiryDialog.showModal();
      inquiryForm.elements.name.focus();
    });
  });

  closeButton.addEventListener('click', () => inquiryDialog.close());
  inquiryDialog.addEventListener('click', (event) => {
    if (event.target === inquiryDialog) inquiryDialog.close();
  });

  inquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(inquiryForm);
    const recipient = document.body.dataset.inquiryRecipient || 'info@opt-aroma.ru';
    const interest = String(data.get('interest') || 'Запрос с сайта');
    const subject = `Запрос с сайта: ${interest}`;
    const body = [
      `Имя: ${data.get('name') || ''}`,
      `Компания: ${data.get('company') || ''}`,
      `Телефон: ${data.get('phone') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Интерес: ${interest}`,
      '',
      `Комментарий: ${data.get('comment') || ''}`,
    ].join('\n');
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  let ticking = false;
  const syncHeader = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(syncHeader);
  }, { passive: true });
  syncHeader();
}
