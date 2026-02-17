const Techniques = {
  renderList(techniques) {
    return `
      <div class="browse-header">
        <h1>Scam Techniques</h1>
        <p>Learn how common scams work and how to protect yourself</p>
      </div>
      <div class="technique-grid">
        ${techniques.map(t => `
          <div class="technique-card" onclick="location.hash='/technique/${t.id}'">
            <div class="technique-card-icon">${t.icon}</div>
            <div class="technique-card-name">${t.name}</div>
            <div class="technique-card-summary">${t.summary}</div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderTechnique(technique) {
    if (!technique) return '<div class="loading">Technique not found.</div>';

    const examples = (technique.exampleScams || []).map(id => App.data.scams.find(s => s.id === id)).filter(Boolean);

    return `
      <div class="article-breadcrumb" style="padding-top:32px">
        <a href="#/">Home</a> / <a href="#/techniques">Techniques</a> / ${technique.name}
      </div>
      <div class="technique-header">
        <div class="technique-icon">${technique.icon}</div>
        <h1 class="technique-name">${technique.name}</h1>
        <p class="technique-summary">${technique.summary}</p>
      </div>

      <div class="technique-content">
        <h2>How It Works</h2>
        ${technique.howItWorks.split('\n').map(line => {
          line = line.trim();
          if (!line) return '';
          return `<p>${line}</p>`;
        }).join('')}

        <h2>Red Flags</h2>
        <ul class="red-flag-list">
          ${technique.redFlags.map(f => `<li>🚩 ${f}</li>`).join('')}
        </ul>

        <h2>How to Protect Yourself</h2>
        <p>${technique.prevention}</p>
      </div>

      ${examples.length ? `
        <div class="section-header" style="margin-top:40px">
          <h2>Example Scams</h2>
        </div>
        <div class="scam-grid">
          ${examples.map(s => Home.renderCard(s)).join('')}
        </div>
      ` : ''}

      ${Votes.render('technique', technique.id)}
    `;
  }
};