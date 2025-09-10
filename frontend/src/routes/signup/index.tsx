import { component$ } from '@builder.io/qwik';
import { Form, routeAction$, zod$, z } from '@builder.io/qwik-city';

export const useSignupAction = routeAction$(async (data, { cookie, redirect }) => {
    const apiUrl = import.meta.env.PUBLIC_BACKEND_API_URL;
    const response = await fetch(`${apiUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) return { success: false, error: 'Could not sign up user.' };
    const { session } = await response.json();
    cookie.set('auth_token', session.access_token, { path: '/', httpOnly: true, secure: true, maxAge: session.expires_in });
    throw redirect(302, '/');
  },
  zod$({ name: z.string().min(1), email: z.string().email(), password: z.string().min(6) })
);

export default component$(() => {
  const signupAction = useSignupAction();
  return (
    <div class="max-w-md mx-auto mt-10">
      <h1 class="text-3xl font-bold text-center mb-6">Create Account</h1>
      <Form action={signupAction} class="bg-slate-800 p-8 rounded-lg shadow-lg">
        <input name="name" type="text" placeholder="Full Name" class="w-full p-3 mb-4 bg-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input name="email" type="email" placeholder="Email" class="w-full p-3 mb-4 bg-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input name="password" type="password" placeholder="Password" class="w-full p-3 mb-4 bg-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-md">Sign Up</button>
        {signupAction.value?.success === false && (
          <p class="text-red-500 mt-4 text-center">{signupAction.value.error}</p>
        )}
      </Form>
    </div>
  );
});
