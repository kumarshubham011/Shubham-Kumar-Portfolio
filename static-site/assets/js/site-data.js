(function() {
  'use strict';

  const byId = (id) => document.getElementById(id);
  const wordsToRead = (text) => Math.max(1, Math.ceil((text || '').trim().split(/\s+/).filter(Boolean).length / 200));

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async function getJson(path) {
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${path}`);
    }
    return res.json();
  }

  function projectCard(project) {
    const tech = (project.tech || []).map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');
    const links = [
      project.url ? `<a href="${escapeHtml(project.url)}" target="_blank" rel="noopener">View Live →</a>` : '',
      project.github_url ? `<a href="${escapeHtml(project.github_url)}" target="_blank" rel="noopener">GitHub</a>` : ''
    ].join('');

    return `
      <article class="project-card">
        <h3>
          ${escapeHtml(project.title)}
          ${project.featured ? '<span class="post-status post-status--published">Featured</span>' : ''}
        </h3>
        <p>${escapeHtml(project.description)}</p>
        <div class="tech-stack">${tech}</div>
        <div class="project-links">${links}</div>
      </article>
    `;
  }

  function postCard(post) {
    return `
      <article class="post-card">
        <h3><a href="post.html?slug=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h3>
        <p class="post-meta">${escapeHtml(post.date)} · ${wordsToRead(post.content)} min read</p>
        <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
      </article>
    `;
  }

  function markdownToHtml(md) {
    const lines = String(md || '').split('\n');
    let inList = false;
    const out = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        if (inList) {
          out.push('</ul>');
          inList = false;
        }
        continue;
      }

      if (line.startsWith('### ')) {
        if (inList) { out.push('</ul>'); inList = false; }
        out.push(`<h3>${escapeHtml(line.slice(4))}</h3>`);
      } else if (line.startsWith('## ')) {
        if (inList) { out.push('</ul>'); inList = false; }
        out.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
      } else if (line.startsWith('# ')) {
        if (inList) { out.push('</ul>'); inList = false; }
        out.push(`<h1>${escapeHtml(line.slice(2))}</h1>`);
      } else if (line.startsWith('- ')) {
        if (!inList) {
          out.push('<ul>');
          inList = true;
        }
        out.push(`<li>${escapeHtml(line.slice(2))}</li>`);
      } else {
        if (inList) { out.push('</ul>'); inList = false; }
        out.push(`<p>${escapeHtml(line)}</p>`);
      }
    }

    if (inList) out.push('</ul>');
    return out.join('');
  }

  async function initHome() {
    const [projects, posts] = await Promise.all([
      getJson('data/projects.json'),
      getJson('data/posts.json')
    ]);

    const sortedPosts = posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

    byId('featured-projects').innerHTML =
      projects.filter((p) => p.featured).slice(0, 3).map(projectCard).join('') ||
      '<p class="text-muted">No featured projects yet.</p>';

    byId('recent-posts').innerHTML =
      sortedPosts.slice(0, 3).map(postCard).join('') ||
      '<p class="text-muted">No posts yet.</p>';
  }

  async function initProjects() {
    const projects = await getJson('data/projects.json');
    const list = byId('projects-list');
    const input = byId('project-filter');

    if (!list || !input) return;

    const render = () => {
      const term = input.value.toLowerCase().trim();
      const filtered = projects.filter((p) =>
        !term ||
        (p.tech || []).join(' ').toLowerCase().includes(term) ||
        String(p.title || '').toLowerCase().includes(term) ||
        String(p.description || '').toLowerCase().includes(term)
      );

      list.innerHTML = filtered.map(projectCard).join('') || '<p class="text-muted">No matching projects.</p>';
    };

    input.addEventListener('input', render);
    render();
  }

  async function initBlog() {
    const posts = await getJson('data/posts.json');
    const sortedPosts = posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    const list = byId('blog-list');
    const input = byId('post-search');

    if (!list || !input) return;

    const render = () => {
      const term = input.value.toLowerCase().trim();
      const filtered = sortedPosts.filter((p) =>
        !term ||
        String(p.title || '').toLowerCase().includes(term) ||
        String(p.excerpt || '').toLowerCase().includes(term) ||
        String(p.content || '').toLowerCase().includes(term)
      );

      list.innerHTML = filtered.map(postCard).join('') || '<p class="text-muted">No matching posts.</p>';
    };

    input.addEventListener('input', render);
    render();
  }

  async function initPost() {
    const posts = await getJson('data/posts.json');
    const params = new URLSearchParams(window.location.search);
    const slug = decodeURIComponent(params.get('slug') || '');
    const post = posts.find((p) => p.slug === slug) || posts[0];

    const container = byId('post-content');
    if (!container || !post) {
      if (container) container.innerHTML = '<p class="text-muted">Post not found.</p>';
      return;
    }

    container.innerHTML = `
      <header class="post-header">
        <h1>${escapeHtml(post.title)}</h1>
        <p class="post-meta">${escapeHtml(post.date)} · ${wordsToRead(post.content)} min read</p>
      </header>
      <div class="post-content">${markdownToHtml(post.content)}</div>
      <footer class="mt-8 text-center">
        <p><a href="blog.html">← Back to all posts</a></p>
      </footer>
    `;

    document.title = `${post.title} — Shubham Kumar`;
  }

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const page = document.body.dataset.page;
      if (page === 'home') await initHome();
      if (page === 'projects') await initProjects();
      if (page === 'blog') await initBlog();
      if (page === 'post') await initPost();
    } catch (error) {
      console.error(error);
    }
  });
})();
