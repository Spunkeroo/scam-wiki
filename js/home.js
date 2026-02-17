const Home = {
  render(scams) {
    const totalLosses = scams.reduce((sum, s) => sum + (s.lossesParsed || 0), 0);
    const active = scams.filter(s => s.status === 'Active').length;
    const sorted = [...scams].sort((a, b) => new Date(b.date) - new Date(a.date));
    const trending = sorted.slice(0, 6);
    const byLosses = [...scams].filter(s => s.lossesParsed > 0).sort((a, b) => b.lossesParsed - a.lossesParsed).slice(0, 6);

    return `
      <div class="home-hero">
        <h1>The <span>Encyclopedia</span> of Scams</h1>
        <p>Research every known scam. Exposed. Documented. Searchable.</p>
        <div class="home-search">
          <span class="search-icon">🔍</span>
          <input type="text" id="home-search-input" placeholder="Search scams, scammers, techniques..." autocomplete="off">
          <div class="search-results" id="home-search-results"></div>
        </div>
        <div class="home-stats">
          <div class="stat">
            <div class="stat-number">${scams.length}</div>
            <div class="stat-label">Scams Documented</div>
          </div>
          <div class="stat">
            <div class="stat-number">$${(totalLosses / 1e9).toFixed(1)}B+</div>
            <div class="stat-label">Total Losses</div>
          </div>
          <div class="stat">
            <div class="stat-number">${active}</div>
            <div class="stat-label">Active Threats</div>
          </div>
        </div>
      </div>

      <div class="section-header">
        <h2>Recently Added</h2>
        <a href="#/browse">View all →</a>
      </div>
      <div class="scam-grid">
        ${trending.map(s => this.renderCard(s)).join('')}
      </div>

      <div class="section-header">
        <h2>Biggest Losses</h2>
        <a href="#/browse?sort=losses">View all →</a>
      </div>
      <div class="scam-grid">
        ${byLosses.map(s => this.renderCard(s)).join('')}
      </div>

      <div class="section-header">
        <h2>Browse by Category</h2>
      </div>
      <div class="category-pills" style="margin-bottom: 40px;">
        <a class="category-pill" href="#/browse?type=crypto">Crypto</a>
        <a class="category-pill" href="#/browse?type=nft">NFT</a>
        <a class="category-pill" href="#/browse?type=ponzi">Ponzi</a>
        <a class="category-pill" href="#/browse?type=phishing">Phishing</a>
      </div>

      <div class="section-header">
        <h2>Scam Techniques</h2>
        <a href="#/techniques">Learn more →</a>
      </div>
      <div class="technique-grid">
        ${App.data.techniques.slice(0, 4).map(t => `
          <div class="technique-card" onclick="location.hash='/technique/${t.id}'">
            <div class="technique-card-icon">${t.icon}</div>
            <div class="technique-card-name">${t.name}</div>
            <div class="technique-card-summary">${t.summary}</div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderCard(s) {
    const statusClass = s.status === 'Dead' ? 'dead' : s.status === 'Active' ? 'active' : 'investigation';
    return `
      <div class="scam-card" onclick="location.hash='/scam/${s.slug}'">
        <div class="scam-card-header">
          <div class="scam-card-name">${s.name}</div>
          <div class="scam-card-badges">
            <span class="badge badge-type">${s.type}</span>
            <span class="badge badge-status-${statusClass}">${s.status}</span>
          </div>
        </div>
        <div class="scam-card-summary">${s.summary}</div>
        <div class="scam-card-meta">
          <span class="scam-card-losses">${s.losses}</span>
          <span>${s.date}</span>
        </div>
      </div>
    `;
  },

  afterRender() {
    const input = document.getElementById('home-search-input');
    const dropdown = document.getElementById('home-search-results');
    if (input && dropdown) {
      Search.bindInput(input, dropdown);
    }
  }
};