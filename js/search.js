const Search = {
  index: [],

  build(scams, scammers, techniques) {
    this.index = [];
    scams.forEach(s => {
      this.index.push({
        type: 'scam',
        id: s.slug,
        name: s.name,
        text: `${s.name} ${s.summary} ${s.tags.join(' ')} ${s.type} ${s.howItWorked || ''}`.toLowerCase(),
        meta: `${s.type} · ${s.losses} · ${s.status}`,
        route: `#/scam/${s.slug}`
      });
    });
    scammers.forEach(s => {
      this.index.push({
        type: 'scammer',
        id: s.id,
        name: s.name,
        text: `${s.name} ${s.aliases.join(' ')} ${s.description}`.toLowerCase(),
        meta: `Scammer · ${s.status}`,
        route: `#/profile/${s.id}`
      });
    });
    techniques.forEach(t => {
      this.index.push({
        type: 'technique',
        id: t.id,
        name: `${t.icon} ${t.name}`,
        text: `${t.name} ${t.summary} ${t.howItWorks}`.toLowerCase(),
        meta: `Technique`,
        route: `#/technique/${t.id}`
      });
    });
  },

  query(q) {
    if (!q || q.length < 2) return [];
    const terms = q.toLowerCase().split(/\s+/);
    return this.index
      .filter(item => terms.every(t => item.text.includes(t)))
      .slice(0, 10);
  },

  renderDropdown(results, container) {
    if (!results.length) {
      container.classList.remove('active');
      return;
    }
    container.innerHTML = results.map(r => `
      <div class="search-result-item" onclick="location.hash='${r.route.slice(1)}'; document.querySelectorAll('.search-results').forEach(el=>el.classList.remove('active'));">
        <div class="search-result-name">${r.name}</div>
        <div class="search-result-meta">${r.meta}</div>
      </div>
    `).join('');
    container.classList.add('active');
  },

  bindInput(input, dropdown) {
    input.addEventListener('input', () => {
      const results = this.query(input.value);
      this.renderDropdown(results, dropdown);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdown.classList.remove('active');
      }
      if (e.key === 'Enter' && input.value.length >= 2) {
        location.hash = `/browse?q=${encodeURIComponent(input.value)}`;
        dropdown.classList.remove('active');
      }
    });
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  }
};