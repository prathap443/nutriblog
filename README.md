# NutriEat Dynamic Blog

A simple blog website with:
- Better UI
- Dynamic blog posts from Supabase
- Easy integration link back to your app
- Static hosting on Vercel

## Files
- `index.html` → blog homepage
- `post.html` → single article page
- `style.css` → styling
- `app.js` → loads blog list from Supabase
- `post.js` → loads single article by slug
- `config.js` → paste your Supabase URL and anon key
- `supabase_blog_setup.sql` → create table and sample posts

## Setup

1. Run `supabase_blog_setup.sql` in Supabase SQL editor.
2. Open `config.js` and paste your Supabase URL and anon key.
3. Upload this folder to GitHub and import it into Vercel.

No build settings are required.

## Integration with your app
Add a button in your app that links to your deployed blog URL.

## Important
Use the public anon key only. Do not use the service role key.
