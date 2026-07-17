(function () {
  const WEEKDAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  const WEEKDAYS_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  // WMO weather code -> { icon, nightIcon?, desc, grad: [from,to], glow }
  const WMO = {
    0: { icon: 'i-sun', nightIcon: 'i-moon', desc: 'Ясно', grad: ['#1e88c9', '#6dd5fa'], glow: 'rgba(255,196,90,.55)' },
    1: { icon: 'i-sun', nightIcon: 'i-moon', desc: 'Преимущественно ясно', grad: ['#2980b9', '#6dd5fa'], glow: 'rgba(255,196,90,.5)' },
    2: { icon: 'i-cloud-sun', nightIcon: 'i-cloud-moon', desc: 'Переменная облачность', grad: ['#4c6478', '#89b3c2'], glow: 'rgba(255,255,255,.3)' },
    3: { icon: 'i-cloud', desc: 'Пасмурно', grad: ['#3d4652', '#22282f'], glow: 'rgba(255,255,255,.16)' },
    45: { icon: 'i-fog', desc: 'Туман', grad: ['#5b6c7a', '#3a4550'], glow: 'rgba(255,255,255,.22)' },
    48: { icon: 'i-fog', desc: 'Изморозь', grad: ['#5b6c7a', '#3a4550'], glow: 'rgba(255,255,255,.22)' },
    51: { icon: 'i-drizzle', desc: 'Слабая морось', grad: ['#3f5f80', '#1e3550'], glow: 'rgba(150,190,255,.32)' },
    53: { icon: 'i-drizzle', desc: 'Морось', grad: ['#3a5876', '#1c3049'], glow: 'rgba(150,190,255,.32)' },
    55: { icon: 'i-drizzle', desc: 'Сильная морось', grad: ['#334f68', '#182a40'], glow: 'rgba(150,190,255,.32)' },
    56: { icon: 'i-drizzle', desc: 'Ледяная морось', grad: ['#3a5876', '#1c3049'], glow: 'rgba(150,190,255,.32)' },
    57: { icon: 'i-drizzle', desc: 'Сильная ледяная морось', grad: ['#334f68', '#182a40'], glow: 'rgba(150,190,255,.32)' },
    61: { icon: 'i-rain', desc: 'Небольшой дождь', grad: ['#2f4d67', '#151f28'], glow: 'rgba(120,170,255,.35)' },
    63: { icon: 'i-rain', desc: 'Дождь', grad: ['#294a63', '#151f28'], glow: 'rgba(120,170,255,.35)' },
    65: { icon: 'i-rain', desc: 'Сильный дождь', grad: ['#20242c', '#0d1015'], glow: 'rgba(120,170,255,.4)' },
    66: { icon: 'i-rain', desc: 'Ледяной дождь', grad: ['#2f4d67', '#151f28'], glow: 'rgba(120,170,255,.35)' },
    67: { icon: 'i-rain', desc: 'Сильный ледяной дождь', grad: ['#20242c', '#0d1015'], glow: 'rgba(120,170,255,.4)' },
    71: { icon: 'i-snow', desc: 'Небольшой снег', grad: ['#5f7a95', '#a9c6d8'], glow: 'rgba(255,255,255,.4)' },
    73: { icon: 'i-snow', desc: 'Снег', grad: ['#54708c', '#9bb9cc'], glow: 'rgba(255,255,255,.4)' },
    75: { icon: 'i-snow', desc: 'Сильный снег', grad: ['#44576b', '#8199ac'], glow: 'rgba(255,255,255,.4)' },
    77: { icon: 'i-snow', desc: 'Снежная крупа', grad: ['#54708c', '#9bb9cc'], glow: 'rgba(255,255,255,.4)' },
    80: { icon: 'i-rain', desc: 'Небольшой ливень', grad: ['#2f4d67', '#151f28'], glow: 'rgba(120,170,255,.35)' },
    81: { icon: 'i-rain', desc: 'Ливень', grad: ['#294a63', '#151f28'], glow: 'rgba(120,170,255,.35)' },
    82: { icon: 'i-storm', desc: 'Сильный ливень', grad: ['#1c1f26', '#08090c'], glow: 'rgba(150,120,255,.4)' },
    85: { icon: 'i-snow', desc: 'Небольшой снегопад', grad: ['#5f7a95', '#a9c6d8'], glow: 'rgba(255,255,255,.4)' },
    86: { icon: 'i-snow', desc: 'Сильный снегопад', grad: ['#44576b', '#8199ac'], glow: 'rgba(255,255,255,.4)' },
    95: { icon: 'i-storm', desc: 'Гроза', grad: ['#1c1f26', '#08090c'], glow: 'rgba(150,120,255,.45)' },
    96: { icon: 'i-storm', desc: 'Гроза с градом', grad: ['#1c1f26', '#08090c'], glow: 'rgba(150,120,255,.45)' },
    99: { icon: 'i-storm', desc: 'Сильная гроза с градом', grad: ['#15171c', '#050608'], glow: 'rgba(150,120,255,.5)' },
  };
  const RAIN_CODES = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
  const SNOW_CODES = [71, 73, 75, 77, 85, 86];
  const DEFAULT_INFO = { icon: 'i-cloud', desc: 'Неизвестно', grad: ['#2a5298', '#16222a'], glow: 'rgba(255,255,255,.2)' };

  const STORAGE_KEY = 'wf_locations_v1';
  const NOTIFY_KEY = 'wf_notify_enabled';
  const NOTIFY_LOG_KEY = 'wf_notify_log';

  const pager = document.getElementById('pager');
  const dotsEl = document.getElementById('dots');
  const refreshBtn = document.getElementById('refreshBtn');
  const notifyBtn = document.getElementById('notifyBtn');
  const bgCanvas = document.getElementById('bgCanvas');
  const ctx = bgCanvas.getContext('2d');

  let locations = loadLocations();
  let pages = [];
  let currentPageIndex = 0;
  let swReg = null;

  function loadLocations() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveLocations() { localStorage.setItem(STORAGE_KEY, JSON.stringify(locations)); }

  function iconInfo(weathercode, isDay) {
    const info = WMO[weathercode] || DEFAULT_INFO;
    const iconId = (isDay === 0 && info.nightIcon) ? info.nightIcon : info.icon;
    return { iconId, desc: info.desc, grad: info.grad, glow: info.glow };
  }

  // ---------- pages ----------

  function buildPager() {
    pager.innerHTML = '';
    pages = [];
    pages.push(createWeatherPage({ id: 'geo', type: 'geo', name: null }));
    locations.forEach(loc => pages.push(createWeatherPage(loc)));
    pages.push(createAddPage());
    pages.forEach(p => pager.appendChild(p.el));
    buildDots();
  }

  function createWeatherPage(loc) {
    const el = document.createElement('section');
    el.className = 'page';
    const nameLabel = loc.type === 'geo' ? 'Моё местоположение' : loc.name;
    el.innerHTML = `
      <div class="date-block">
        <div class="date-line">&nbsp;</div>
        <div class="clock">&nbsp;</div>
      </div>
      <div class="weather-body">
        <div class="weather-icon-wrap"><svg class="weather-icon"><use href="#i-cloud"></use></svg></div>
        <div class="temp">--°</div>
        <div class="temp-feels"></div>
        <div class="desc">Загрузка…</div>
        <div class="hi-lo"></div>
        <div class="forecast-strip"></div>
      </div>
      <div class="page-footer">
        <div class="location-name"><svg><use href="#i-pin"></use></svg><span>${nameLabel}</span></div>
        ${loc.type === 'city' ? '<button class="remove-btn">Удалить</button>' : ''}
      </div>
      <div class="status"></div>
    `;
    const refs = {
      dateLine: el.querySelector('.date-line'),
      clock: el.querySelector('.clock'),
      iconWrap: el.querySelector('.weather-icon-wrap'),
      iconUse: el.querySelector('.weather-icon use'),
      temp: el.querySelector('.temp'),
      feels: el.querySelector('.temp-feels'),
      desc: el.querySelector('.desc'),
      hiLo: el.querySelector('.hi-lo'),
      strip: el.querySelector('.forecast-strip'),
      locationName: el.querySelector('.location-name span'),
      removeBtn: el.querySelector('.remove-btn'),
      status: el.querySelector('.status'),
    };
    const page = { el, refs, loc, type: 'weather', utcOffset: 0, weathercode: null, isDay: 1 };
    if (refs.removeBtn) refs.removeBtn.addEventListener('click', () => removeLocation(loc.id));
    return page;
  }

  function createAddPage() {
    const el = document.createElement('section');
    el.className = 'page add-page';
    el.innerHTML = `
      <div class="add-page-inner">
        <div class="add-title">Добавить город</div>
        <input type="text" class="city-input" placeholder="Введите город" autocapitalize="words" autocorrect="off">
        <div class="city-results"></div>
      </div>
    `;
    const input = el.querySelector('.city-input');
    const results = el.querySelector('.city-results');
    let debounceTimer;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const q = input.value.trim();
      if (q.length < 2) { results.innerHTML = ''; return; }
      debounceTimer = setTimeout(() => searchCity(q, results), 350);
    });
    return { el, refs: {}, type: 'add' };
  }

  function searchCity(query, resultsEl) {
    resultsEl.innerHTML = '<div class="hint">Ищем…</div>';
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=ru&format=json`)
      .then(r => r.json())
      .then(data => {
        resultsEl.innerHTML = '';
        const list = data.results || [];
        if (!list.length) { resultsEl.innerHTML = '<div class="hint">Ничего не найдено</div>'; return; }
        list.forEach(res => {
          const div = document.createElement('div');
          div.className = 'city-result';
          const region = [res.admin1, res.country].filter(Boolean).join(', ');
          div.textContent = region ? `${res.name} (${region})` : res.name;
          div.addEventListener('click', () => addLocation(res));
          resultsEl.appendChild(div);
        });
      })
      .catch(() => { resultsEl.innerHTML = '<div class="hint">Ошибка поиска</div>'; });
  }

  function addLocation(res) {
    const id = 'city_' + res.id;
    if (locations.some(l => l.id === id)) { goToLocation(id); return; }
    locations.push({
      id, type: 'city',
      name: res.name,
      admin1: res.admin1 || '',
      country: res.country || '',
      lat: res.latitude,
      lon: res.longitude,
    });
    saveLocations();
    buildPager();
    fetchAllPages();
    goToLocation(id);
  }

  function removeLocation(id) {
    locations = locations.filter(l => l.id !== id);
    saveLocations();
    buildPager();
    fetchAllPages();
    scrollToPage(Math.min(currentPageIndex, pages.length - 1), false);
  }

  function goToLocation(id) {
    const idx = pages.findIndex(p => p.loc && p.loc.id === id);
    if (idx !== -1) scrollToPage(idx, true);
  }

  function scrollToPage(idx, smooth) {
    pager.scrollTo({ left: idx * pager.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
    currentPageIndex = idx;
    updateDots();
    applyPageVisuals(pages[idx]);
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    pages.forEach(p => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (p.type === 'add' ? ' dot-add' : '');
      dotsEl.appendChild(dot);
    });
    updateDots();
  }
  function updateDots() {
    [...dotsEl.children].forEach((d, i) => d.classList.toggle('active', i === currentPageIndex));
  }

  // ---------- clock ----------

  function tickClocks() {
    pages.forEach(p => {
      if (p.type !== 'weather') return;
      const nowMs = Date.now() + new Date().getTimezoneOffset() * 60000 + p.utcOffset * 1000;
      const d = new Date(nowMs);
      const weekdayCap = WEEKDAYS[d.getDay()].charAt(0).toUpperCase() + WEEKDAYS[d.getDay()].slice(1);
      p.refs.dateLine.textContent = `${weekdayCap}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
      p.refs.clock.textContent = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    });
  }
  setInterval(tickClocks, 1000);

  // ---------- weather ----------

  function fetchWeatherFor(page) {
    if (page.type !== 'weather') return;
    if (page.loc.type === 'geo') {
      page.refs.status.textContent = 'Определяем местоположение…';
      if (!('geolocation' in navigator)) {
        page.refs.status.textContent = 'Геолокация недоступна. Добавьте город свайпом вправо →';
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => {
          page.loc.lat = pos.coords.latitude;
          page.loc.lon = pos.coords.longitude;
          loadWeatherData(page);
        },
        () => { page.refs.status.textContent = 'Доступ к геолокации не получен. Добавьте город свайпом вправо →'; },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
      );
    } else {
      loadWeatherData(page);
    }
  }

  function loadWeatherData(page) {
    page.refs.status.textContent = 'Загружаем погоду…';
    const { lat, lon } = page.loc;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current_weather=true` +
      `&hourly=apparent_temperature,precipitation_probability,temperature_2m` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
      `&timezone=auto`;
    fetch(url)
      .then(r => { if (!r.ok) throw new Error('http_' + r.status); return r.json(); })
      .then(data => {
        page.utcOffset = data.utc_offset_seconds || 0;
        page.weathercode = data.current_weather.weathercode;
        page.isDay = data.current_weather.is_day;
        renderWeather(page, data);
        if (page.loc.type === 'geo' && !page.loc.name) {
          reverseGeocode(lat, lon).then(name => {
            if (name) { page.loc.name = name; page.refs.locationName.textContent = name; }
          });
        }
        if (pages.indexOf(page) === currentPageIndex) applyPageVisuals(page);
        maybeNotify(page, data);
      })
      .catch(() => { page.refs.status.textContent = 'Не удалось загрузить погоду.'; });
  }

  function reverseGeocode(lat, lon) {
    return fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ru`)
      .then(r => r.ok ? r.json() : null)
      .then(d => (d && (d.city || d.locality)) || null)
      .catch(() => null);
  }

  function renderWeather(page, data) {
    const cw = data.current_weather;
    const info = iconInfo(cw.weathercode, cw.is_day);

    page.refs.iconUse.setAttribute('href', '#' + info.iconId);
    page.refs.iconWrap.style.setProperty('--icon-glow', info.glow);
    page.refs.temp.textContent = Math.round(cw.temperature) + '°';
    page.refs.desc.textContent = info.desc;
    page.refs.status.textContent = '';
    page.el.classList.add('is-loaded');

    if (data.hourly && data.hourly.apparent_temperature) {
      const hourKey = cw.time.slice(0, 13) + ':00';
      const idx = data.hourly.time.indexOf(hourKey);
      if (idx !== -1) page.refs.feels.textContent = `Ощущается как ${Math.round(data.hourly.apparent_temperature[idx])}°`;
    }

    if (data.daily) {
      page.refs.hiLo.textContent = `Макс. ${Math.round(data.daily.temperature_2m_max[0])}° / Мин. ${Math.round(data.daily.temperature_2m_min[0])}°`;
      renderForecastStrip(page, data.daily);
    }
  }

  function renderForecastStrip(page, daily) {
    page.refs.strip.innerHTML = '';
    daily.time.forEach((dateStr, i) => {
      const d = new Date(dateStr + 'T00:00:00');
      const info = iconInfo(daily.weathercode[i], 1);
      const card = document.createElement('div');
      card.className = 'forecast-card';
      card.innerHTML = `
        <div class="fc-day">${i === 0 ? 'Сегодня' : WEEKDAYS_SHORT[d.getDay()]}</div>
        <svg class="fc-icon"><use href="#${info.iconId}"></use></svg>
        <div class="fc-hi">${Math.round(daily.temperature_2m_max[i])}°</div>
        <div class="fc-lo">${Math.round(daily.temperature_2m_min[i])}°</div>
      `;
      page.refs.strip.appendChild(card);
    });
  }

  function fetchAllPages() {
    pages.forEach(fetchWeatherFor);
  }

  // ---------- background: gradient + rain/snow canvas ----------

  let bgMode = 'none';
  let particles = [];
  let animId = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('pageshow', resizeCanvas);
  // На холодном запуске установленного на "Домой" приложения iOS иногда
  // сообщает innerWidth/innerHeight до того, как безопасные зоны окончательно
  // применены — досчитываем размер канваса чуть позже, чтобы не было щели.
  setTimeout(resizeCanvas, 300);
  resizeCanvas();

  function applyPageVisuals(page) {
    if (!page || page.type !== 'weather') {
      document.documentElement.style.background = `linear-gradient(180deg, ${DEFAULT_INFO.grad[0]} 0%, ${DEFAULT_INFO.grad[1]} 100%)`;
      setCanvasMode('none');
      return;
    }
    const info = WMO[page.weathercode] || DEFAULT_INFO;
    const dim = page.isDay === 0 ? 0.62 : 1;
    const shade = c => {
      const n = parseInt(c.slice(1), 16);
      const r = Math.round(((n >> 16) & 255) * dim);
      const g = Math.round(((n >> 8) & 255) * dim);
      const b = Math.round((n & 255) * dim);
      return `rgb(${r},${g},${b})`;
    };
    // Красим фон на <html>, а не на <body> — так гарантированно нет чёрных
    // полос вокруг Dynamic Island/чёлки и над Home Indicator в standalone-режиме.
    document.documentElement.style.background = `linear-gradient(180deg, ${shade(info.grad[0])} 0%, ${shade(info.grad[1])} 100%)`;
    setCanvasMode(RAIN_CODES.includes(page.weathercode) ? 'rain' : SNOW_CODES.includes(page.weathercode) ? 'snow' : 'none');
  }

  function setCanvasMode(mode) {
    if (mode === bgMode) return;
    bgMode = mode;
    particles = [];
    const count = mode === 'rain' ? 120 : mode === 'snow' ? 90 : 0;
    for (let i = 0; i < count; i++) particles.push(spawnParticle(mode));
    if (mode !== 'none' && !animId && !prefersReducedMotion) animLoop();
    if (mode === 'none') ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  }

  function spawnParticle(mode) {
    const x = Math.random() * bgCanvas.width;
    const y = Math.random() * bgCanvas.height;
    if (mode === 'rain') return { x, y, len: 10 + Math.random() * 12, speed: 6 + Math.random() * 6, drift: 1 };
    return { x, y, r: 1.5 + Math.random() * 2.5, speed: 0.6 + Math.random() * 1.2, sway: Math.random() * Math.PI * 2 };
  }

  function animLoop() {
    if (bgMode === 'none' || document.hidden) { animId = null; return; }
    ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    if (bgMode === 'rain') {
      ctx.strokeStyle = 'rgba(200,220,255,0.35)';
      ctx.lineWidth = 1.5;
      particles.forEach(p => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.drift * 3, p.y + p.len);
        ctx.stroke();
        p.y += p.speed;
        p.x -= p.drift;
        if (p.y > bgCanvas.height) { p.y = -p.len; p.x = Math.random() * bgCanvas.width; }
      });
    } else if (bgMode === 'snow') {
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      particles.forEach(p => {
        p.sway += 0.02;
        ctx.beginPath();
        ctx.arc(p.x + Math.sin(p.sway) * 8, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.speed;
        if (p.y > bgCanvas.height) { p.y = -5; p.x = Math.random() * bgCanvas.width; }
      });
    }
    animId = requestAnimationFrame(animLoop);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && bgMode !== 'none' && !animId && !prefersReducedMotion) animLoop();
  });

  // ---------- notifications ----------
  // Локальные уведомления запускаются только при открытии/обновлении приложения:
  // без собственного сервера настоящий push при полностью закрытом приложении на iOS невозможен.

  function updateNotifyBtnUI() {
    const enabled = localStorage.getItem(NOTIFY_KEY) === '1';
    notifyBtn.textContent = enabled ? '🔔' : '🔕';
    notifyBtn.setAttribute('aria-label', enabled ? 'Уведомления включены' : 'Включить уведомления');
  }

  notifyBtn.addEventListener('click', () => {
    const enabled = localStorage.getItem(NOTIFY_KEY) === '1';
    if (enabled) { localStorage.setItem(NOTIFY_KEY, '0'); updateNotifyBtnUI(); return; }
    if (!('Notification' in window)) {
      alert('Уведомления не поддерживаются этим браузером. На iOS: добавьте приложение на экран «Домой» (Поделиться → На экран «Домой», iOS 16.4+), затем повторите здесь.');
      return;
    }
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        localStorage.setItem(NOTIFY_KEY, '1');
      } else {
        alert('Разрешение на уведомления не получено.');
      }
      updateNotifyBtnUI();
    });
  });

  function maybeNotify(page, data) {
    if (localStorage.getItem(NOTIFY_KEY) !== '1') return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    if (pages.indexOf(page) !== 0) return; // только для первой страницы (моё местоположение)

    const today = new Date().toISOString().slice(0, 10);
    let log = {};
    try { log = JSON.parse(localStorage.getItem(NOTIFY_LOG_KEY)) || {}; } catch (e) {}
    if (log.date !== today) log = { date: today, rain: false, cold: false };

    const hourly = data.hourly;
    const cw = data.current_weather;
    if (!hourly) return;
    const hourKey = cw.time.slice(0, 13) + ':00';
    const idx = hourly.time.indexOf(hourKey);
    if (idx === -1) return;

    const maxProb = Math.max(0, ...hourly.precipitation_probability.slice(idx, idx + 3));
    if (!log.rain && maxProb >= 60 && !RAIN_CODES.includes(cw.weathercode)) {
      sendNotification('Скоро дождь', `Вероятность осадков в ближайшие часы ~${maxProb}%`);
      log.rain = true;
    }

    const nextTemps = hourly.temperature_2m.slice(idx, idx + 4);
    const drop = nextTemps.length ? cw.temperature - Math.min(...nextTemps) : 0;
    if (!log.cold && drop >= 5) {
      sendNotification('Похолодание', `Ожидается снижение температуры примерно на ${Math.round(drop)}°`);
      log.cold = true;
    }

    localStorage.setItem(NOTIFY_LOG_KEY, JSON.stringify(log));
  }

  function sendNotification(title, body) {
    if (swReg) swReg.showNotification(title, { body, tag: title });
    else new Notification(title, { body });
  }

  // ---------- service worker (офлайн-кэш) ----------

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => { swReg = reg; }).catch(() => {});
  }

  // ---------- pager scroll tracking ----------

  let scrollTimer;
  pager.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const idx = Math.round(pager.scrollLeft / pager.clientWidth);
      if (idx !== currentPageIndex && pages[idx]) {
        currentPageIndex = idx;
        updateDots();
        applyPageVisuals(pages[idx]);
      }
    }, 80);
  });

  refreshBtn.addEventListener('click', () => {
    refreshBtn.classList.add('spinning');
    fetchAllPages();
    setTimeout(() => refreshBtn.classList.remove('spinning'), 900);
  });

  // ---------- init ----------

  buildPager();
  applyPageVisuals(pages[0]);
  fetchAllPages();
  tickClocks();
  updateNotifyBtnUI();
})();
