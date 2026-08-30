(() => {
  const root = document.querySelector('#conference-map');
  const events = window.CJG_CONFERENCE_EVENTS;
  if (!root || !window.L || !Array.isArray(events)) return;

  const map = L.map(root, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView([47, 9], 3);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 8
  }).addTo(map);
  const markers = L.layerGroup().addTo(map);
  const summary = document.querySelector('.map-summary');
  const labels = {
    en: { events: 'events', cities: 'cities', presentations: 'Presentations', coauthor: 'co-author presentation' },
    fr: { events: 'événements', cities: 'villes', presentations: 'Présentations', coauthor: 'présentation par un coauteur' }
  };

  const inPeriod = (year, period) => ({ all: true, recent: year >= 2020, '2010s': year >= 2010 && year <= 2019, early: year <= 2009 })[period];
  const language = () => document.documentElement.lang === 'fr' ? 'fr' : 'en';

  function render(period = 'all') {
    const selected = events.filter(entry => inPeriod(entry.year, period));
    const grouped = new Map();
    selected.forEach(entry => {
      const key = `${entry.city}|${entry.lat}|${entry.lng}`;
      if (!grouped.has(key)) grouped.set(key, { city: entry.city, lat: entry.lat, lng: entry.lng, entries: [] });
      grouped.get(key).entries.push(entry);
    });
    markers.clearLayers();
    const text = labels[language()];
    grouped.forEach(location => {
      const count = location.entries.length;
      const items = location.entries.sort((a, b) => b.year - a.year).map(entry => `<li><span>${entry.year}</span> ${entry.title}${entry.coauthor ? ` <em>(${text.coauthor})</em>` : ''}</li>`).join('');
      const marker = L.circleMarker([location.lat, location.lng], {
        radius: Math.min(15, 6 + Math.sqrt(count) * 2),
        color: '#155777', weight: 1.5, fillColor: '#1e6f9b', fillOpacity: .78
      }).bindPopup(`<div class="conference-popup"><strong>${location.city}</strong><p>${count} ${text.events}</p><ul>${items}</ul></div>`, { maxWidth: 340 });
      marker.addTo(markers);
    });
    if (summary) summary.textContent = `${selected.length} ${text.events} · ${grouped.size} ${text.cities}`;
  }

  document.querySelectorAll('.map-filter').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.map-filter').forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      render(button.dataset.period);
    });
  });

  const observer = new MutationObserver(() => {
    const active = document.querySelector('.map-filter.active');
    render(active?.dataset.period || 'all');
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  render();
})();
