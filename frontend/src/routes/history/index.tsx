import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { Article } from '~/components/news/NewsCard';

export const useHistoryArticles = routeLoader$(async ({ cookie, redirect }) => {
  const token = cookie.get('auth_token')?.value;
  if (!token) throw redirect(302, '/login');
  
  const apiUrl = import.meta.env.PUBLIC_BACKEND_API_URL;
  const response = await fetch(`${apiUrl}/api/user/history`, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) return [];

  const data = await response.json();
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
  const articles = useHistoryArticles();
  return (
    <div>
      <h1 class="text-3xl font-bold mb-6">Your Viewing History</h1>
      {articles.value.length > 0 ? (
        <ul>{articles.value.map((a, index) => <li key={index} class="mb-2 p-2 bg-slate-800 rounded">{a.title}</li>)}</ul>
      ) : (
        <p class="text-center text-gray-400 mt-10">You have no viewing history.</p>
      )}
    </div>
  );
});