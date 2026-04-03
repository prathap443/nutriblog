function escapeHtml(str = "") {
  return str.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}
function formatDate(dateString) {
  try { return new Date(dateString).toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"}); }
  catch { return dateString || ""; }
}
function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}
async function fetchArticle() {
  const articleCard = document.getElementById("articleCard");
  const slug = getSlug();
  if (!slug) { articleCard.innerHTML = "<div class='article-inner'><h1 class='article-title'>Article not found</h1><p class='article-body'>No slug provided.</p></div>"; return; }
  if (!SUPABASE_URL.includes("http") || SUPABASE_ANON_KEY.includes("PASTE_")) {
    articleCard.innerHTML = "<div class='article-inner'><h1 class='article-title'>Setup needed</h1><p class='article-body'>Open config.js and add your Supabase URL and anon key.</p></div>"; return;
  }
  try {
    const url = `${SUPABASE_URL}/rest/v1/blog_posts?select=*&slug=eq.${encodeURIComponent(slug)}&published=eq.true&limit=1`;
    const res = await fetch(url, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
    if (!res.ok) throw new Error(await res.text() || "Failed to fetch article");
    const rows = await res.json();
    const post = rows[0];
    if (!post) { articleCard.innerHTML = "<div class='article-inner'><h1 class='article-title'>Article not found</h1><p class='article-body'>This post does not exist or is unpublished.</p></div>"; return; }
    const image = post.image_url || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80";
    document.title = `${post.title} | NutriEat Blog`;
    articleCard.innerHTML = `
      <img class="article-image" src="${escapeHtml(image)}" alt="${escapeHtml(post.title)}">
      <div class="article-inner">
        <span class="category-tag">${escapeHtml(post.category || "General")}</span>
        <h1 class="article-title">${escapeHtml(post.title)}</h1>
        <div class="meta">${formatDate(post.created_at)} • ${escapeHtml(post.author || "NutriEat Team")}</div>
        <p class="article-body">${escapeHtml(post.content || "")}</p>
      </div>`;
  } catch (error) {
    console.error(error);
    articleCard.innerHTML = `<div class='article-inner'><h1 class='article-title'>Could not load article</h1><p class='article-body'>${escapeHtml(error.message || "Unknown error")}</p></div>`;
  }
}
fetchArticle();
