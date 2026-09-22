// ВНИМАНИЕ: демонстрационные данные.
// Реальный каталог (около 3000 позиций) придёт выгрузкой XLS из кабинета Ozon.
// Здесь заполнено только то, что видно на фотографиях поставщика.
// Поля, которых в источнике нет, оставлены пустыми намеренно — не выдумывать.

export const categories = [
  { slug: 'diffuzory',   title: 'Аромадиффузоры',        lead: 'Постоянный аромат в помещении без огня' },
  { slug: 'svechi',      title: 'Ароматические свечи',   lead: 'Интерьерные коллекции и подарочные линии' },
  { slug: 'sprei',       title: 'Спреи для текстиля',    lead: 'Бельё, шторы, обивка, салон автомобиля' },
  { slug: 'nabory',      title: 'Подарочные наборы',     lead: 'Готовая полка к сезону и корпоративные подарки' },
  { slug: 'avto',        title: 'Ароматизаторы для авто', lead: 'Ходовая позиция для касс и маркетплейсов' },
  { slug: 'uhod',        title: 'Уход и аромамасла',     lead: 'Дополнение к основной линейке и наборам' },
];

export const products = [
  {
    slug: 'whispy-diffuzor-vanilla-forever',
    title: 'Аромадиффузор Whispy «Vanilla Forever»',
    category: 'diffuzory',
    brand: 'Whispy',
    image: '/assets/whispy-diffuser-cut.png',
    imageBg: 'dark',
    alt: 'Аромадиффузор Whispy во флаконе тёмного стекла с ротанговыми палочками',
    lead: 'Диффузор с ротанговыми палочками для постоянного аромата в комнате.',
    specs: [
      ['Форма выпуска', 'Диффузор с палочками'],
      ['Тара', 'Стекло'],
      ['Комплект', 'Флакон, ротанговые палочки'],
      ['Аромат', 'Vanilla Forever'],
    ],
  },
  {
    slug: 'whispy-sprei-pudrovyy-leopard',
    title: 'Спрей для текстиля Whispy «Пудровый леопард»',
    category: 'sprei',
    brand: 'Whispy',
    image: '/assets/whispy-spray-cut.png',
    imageBg: 'light',
    alt: 'Спрей для текстиля Whispy во флаконе тёмного стекла с распылителем',
    lead: 'Спрей для белья, штор и обивки. Флакон тёмного стекла с пульверизатором.',
    specs: [
      ['Форма выпуска', 'Спрей'],
      ['Тара', 'Тёмное стекло'],
      ['Назначение', 'Текстиль, салон автомобиля'],
      ['Аромат', 'Пудровый леопард'],
    ],
  },
  {
    slug: 'whispy-avtoaromatizator',
    title: 'Ароматизатор для автомобиля Whispy',
    category: 'avto',
    brand: 'Whispy',
    image: '/assets/whispy-auto-cut.png',
    imageBg: 'light',
    alt: 'Ароматизатор Whispy для автомобиля: флакон в деревянном корпусе на шнурке',
    lead: 'Подвесной флакон в деревянном корпусе. Ходовая позиция для прикассовой зоны.',
    specs: [
      ['Форма выпуска', 'Подвесной флакон'],
      ['Корпус', 'Дерево'],
      ['Крепление', 'Шнур'],
    ],
  },
  {
    slug: 'whispy-podarochnyy-nabor',
    title: 'Подарочный набор Whispy',
    category: 'nabory',
    brand: 'Whispy',
    image: '/assets/whispy-card-1.jpg',
    imageBg: 'light',
    alt: 'Подарочный набор Whispy: спрей для текстиля, ароматизатор в автомобиль и два саше на крафтовой коробке',
    lead: 'Собранный набор в крафтовой коробке: спрей, ароматизатор в автомобиль и саше.',
    specs: [
      ['Состав набора', 'Спрей, ароматизатор в авто, саше'],
      ['Упаковка', 'Крафтовая коробка с вкладышем'],
    ],
  },
  {
    slug: 'whispy-nabor-diffuzor',
    title: 'Подарочный набор Whispy с диффузором',
    category: 'nabory',
    brand: 'Whispy',
    image: '/assets/opt-set3.png',
    imageBg: 'light',
    alt: 'Подарочная коробка Whispy с аромадиффузором, ротанговыми палочками и открыткой',
    lead: 'Диффузор в подарочной коробке с лентой и вкладышем.',
    specs: [
      ['Состав набора', 'Диффузор, ротанговые палочки, открытка'],
      ['Упаковка', 'Подарочная коробка с лентой'],
    ],
  },
  {
    slug: 'stoneglow-plum-blossom-musk',
    title: 'Свеча Stoneglow «Plum Blossom & Musk»',
    category: 'svechi',
    brand: 'Stoneglow',
    image: '/assets/opt-hero-crop.jpg',
    imageBg: 'light',
    alt: 'Ароматическая свеча Stoneglow Plum Blossom and Musk в стакане и фирменная коробка',
    lead: 'Свеча в стакане с фирменной коробкой. Коллекция британской фабрики Stoneglow.',
    specs: [
      ['Форма выпуска', 'Свеча в стакане'],
      ['Аромат', 'Plum Blossom & Musk'],
      ['Производитель', 'Stoneglow, Великобритания'],
    ],
  },
];

export const byCategory = (slug) => products.filter((p) => p.category === slug);
export const categoryOf = (slug) => categories.find((c) => c.slug === slug);
