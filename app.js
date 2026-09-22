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

const filterButtons = [...document.querySelectorAll('.filter')];
const productCards = [...document.querySelectorAll('.product-card')];

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    productCards.forEach((card) => {
      const categories = card.dataset.category.split(' ');
      card.hidden = selected !== 'all' && !categories.includes(selected);
    });
  });
});

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

directionLinks.forEach((link) => {
  const activate = () => setHeroScene(link.dataset.heroTarget);
  link.addEventListener('mouseenter', activate);
  link.addEventListener('focus', activate);
  link.addEventListener('pointerdown', activate);
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
