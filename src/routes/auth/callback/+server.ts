import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { SupabaseClient } from '@supabase/supabase-js';

// Add this block to define the types for THIS file
declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient;
    }
  }
}

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get('code');

  if (code) {
    // This function exchanges the code for a session and sets the cookies
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to the home page after the session is set
  throw redirect(303, '/');
};