// src/routes/login/index.tsx
import { component$ } from '@builder.io/qwik';
import { Form, routeAction$, zod$, z } from '@builder.io/qwik-city';

// Zod for form validation
export const useLoginAction = routeAction$(
  async (data, { cookie, redirect }) => {
    // This action runs on the server
    const apiUrl = import.meta.env.PUBLIC_BACKEND_API_URL;
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return { success: false, error: 'Invalid credentials' };
    }

    const { session } = await response.json();

    // Set a secure, HttpOnly cookie with the access token
    cookie.set('auth_token', session.access_token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      // secure: true,
      maxAge: session.expires_in,
    });

    // Redirect to home page after login
    throw redirect(302, '/');
  },
  zod$({
    email: z.string().email(),
    password: z.string().min(6),
  })
);

export default component$(() => {
  const loginAction = useLoginAction();

  return (
    <div class="max-w-md mx-auto mt-10">
      <h1 class="text-3xl font-bold text-center mb-6">Login</h1>
      <Form action={loginAction} class="bg-slate-800 p-8 rounded-lg shadow-lg">
        <input name="email" type="email" placeholder="Email" class="w-full p-3 mb-4 bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input name="password" type="password" placeholder="Password" class="w-full p-3 mb-4 bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-md transition-colors">
          Log In
        </button>
        {loginAction.value?.success === false && (
          <p class="text-red-500 mt-4 text-center">{loginAction.value.error}</p>
        )}
      </Form>
    </div>
  );
});