import { component$, useContext } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { AuthContext } from '~/routes/layout';

export const Navbar = component$(() => {
  const userSession = useContext(AuthContext);

  return (
    <header class="bg-slate-800/80 backdrop-blur-md sticky top-0 z-50">
      <nav class="container mx-auto flex justify-between items-center p-4 text-white">
        <Link href="/" class="flex items-center">
          <img src="/logo.png" alt="NewsFlow Logo" class="h-8 w-auto mr-2" />
          <span class="text-2xl font-bold text-indigo-400">NewsFlow</span>
        </Link>
        <ul class="hidden md:flex items-center space-x-6">
          <li><Link href="/category/technology" class="hover:text-indigo-300">Technology</Link></li>
          <li><Link href="/category/science" class="hover:text-indigo-300">Science</Link></li>
          <li><Link href="/category/business" class="hover:text-indigo-300">Business</Link></li>
        </ul>

        <div class="flex items-center space-x-4">
          {userSession.value.isLoggedIn ? (
            <div class="flex items-center space-x-4">
              <Link href="/saved" class="hover:text-indigo-300">Saved</Link>
              <Link href="/history" class="hover:text-indigo-300">History</Link>

              {/* 🔁 Changed from Form to Link for onRequest-based logout */}
              <Link
                href="/logout"
                class="bg-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-500"
              >
                Logout
              </Link>
            </div>
          ) : (
            <div class="hidden md:flex items-center space-x-2">
              <Link href="/login" class="px-4 py-2 rounded-md hover:bg-slate-700">Login</Link>
              <Link href="/signup" class="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500">Sign Up</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
});
