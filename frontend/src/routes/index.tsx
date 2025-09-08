import { component$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { routeAction$, zod$, z } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import { NewsCard, type Article } from '~/components/news/NewsCard';
import { AuthContext } from '~/routes/layout';

// ✅ IMPROVED ACTION WITH VALIDATION
// This is now a `routeAction$` with Zod validation for security and data integrity.
export const useSaveArticleAction = routeAction$(
  async (articleData, { cookie, fail }) => {
    const token = cookie.get('auth_token')?.value;
    if (!token) {
      return fail(401, { message: 'You must be logged in to save articles.' });
    }

    const apiUrl = import.meta.env.PUBLIC_BACKEND_API_URL;
    console.log('Saving article:', articleData);
    console.log('Using token:', token);
    const response = await fetch(`${apiUrl}/api/user/saved`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(articleData),
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
  },
  // Zod schema for validating the form data
  zod$({
    title: z.string(),
    description: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    url: z.string().url(),
    image: z.string().url().optional().nullable(),
    publishedAt: z.string().optional().nullable(),
  })
);

// ✅ HISTORY ACTION
// Adds article to user's history when clicked
export const useHistoryAction = routeAction$(
  async (articleData, { cookie }) => {
    const token = cookie.get('auth_token')?.value;
    if (!token) {
      // Silently fail if not logged in, don't add to history
      return;
    }

    const apiUrl = import.meta.env.PUBLIC_BACKEND_API_URL;
    console.log('Adding to history:', articleData);
    try {
      const response = await fetch(`${apiUrl}/api/user/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        console.log('Article added to history');
      } else {
        console.error('Failed to add to history:', response.status);
      }
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  },
  // Zod schema for validating the form data
  zod$({
    title: z.string(),
    description: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    url: z.string().url(),
    image: z.string().url().optional().nullable(),
    publishedAt: z.string().optional().nullable(),
  })
);

export default component$(() => {
  const page = useSignal(1);
  const articles = useSignal<Article[]>([]);
  const loading = useSignal(false);
  const hasMore = useSignal(true);
  const saveAction = useSaveArticleAction();
  const historyAction = useHistoryAction();
  const userSession = useContext(AuthContext);

  // Fetch articles when page changes
  useVisibleTask$(({ track }) => {
    track(() => page.value);
    const fetchArticles = async () => {
      loading.value = true;
      try {
        const apiUrl = import.meta.env.PUBLIC_BACKEND_API_URL;
        const response = await fetch(`${apiUrl}/api/news/top-headlines?page=${page.value}`);

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
        console.error("Error fetching top headlines:", error);
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
      <h1 class="text-3xl font-bold mb-6 text-indigo-300">Top Headlines</h1>

      {/* ✅ USER FEEDBACK
          Displays a message after the save action is performed. */}
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
          disabled={loading.value || !hasMore.value}
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'NewsFlow - Top Headlines',
};
