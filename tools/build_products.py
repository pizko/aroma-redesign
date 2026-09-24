#!/usr/bin/env python3
"""Собирает страницы товаров из data/products.json.

Данные берутся только из прайса поставщика. Цены не публикуются: сайт оптовый,
условия подтверждаются на запрос. Разметка Product — без offers, рейтингов и
отзывов, потому что подтверждённых данных для них нет.

Запуск:  python3 tools/build_products.py
"""
import json
import pathlib
import html

ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = "https://pizko.github.io/aroma-redesign"
e = html.escape


def head(p):
    url = f"{BASE}/{p['слаг']}.html"
    ld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Product",
                "name": p["название"],
                "sku": p["артикул"],
                "brand": {"@type": "Brand", "name": p["бренд"]},
                "category": p["категория"],
                "description": p["краткое"],
                "image": [f"{BASE}/assets/{f}" for f, _ in p["фото"]],
                "additionalProperty": [
                    {"@type": "PropertyValue", "name": k, "value": v}
                    for k, v in p["характеристики"]
                    if k not in ("Бренд", "Артикул")
                ],
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Главная", "item": f"{BASE}/"},
                    {"@type": "ListItem", "position": 2, "name": "Каталог оптом", "item": f"{BASE}/wholesale.html"},
                    {"@type": "ListItem", "position": 3, "name": p["название"], "item": url},
                ],
            },
        ],
    }
    return f"""<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(p['название'])} оптом | Орлан</title>
  <meta name="description" content="{e(p['краткое'])} Оптовые поставки, условия по запросу.">
  <meta name="theme-color" content="#191817">
  <meta name="robots" content="noindex,nofollow">
  <link rel="canonical" href="{url}">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23431319'/%3E%3Cpath d='M16 13h32v38H16z' fill='none' stroke='%23f2eee5' stroke-width='2'/%3E%3Ccircle cx='32' cy='32' r='9' fill='none' stroke='%23bda478' stroke-width='2'/%3E%3C/svg%3E">
  <script>document.documentElement.classList.add('has-js');</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Prata&family=Golos+Text:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="styles.css">
  <script type="application/ld+json">
{json.dumps(ld, ensure_ascii=False, indent=2)}
  </script>
</head>"""


def page(p):
    photos = p["фото"]
    thumbs = "".join(
        f'<button class="pdp-thumb{" is-active" if i == 0 else ""}" type="button" '
        f'data-src="assets/{f}" data-alt="{e(a)}" aria-label="Фото {i + 1}">'
        f'<img src="assets/{f}" alt="" width="200" height="200" loading="lazy" decoding="async"></button>'
        for i, (f, a) in enumerate(photos)
    )
    specs = "".join(f"<div><dt>{e(k)}</dt><dd>{e(v)}</dd></div>" for k, v in p["характеристики"])
    about = "".join(f"<p>{e(t)}</p>" for t in p["описание"])
    kit = ""
    if p.get("комплектация"):
        kit = ('<div class="pdp-kit"><h2>Комплектация</h2><ul>'
               + "".join(f"<li>{e(x)}</li>" for x in p["комплектация"])
               + "</ul></div>")

    return f"""{head(p)}
<body class="inner-page" data-inquiry-recipient="info@opt-aroma.ru">
  <a class="skip-link" href="#main">Перейти к содержанию</a>

  <div class="announcement">
    <span>Оптовые поставки</span>
    <span>Условия по запросу</span>
    <span>Москва</span>
  </div>

  <header class="site-header" id="top">
    <a class="wordmark" href="index.html" aria-label="Орлан, на главную"><span>ОРЛАН</span><small>ароматический дом</small></a>
    <button class="menu-button" type="button" aria-expanded="false" aria-controls="main-menu"><span></span><span></span><b>Меню</b></button>
    <nav class="main-nav" id="main-menu" aria-label="Основная навигация">
      <a href="wholesale.html" aria-current="page">Каталог</a>
      <a href="index.html#brands">Бренды</a>
      <a href="private-label.html">СТМ</a>
      <a href="fragrance.html">Ателье</a>
      <a href="index.html#about">О компании</a>
    </nav>
    <a class="header-contact" href="#request">Контакты</a>
  </header>

  <nav class="crumbs" aria-label="Хлебные крошки">
    <a href="index.html">Главная</a>
    <i aria-hidden="true">/</i>
    <a href="wholesale.html">Каталог оптом</a>
    <i aria-hidden="true">/</i>
    <span aria-current="page">{e(p['название'])}</span>
  </nav>

  <main id="main">
    <article class="pdp">
      <div class="pdp-gallery reveal reveal-left">
        <figure class="pdp-stage"><img id="pdp-photo" src="assets/{photos[0][0]}" alt="{e(photos[0][1])}" width="1200" height="1200" decoding="async"></figure>
        <div class="pdp-thumbs" role="group" aria-label="Другие фотографии">{thumbs}</div>
      </div>

      <div class="pdp-copy reveal">
        <p class="eyebrow">{e(p['бренд'])} · {e(p['категория'])}</p>
        <h1>{e(p['название'])}</h1>
        <p class="page-lead">{e(p['краткое'])}</p>

        <p class="pdp-price">Цена, наличие и минимальная партия — по оптовому запросу.</p>
        <div class="page-actions">
          <button class="button button-dark" type="button" data-open-inquiry data-interest="{e(p['название'])} (артикул {e(p['артикул'])})">Запросить условия</button>
          <a class="button button-plain" href="wholesale.html">Весь каталог</a>
        </div>

        <div class="pdp-about">{about}</div>
      </div>
    </article>

    <section class="section pdp-specs" aria-labelledby="specs-title">
      <div class="section-heading reveal">
        <div><p class="eyebrow">Характеристики</p><h2 id="specs-title">Подтверждённые данные поставщика</h2></div>
        <p>Указано то, что есть в документации на товар. Остальное уточняем по запросу.</p>
      </div>
      <dl class="pdp-spec-list reveal">{specs}</dl>
      {kit}
    </section>

    <section class="request-band" id="request" aria-labelledby="request-title">
      <div><p class="eyebrow">Оптовым покупателям</p><h2 id="request-title">Запросите условия по этой позиции</h2></div>
      <button class="button button-light" type="button" data-open-inquiry data-interest="{e(p['название'])} (артикул {e(p['артикул'])})">Заполнить анкету</button>
    </section>
  </main>

  <footer class="site-footer">
    <a class="wordmark wordmark-footer" href="index.html"><span>ОРЛАН</span><small>ароматический дом</small></a>
    <p>Цены и наличие уточняются по запросу.</p>
    <a href="#top">Наверх ↑</a>
  </footer>
  <script src="app.js"></script>
</body>
</html>
"""


def main():
    data = json.loads((ROOT / "data/products.json").read_text(encoding="utf-8"))
    for p in data["товары"]:
        out = ROOT / f"{p['слаг']}.html"
        out.write_text(page(p), encoding="utf-8")
        print("собрано:", out.name)


if __name__ == "__main__":
    main()
