// src/components/news/NewsCard.tsx
// import { component$ } from '@builder.io/qwik';

// export interface Article {
//   title: string;
//   description: string;
//   url: string;
//   image: string;
//   publishedAt: string;
// }

// interface NewsCardProps {
//   article: Article;
// }

// export const NewsCard = component$<NewsCardProps>(({ article }) => {
//   return (
//     <div class="border rounded-lg overflow-hidden shadow-lg flex flex-col">
//       <img class="h-48 w-full object-cover" src={article.image} alt={article.title} />
//       <div class="p-4 flex flex-col flex-grow">
//         <h3 class="font-bold text-lg mb-2">{article.title}</h3>
//         <p class="text-gray-700 text-base flex-grow">{article.description}</p>
//         <div class="mt-4 flex justify-between items-center">
//           <span class="text-sm text-gray-600">
//             {new Date(article.publishedAt).toLocaleDateString()}
//           </span>
//           <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// });


import { component$ } from '@builder.io/qwik';
import type { ActionStore } from '@builder.io/qwik-city';
import { Form, Link } from '@builder.io/qwik-city';

export interface Article { title: string; description: string; url: string; image: string; publishedAt: string; content?: string; source?: { name: string }; }
interface NewsCardProps {
  article: Article;
  isLoggedIn?: boolean;
  saveAction?: ActionStore<any, any>;
  historyAction?: ActionStore<any, any>;
}

export const NewsCard = component$<NewsCardProps>(({ article, isLoggedIn = false, saveAction, historyAction }) => {
  return (
    <div class="bg-slate-300 rounded-lg overflow-hidden shadow-lg shadow-black/20 flex flex-col group transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/20 relative">
      <Link href={article.url} target="_blank" onClick$={() => {
        if (isLoggedIn && historyAction) {
          historyAction.submit({
            title: article.title,
            description: article.description || '',
            content: article.content || '',
            url: article.url,
            image: article.image || '',
            publishedAt: article.publishedAt || '',
          });
        }
      }}>
        <img class="h-56 w-full object-cover" src={article.image || '/placeholder.png'} alt={article.title} />
      </Link>
      <div class="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">{article.source?.name || 'Unknown'}</div>
      <div class="p-4 flex flex-col flex-grow">
        <h3 class="font-bold text-lg mb-2 flex-grow">{article.title}</h3>
        <div class="mt-auto flex justify-between items-center">
          <span class="text-xs text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
          {isLoggedIn && saveAction && (
            <Form action={saveAction}>
              <input type="hidden" name="title" value={article.title} />
              <input type="hidden" name="description" value={article.description || ''} />
              <input type="hidden" name="content" value={article.content || ''} />
              <input type="hidden" name="url" value={article.url} />
              <input type="hidden" name="image" value={article.image || ''} />
              <input type="hidden" name="publishedAt" value={article.publishedAt || ''} />
              <button type="submit" class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3 rounded-md text-xs">Save</button>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
});
