import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get('code');

  if (code) {
    try {
      console.log('Attempting to exchange code for session...');
      await supabase.auth.exchangeCodeForSession(code);
      console.log('Code exchange successful!');
    } catch (error) {
      // This will catch the hidden error and print it to the log
      console.error('ERROR during code exchange:', error);
    }
  } else {
    console.log('No code found in callback URL.');
  }

  // Redirect back to the home page
  throw redirect(303, '/');
};