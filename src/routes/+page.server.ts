import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { session } }) => {
  if (!session) {
    return {
      session: null,
      debugData: 'No session was found by the server.',
      origin: url.origin // Pass the origin to the page
    };
  }

  return {
    session,
    debugData: JSON.stringify(session, null, 2),
    origin: url.origin // Pass the origin to the page
  };
};