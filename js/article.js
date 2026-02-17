const Article = {
  render(scam) {
    if (!scam) return '<div class="loading">Scam not found.</div>';

    const statusClass = scam.status === 'Dead' ? 'dead' : scam.status === 'Active' ? 'active' : 'investigation';
    const people = (scam.people || []).map(id => App.data.scammers.find(s => s.id === id)).filter(Boolean);
    const related = (scam.relatedScams || []).map(id => App.data.scams.find(s => s.id === id)).filter(Boolean);
    const videos = (scam.relatedVideos || []).map(id => App.data.videos.find(v => v.id === id)).filter(Boolean);

    const evidenceIcons = { court_doc: '⚖️', article: '📰', video: '🎥' };
    const sections = [];
    if (scam.howItWorked) sections.push({ id: 'how', title: 'How It Worked' });
    if (scam.timeline && scam.timeline.length) sections.push({ id: 'timeline', title: 'Timeline' });
    if (people.length) sections.push({ id: 'people', title: 'Key People' });
    if (scam.evidence && scam.evidence.length) sections.push({ id: 'evidence', title: 'Evidence' });
    if (videos.length) sections.push({ id: 'videos', title: 'Related Videos' });
    if (related.length) sections.push({ id: 'related', title: 'Related Scams' });

    const shareText = encodeURIComponent(`${scam.name} — ${scam.losses} lost. Read the full breakdown on scam.wiki`);
    const shareUrl = encodeURIComponent(`https://scam.wiki/#/scam/${scam.slug}`);

    return `
      <div class="article-layout">
        <div class="article-main">
          <div class="article-breadcrumb">
            <a href="#/">Home</a> / <a href="#/browse">Scams</a> / ${scam.name}
          </div>
          <div class="article-header">
            <h1 class="article-title">${scam.name}</h1>
            <div class="article-badges">
              <span class="badge badge-type">${scam.type}</span>
              <span class="badge badge-status-${statusClass}">${scam.status}</span>
              ${(scam.tags || []).map(t => `<span class="badge badge-type" style="opacity:0.6">${t}</span>`).join('')}
            </div>
            <p class="article-summary">${scam.summary}</p>
          </div>

          ${scam.howItWorked ? `
            <div class="article-section" id="how">
              <h2>How It Worked</h2>
              <p>${scam.howItWorked}</p>
            </div>
          ` : ''}

          <div class="ad-slot">Advertisement</div>

          ${scam.timeline && scam.timeline.length ? `
            <div class="article-section" id="timeline">
              <h2>Timeline</h2>
              <ul class="timeline">
                ${scam.timeline.map(t => `
                  <li class="timeline-item">
                    <div class="timeline-date">${t.date}</div>
                    <div class="timeline-event">${t.event}</div>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          ${people.length ? `
            <div class="article-section" id="people">
              <h2>Key People</h2>
              <div class="people-grid">
                ${people.map(p => `
                  <div class="person-card" onclick="location.hash='/profile/${p.id}'">
                    <div class="person-name">${p.name}</div>
                    <div class="person-role">${p.aliases.length ? 'aka ' + p.aliases.join(', ') : ''}</div>
                    <div class="person-status" style="color: ${p.status.includes('Fugitive') ? '#ff4444' : p.status.includes('Convicted') ? 'var(--text-dim)' : 'var(--yellow)'}">${p.status}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${scam.evidence && scam.evidence.length ? `
            <div class="article-section" id="evidence">
              <h2>Evidence & Sources</h2>
              <ul class="evidence-list">
                ${scam.evidence.map(e => `
                  <li class="evidence-item" onclick="window.open('${e.url}', '_blank')">
                    <span class="evidence-icon">${evidenceIcons[e.type] || '📄'}</span>
                    <div>
                      <div class="evidence-title">${e.title}</div>
                      <div class="evidence-type">${e.type.replace('_', ' ')}</div>
                    </div>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          ${videos.length ? `
            <div class="article-section" id="videos">
              <h2>Related Videos</h2>
              <div class="video-grid">
                ${videos.map(v => `
                  <div class="video-card" onclick="window.open('https://www.youtube.com/watch?v=${v.videoId}', '_blank')" style="cursor:pointer">
                    <div class="video-thumb">
                      <img src="https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg" alt="${v.title}" loading="lazy">
                      <span class="play-btn">▶</span>
                    </div>
                    <div class="video-info">
                      <div class="video-title">${v.title}</div>
                      <div class="video-creator">${v.creator}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${related.length ? `
            <div class="article-section" id="related">
              <h2>Related Scams</h2>
              <div class="related-grid">
                ${related.map(r => `
                  <div class="related-card" onclick="location.hash='/scam/${r.slug}'">
                    <div class="related-card-name">${r.name}</div>
                    <div class="related-card-meta">${r.type} · ${r.losses}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${Votes.render('scam', scam.slug)}

          <div class="share-section">
            <a class="share-btn" href="https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}" target="_blank" rel="noopener">
              𝕏 Share on X
            </a>
            <button class="share-btn" onclick="navigator.clipboard.writeText('https://scam.wiki/#/scam/${scam.slug}');this.textContent='✓ Copied!'">
              📋 Copy Link
            </button>
          </div>
        </div>

        <div class="article-sidebar">
          <div class="toc">
            <h3>Contents</h3>
            <ul class="toc-list">
              ${sections.map(s => `<li><a href="#${s.id}">${s.title}</a></li>`).join('')}
            </ul>
          </div>

          <div class="quick-facts">
            <h3>Quick Facts</h3>
            <div class="fact-row"><span class="fact-label">Type</span><span class="fact-value">${scam.type}</span></div>
            <div class="fact-row"><span class="fact-label">Status</span><span class="fact-value">${scam.status}</span></div>
            <div class="fact-row"><span class="fact-label">Losses</span><span class="fact-value" style="color:var(--red)">${scam.losses}</span></div>
            <div class="fact-row"><span class="fact-label">Collapsed</span><span class="fact-value">${scam.date}</span></div>
            ${scam.dateStarted ? `<div class="fact-row"><span class="fact-label">Started</span><span class="fact-value">${scam.dateStarted}</span></div>` : ''}
            ${people.length ? `<div class="fact-row"><span class="fact-label">People</span><span class="fact-value">${people.length}</span></div>` : ''}
          </div>

          ${this.renderAffiliateBox(scam)}

          <div class="quick-facts" style="text-align:center; padding: 16px;">
            <a href="${scam.source}" target="_blank" rel="noopener" style="font-size:13px;color:var(--text-dim)">📄 View Source</a>
          </div>
        </div>
      </div>
    `;
  },

  renderAffiliateBox(scam) {
    const isCrypto = ['crypto', 'nft', 'ponzi'].some(t => scam.type === t || (scam.tags || []).includes(t));
    const isPhishing = scam.type === 'phishing' || (scam.tags || []).includes('phishing');

    let links = '';
    if (isCrypto) {
      links = `
        <a class="affiliate-link" href="https://www.ledger.com" target="_blank" rel="noopener">
          <span class="aff-icon">🔐</span>
          <div>Ledger Hardware Wallet<br><span class="aff-desc">Secure your crypto offline</span></div>
        </a>
        <a class="affiliate-link" href="https://www.trezor.io" target="_blank" rel="noopener">
          <span class="aff-icon">🛡️</span>
          <div>Trezor Hardware Wallet<br><span class="aff-desc">Open-source crypto security</span></div>
        </a>
      `;
    }
    if (isPhishing) {
      links += `
        <a class="affiliate-link" href="https://www.aura.com" target="_blank" rel="noopener">
          <span class="aff-icon">🔒</span>
          <div>Aura Identity Protection<br><span class="aff-desc">Monitor your identity</span></div>
        </a>
      `;
    }
    links += `
      <a class="affiliate-link" href="https://nordvpn.com" target="_blank" rel="noopener">
        <span class="aff-icon">🌐</span>
        <div>NordVPN<br><span class="aff-desc">Protect your browsing</span></div>
      </a>
      <a class="affiliate-link" href="https://1password.com" target="_blank" rel="noopener">
        <span class="aff-icon">🔑</span>
        <div>1Password<br><span class="aff-desc">Never reuse passwords</span></div>
      </a>
    `;

    return `
      <div class="affiliate-box">
        <h3>🛡️ Protect Yourself</h3>
        <p>Don't become the next victim. Secure your accounts and assets.</p>
        ${links}
      </div>
    `;
  }
};