import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  // This function will now only return a plain text message.
  return text('Callback route was reached successfully.');
};