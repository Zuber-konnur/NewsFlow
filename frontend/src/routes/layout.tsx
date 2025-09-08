import { component$, Slot, createContextId, useContextProvider, useSignal, Signal } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { Navbar } from '~/components/header/Navbar';

export interface UserSession { isLoggedIn: boolean; }
export const AuthContext = createContextId<Signal<UserSession>>('auth-context');

export const useUserSession = routeLoader$(({ cookie }) => {
  return { isLoggedIn: !!cookie.get('auth_token')?.value };
});

export default component$(() => {
  const userSession = useUserSession();
  const sessionSignal = useSignal(userSession.value);
  useContextProvider(AuthContext, sessionSignal);

  return (
    <>
      <Navbar />
      <main class="container mx-auto p-4 md:p-6">
        <Slot />
      </main>
      <footer class="text-center p-4 bg-slate-800/50 mt-12">
        <p class="text-gray-400">NewsFlow &copy; 2025</p>
      </footer>
    </>
  );
});
