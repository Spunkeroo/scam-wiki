const Browse = {
  render(scams, params) {
    const type = params.get('type') || '';
    const status = params.get('status') || '';
    const sort = params.get('sort') || 'date';
    const q = params.get('q') || '';

    let filtered = [...scams];

    if (q) {
      const terms = q.toLowerCase().split(/\s+/);
      filtered = filtered.filter(s =>
        terms.every(t =>
          s.name.toLowerCase().includes(t) ||
          s.summary.toLowerCase().includes(t) ||
          s.type.toLowerCase().includes(t) ||
          (s.tags || []).some(tag => tag.includes(t))
        )
      );
    }

    if (type) filtered = filtered.filter(s => s.type === type || (s.tags || []).includes(type));
    if (status) filtered = filtered.filter(s => s.status === status);

    if (sort === 'losses') {
      filtered.sort((a, b) => (b.lossesParsed || 0) - (a.lossesParsed || 0));
    } else if (sort === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    const types = [...new Set(scams.map(s => s.type))];
    const statuses = ['Active', 'Dead', 'Under Investigation'];

    return `
      <div class="browse-header">
        <h1>${q ? `Search: "${q}"` : 'Browse Scams'}</h1>
        <p>${filtered.length} scam${filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      <div class="filter-bar">
        <select id="filter-type" onchange="Browse.applyFilters()">
          <option value="">All Types</option>
          ${types.map(t => `<option value="${t}" ${type === t ? 'selected' : ''}>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join('')}
        </select>
        <select id="filter-status" onchange="Browse.applyFilters()">
          <option value="">All Statuses</option>
          ${statuses.map(s => `<option value="${s}" ${status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
        <select id="filter-sort" onchange="Browse.applyFilters()">
          <option value="date" ${sort === 'date' ? 'selected' : ''}>Newest First</option>
          <option value="losses" ${sort === 'losses' ? 'selected' : ''}>Biggest Losses</option>
          <option value="name" ${sort === 'name' ? 'selected' : ''}>A-Z</option>
        </select>
        <span class="results-count">${filtered.length} results</span>
      </div>

      <div class="scam-grid">
        ${filtered.map(s => Home.renderCard(s)).join('')}
      </div>

      ${filtered.length === 0 ? '<div class="loading">No scams match your filters.</div>' : ''}
    `;
  },

  applyFilters() {
    const type = document.getElementById('filter-type').value;
    const status = document.getElementById('filter-status').value;
    const sort = document.getElementById('filter-sort').value;
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (status) params.set('status', status);
    if (sort && sort !== 'date') params.set('sort', sort);
    location.hash = `/browse${params.toString() ? '?' + params.toString() : ''}`;
  }
};