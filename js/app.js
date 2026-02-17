const App = {
  data: { scams: [], scammers: [], techniques: [], videos: [] },

  async init() {
    const [scams, scammers, techniques, videos] = await Promise.all([
      fetch('data/scams.json').then(r => r.json()),
      fetch('data/scammers.json').then(r => r.json()),
      fetch('data/techniques.json').then(r => r.json()),
      fetch('data/videos.json').then(r => r.json())
    ]);

    this.data = { scams, scammers, techniques, videos };
    Search.build(scams, scammers, techniques);

    this.bindHeaderSearch();
    window.addEventListener('hashchange', () => this.route());
    this.route();
  },

  bindHeaderSearch() {
    const input = document.getElementById('header-search-input');
    const dropdown = document.getElementById('header-search-results');
    if (input && dropdown) {
      Search.bindInput(input, dropdown);
    }
  },

  route() {
    const hash = location.hash.slice(1) || '/';
    const content = document.getElementById('app');
    const [path, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString || '');
    const parts = path.split('/').filter(Boolean);

    let html = '';

    if (parts[0] === 'scam' && parts[1]) {
      const scam = this.data.scams.find(s => s.slug === parts[1]);
      html = Article.render(scam);
      document.title = scam ? `${scam.name} — scam.wiki` : 'Not Found — scam.wiki';
    } else if (parts[0] === 'browse') {
      html = Browse.render(this.data.scams, params);
      document.title = 'Browse Scams — scam.wiki';
    } else if (parts[0] === 'profiles') {
      html = Profiles.renderList(this.data.scammers);
      document.title = 'Scammer Profiles — scam.wiki';
    } else if (parts[0] === 'profile' && parts[1]) {
      const scammer = this.data.scammers.find(s => s.id === parts[1]);
      html = Profiles.renderProfile(scammer);
      document.title = scammer ? `${scammer.name} — scam.wiki` : 'Not Found — scam.wiki';
    } else if (parts[0] === 'techniques') {
      html = Techniques.renderList(this.data.techniques);
      document.title = 'Scam Techniques — scam.wiki';
    } else if (parts[0] === 'technique' && parts[1]) {
      const technique = this.data.techniques.find(t => t.id === parts[1]);
      html = Techniques.renderTechnique(technique);
      document.title = technique ? `${technique.name} — scam.wiki` : 'Not Found — scam.wiki';
    } else {
      html = Home.render(this.data.scams);
      document.title = 'scam.wiki — The Encyclopedia of Scams';
    }

    content.innerHTML = `<div class="main-content">${html}</div>`;
    window.scrollTo(0, 0);

    if (!parts.length || hash === '/') {
      Home.afterRender();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());