// src/routes/saved/index.tsx
import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { NewsCard, type Article } from '~/components/news/NewsCard';

// This loader runs on the server before the page renders
export const useSavedArticles = routeLoader$(async ({ cookie, redirect }) => {
  const token = cookie.get('auth_token')?.value;

  // If no token, redirect to login page
  if (!token) {
    throw redirect(302, '/login');
  }

  const apiUrl = import.meta.env.PUBLIC_BACKEND_API_URL;
  const response = await fetch(`${apiUrl}/api/user/saved`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    // If token is invalid, also redirect
    throw redirect(302, '/login');
  }
  
  const data = await response.json();
  // Map Supabase columns to our Article interface
  return data.map((a: any) => ({
    title: a.title,
    description: a.description,
    content: a.content,
    url: a.url,
    image: a.image,
    publishedAt: a.publishedAt
  })) as Article[];
});

export default component$(() => {
  const savedArticles = useSavedArticles();

  return (
    <div>
      <h1 class="text-3xl font-bold mb-6">Your Saved Articles</h1>
      {savedArticles.value.length > 0 ? (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedArticles.value.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      ) : (
        <p class="text-center text-gray-400 mt-10">You haven't saved any articles yet.</p>
      )}
    </div>
  );
});