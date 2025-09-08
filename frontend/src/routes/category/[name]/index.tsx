// src/routes/category/[name]/index.tsx
import { component$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { globalAction$, zod$, z, useLocation } from '@builder.io/qwik-city';
import { NewsCard, type Article } from '~/components/news/NewsCard';
import { AuthContext } from '~/routes/layout';

export const useSaveArticle = globalAction$(async (article, { cookie, fail }) => {
  const token = cookie.get('auth_token')?.value;
  if (!token) {
    return fail(401, { message: 'You must be logged in to save articles.' });
  }

  const apiUrl = import.meta.env.PUBLIC_BACKEND_API_URL;
  console.log('Saving article from category:', article);
  console.log('Using token:', token);
  const response = await fetch(`${apiUrl}/api/user/saved`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(article),
  });

  console.log('Save response status:', response.status);
  const responseText = await response.text();
  console.log('Save response:', responseText);

  if (response.status === 409) {
    // Handle the specific case where the article is already saved
    return { success: false, message: 'Article is already saved.' };
  }

  if (!response.ok) {
    return fail(500, { message: 'An error occurred while saving the article.' });
  }

  return { success: true, message: 'Article saved successfully!' };
}, zod$({
  title: z.string(),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  url: z.string().url(),
  image: z.string().url().optional().nullable(),
  publishedAt: z.string().optional().nullable(),
}));

export const useHistoryArticle = globalAction$(async (article, { cookie }) => {
  const token = cookie.get('auth_token')?.value;
  if (!token) {
    return;
  }

  const apiUrl = import.meta.env.PUBLIC_BACKEND_API_URL;
  try {
    const response = await fetch(`${apiUrl}/api/user/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) {
      console.error('Failed to add to history:', response.status);
    }
  } catch (error) {
    console.error('Error adding to history:', error);
  }
}, zod$({
  title: z.string(),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  url: z.string().url(),
  image: z.string().url().optional().nullable(),
  publishedAt: z.string().optional().nullable(),
}));

export default component$(() => {
  const page = useSignal(1);
  const articles = useSignal<Article[]>([]);
  const loading = useSignal(false);
  const hasMore = useSignal(true);
  const saveAction = useSaveArticle();
  const historyAction = useHistoryArticle();
  const userSession = useContext(AuthContext);
  const location = useLocation();

  // Fetch articles when page or category changes
  useVisibleTask$(({ track }) => {
    track(() => page.value);
    track(() => location.params.name);
    const fetchArticles = async () => {
      loading.value = true;
      try {
        const category = location.params.name;
        const apiUrl = import.meta.env.PUBLIC_BACKEND_API_URL;
        const response = await fetch(`${apiUrl}/api/news/category/${category}?page=${page.value}`);

        if (!response.ok) {
          console.error("API request failed:", response.status, response.statusText);
          articles.value = [];
          hasMore.value = false;
        } else {
          const data = await response.json();
          const fetchedArticles = Array.isArray(data.articles) ? (data.articles as Article[]) : [];
          articles.value = fetchedArticles;
          hasMore.value = fetchedArticles.length === 9; // max per page
        }
      } catch (error) {
        console.error("Error fetching category news:", error);
        articles.value = [];
        hasMore.value = false;
      } finally {
        loading.value = false;
      }
    };
    fetchArticles();
  });

  return (
    <div>
      <h1 class="text-3xl font-bold mb-6 capitalize">{location.params.name} News</h1>

      {saveAction.value && (
        <div
          class={`text-center p-3 mb-4 rounded-md ${
            saveAction.value.success
              ? 'bg-green-500/20 text-green-300'
              : 'bg-yellow-500/20 text-yellow-300'
          }`}
        >
          {saveAction.value.message}
        </div>
      )}

      {loading.value ? (
        <div class="text-center py-8">Loading...</div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.value.map((article, index) => (
            <NewsCard
              key={index}
              article={article}
              isLoggedIn={userSession.value.isLoggedIn}
              saveAction={saveAction}
              historyAction={historyAction}
            />
          ))}
        </div>
      )}

      {/* Pagination Buttons */}
      <div class="flex justify-center mt-8 space-x-4">
        <button
          onClick$={() => {
            if (page.value > 1) {
              page.value--;
            }
          }}
          disabled={page.value === 1 || loading.value}
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span class="px-4 py-2 text-indigo-300">Page {page.value}</span>
        <button
          onClick$={() => page.value++}
          disabled={loading.value}
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
});
