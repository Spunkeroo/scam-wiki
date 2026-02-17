const Profiles = {
  renderList(scammers) {
    return `
      <div class="browse-header">
        <h1>Scammer Profiles</h1>
        <p>${scammers.length} known scammers documented</p>
      </div>
      <div class="profile-grid">
        ${scammers.map(s => this.renderCard(s)).join('')}
      </div>
    `;
  },

  renderCard(s) {
    const statusColor = s.status.includes('Fugitive') ? '#ff4444' :
                        s.status.includes('Convicted') ? 'var(--text-dim)' :
                        s.status.includes('Arrested') ? 'var(--yellow)' : 'var(--orange)';
    return `
      <div class="profile-card" onclick="location.hash='/profile/${s.id}'">
        <div class="profile-card-name">${s.name}</div>
        <div class="profile-card-status" style="color:${statusColor}">${s.status}</div>
        <div class="profile-card-desc">${s.description}</div>
      </div>
    `;
  },

  renderProfile(scammer) {
    if (!scammer) return '<div class="loading">Profile not found.</div>';

    const scams = (scammer.scams || []).map(id => App.data.scams.find(s => s.id === id)).filter(Boolean);
    const statusClass = scammer.status.includes('Fugitive') ? 'fugitive' :
                        scammer.status.includes('Convicted') ? 'convicted' :
                        scammer.status.includes('Arrested') ? 'arrested' : 'scrutiny';

    return `
      <div class="article-breadcrumb" style="padding-top:32px">
        <a href="#/">Home</a> / <a href="#/profiles">Scammers</a> / ${scammer.name}
      </div>
      <div class="profile-header">
        <h1 class="profile-name">${scammer.name}</h1>
        ${scammer.aliases.length ? `<div class="profile-aliases">Also known as: ${scammer.aliases.join(', ')}</div>` : ''}
        <div class="profile-status ${statusClass}">${scammer.status}</div>
        <p class="profile-description">${scammer.description}</p>
      </div>

      ${scams.length ? `
        <div class="section-header">
          <h2>Associated Scams</h2>
        </div>
        <div class="scam-grid">
          ${scams.map(s => Home.renderCard(s)).join('')}
        </div>
      ` : ''}

      ${scammer.sources && scammer.sources.length ? `
        <div class="article-section" style="margin-top:32px">
          <h2>Sources</h2>
          <ul class="evidence-list">
            ${scammer.sources.map(url => `
              <li class="evidence-item" onclick="window.open('${url}', '_blank')">
                <span class="evidence-icon">📄</span>
                <div>
                  <div class="evidence-title">${url.replace(/https?:\/\/(www\.)?/, '').split('/')[0]}</div>
                  <div class="evidence-type">source</div>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      ${Votes.render('scammer', scammer.id)}
    `;
  }
};