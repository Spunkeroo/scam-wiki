const Votes = {
  getKey(type, id) {
    return `scamwiki_vote_${type}_${id}`;
  },

  getCountKey(type, id) {
    return `scamwiki_votes_${type}_${id}`;
  },

  getUserVote(type, id) {
    return localStorage.getItem(this.getKey(type, id));
  },

  getCounts(type, id) {
    const stored = localStorage.getItem(this.getCountKey(type, id));
    if (stored) return JSON.parse(stored);
    return { up: Math.floor(Math.random() * 50) + 10, down: Math.floor(Math.random() * 10) };
  },

  vote(type, id, direction) {
    const key = this.getKey(type, id);
    const countKey = this.getCountKey(type, id);
    const current = this.getUserVote(type, id);
    const counts = this.getCounts(type, id);

    if (current === direction) {
      localStorage.removeItem(key);
      counts[direction]--;
    } else {
      if (current) counts[current]--;
      counts[direction]++;
      localStorage.setItem(key, direction);
    }

    localStorage.setItem(countKey, JSON.stringify(counts));
    return { userVote: this.getUserVote(type, id), counts };
  },

  render(type, id) {
    const userVote = this.getUserVote(type, id);
    const counts = this.getCounts(type, id);
    const score = counts.up - counts.down;

    return `
      <div class="vote-box" data-vote-type="${type}" data-vote-id="${id}">
        <span class="vote-label">Was this helpful?</span>
        <button class="vote-btn ${userVote === 'up' ? 'active-up' : ''}" onclick="Votes.handleVote('${type}', '${id}', 'up')">
          ▲ ${counts.up}
        </button>
        <span class="vote-count">${score}</span>
        <button class="vote-btn ${userVote === 'down' ? 'active-down' : ''}" onclick="Votes.handleVote('${type}', '${id}', 'down')">
          ▼ ${counts.down}
        </button>
      </div>
    `;
  },

  handleVote(type, id, direction) {
    this.vote(type, id, direction);
    const container = document.querySelector(`[data-vote-type="${type}"][data-vote-id="${id}"]`);
    if (container) {
      container.outerHTML = this.render(type, id);
    }
  }
};