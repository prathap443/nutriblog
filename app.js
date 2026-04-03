const state = { posts: [], filtered: [] };

function escapeHtml(str = "") {
  return str.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}
function formatDate(dateString) {
  try { return new Date(dateString).toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"}); }
  catch { return dateString || ""; }
}
function buildSupabaseUrl() {
  return `${SUPABASE_URL}/rest/v1/blog_posts?select=*&published=eq.true&order=created_at.desc`;
}
async function fetchPosts() {
  const postsGrid = document.getElementById("postsGrid");
  const featured = document.getElementById("featuredPost");
  const resultCount = document.getElementById("resultCount");
  if (!SUPABASE_URL.includes("http") || SUPABASE_ANON_KEY.includes("PASTE_")) {
    postsGrid.innerHTML = `<div class="post-card"><div class="post-content"><h3>Setup needed</h3><p class="excerpt">Open <strong>config.js</strong> and paste your Supabase URL and anon key.</p></div></div>`;
    featured.innerHTML = `Open <strong>config.js</strong> and add your Supabase credentials.`;
    resultCount.textContent = "Waiting for configuration";
    return;
  }
  try {
    const res = await fetch(buildSupabaseUrl(), { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
    if (!res.ok) throw new Error(await res.text() || "Failed to fetch posts");
    state.posts = await res.json();
    state.filtered = [...state.posts];
    populateCategories(state.posts);
    renderFeatured(state.posts[0]);
    renderPosts(state.filtered);
  } catch (error) {
    console.error(error);
    postsGrid.innerHTML = `<div class="post-card"><div class="post-content"><h3>Could not load posts</h3><p class="excerpt">${escapeHtml(error.message || "Unknown error")}</p></div></div>`;
    featured.innerHTML = `Could not load featured post.`;
    resultCount.textContent = "0 articles";
  }
}
function populateCategories(posts) {
  const select = document.getElementById("categoryFilter");
  const categories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));
  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  }
}
function renderFeatured(post) {
  const featured = document.getElementById("featuredPost");
  if (!post) { featured.innerHTML = "No featured post available."; return; }
  const image = post.image_url || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80";
  featured.innerHTML = `
    <img class="featured-image" src="${escapeHtml(image)}" alt="${escapeHtml(post.title)}">
    <div class="featured-content">
      <span class="category-tag">${escapeHtml(post.category || "General")}</span>
      <h3>${escapeHtml(post.title)}</h3>
      <div class="meta">${formatDate(post.created_at)} • ${escapeHtml(post.author || "NutriEat Team")}</div>
      <p class="excerpt">${escapeHtml(post.excerpt || "")}</p>
      <a class="read-more" href="post.html?slug=${encodeURIComponent(post.slug)}">Read article →</a>
    </div>`;
}
function renderPosts(posts) {
  const postsGrid = document.getElementById("postsGrid");
  const emptyState = document.getElementById("emptyState");
  const resultCount = document.getElementById("resultCount");
  resultCount.textContent = `${posts.length} article${posts.length === 1 ? "" : "s"}`;
  if (!posts.length) { postsGrid.innerHTML = ""; emptyState.classList.remove("hidden"); return; }
  emptyState.classList.add("hidden");
  postsGrid.innerHTML = posts.map(post => {
    const image = post.image_url || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80";
    return `<article class="post-card">
      <div class="post-image-wrap"><img class="post-image" src="${escapeHtml(image)}" alt="${escapeHtml(post.title)}"></div>
      <div class="post-content">
        <span class="category-tag">${escapeHtml(post.category || "General")}</span>
        <h3>${escapeHtml(post.title)}</h3>
        <div class="meta">${formatDate(post.created_at)} • ${escapeHtml(post.author || "NutriEat Team")}</div>
        <p class="excerpt">${escapeHtml(post.excerpt || "")}</p>
        <a class="read-more" href="post.html?slug=${encodeURIComponent(post.slug)}">Read article →</a>
      </div></article>`;
  }).join("");
}
function applyFilters() {
  const search = document.getElementById("searchInput").value.trim().toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  state.filtered = state.posts.filter(post => {
    const matchesSearch = !search || (post.title || "").toLowerCase().includes(search) || (post.excerpt || "").toLowerCase().includes(search) || (post.content || "").toLowerCase().includes(search);
    const matchesCategory = category === "All" || (post.category || "") === category;
    return matchesSearch && matchesCategory;
  });
  renderPosts(state.filtered);
}
document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("categoryFilter").addEventListener("change", applyFilters);
fetchPosts();
