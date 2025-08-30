import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, session } }) => {
  // If there's no session, return early
  if (!session) {
    return { session: null, playlists: [] };
  }

  // If there is a session, fetch playlists
  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {
      Authorization: `Bearer ${session.provider_token}`,
    },
  });

  if (!response.ok) {
    console.error('Failed to fetch playlists');
    return { session, playlists: [] }; // Return empty playlists on failure
  }

  const playlistData = await response.json();

  return { session, playlists: playlistData.items || [] };
};