import type { RequestEvent } from '@builder.io/qwik-city';
import { component$ } from '@builder.io/qwik';

export const onRequest = ({ cookie, redirect }: RequestEvent) => {
  // Delete the auth_token cookie
  cookie.delete('auth_token', { path: '/' });

  // Redirect to home page after logout
  throw redirect(302, '/');
};

export default component$(() => {
  return null;
});
