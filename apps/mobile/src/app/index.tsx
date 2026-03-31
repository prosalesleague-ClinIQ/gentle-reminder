import { Redirect } from 'expo-router';

/**
 * Entry screen - redirects to login.
 * When auth is implemented with a backend, this will check token
 * and redirect to /(tabs)/home if authenticated.
 */
export default function Index() {
  // For now, always go to login.
  // Once backend is running, check auth state here.
  return <Redirect href="/login" />;
}
