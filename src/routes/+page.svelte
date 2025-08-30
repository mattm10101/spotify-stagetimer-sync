<script lang="ts">
  import type { PageData } from './$types';
  import { supabase } from '$lib/supabaseClient';

  export let data: PageData;
  $: ({ session, debugData, origin } = data);
</script>

<main class="container">
  {#if debugData}
    <div class="debug-box">
      <h3>Session Data from Server:</h3>
      <pre>{debugData}</pre>
    </div>
  {/if}

  {#if session}
    <div class="user-info">
      <h2>Welcome, {session.user.user_metadata?.name}!</h2>
      <p>Login successful. See session data above.</p>
    </div>
  {:else}
    <div class="user-info">
      <h2>Spotify Sync</h2>
      <p>Please sign in to continue.</p>
      <button
        on:click={async () =>
          await supabase.auth.signInWithOAuth({
            provider: 'spotify',
            options: {
              scopes: 'user-read-playback-state user-modify-playback-state playlist-read-private',
              redirectTo: `${origin}/auth/callback` // <-- THE FIX IS HERE
            }
          })}
        class="button"
      >
        Sign in with Spotify
      </button>
    </div>
  {/if}
</main>

<style>
  .container {
    padding: 2rem; background-color: #121212; color: white;
    font-family: system-ui, sans-serif; min-height: 100vh;
  }
  .user-info { text-align: center; margin-top: 2rem; }
  .button {
    cursor: pointer; border: none; padding: 12px 24px; margin-top: 20px;
    border-radius: 50px; background-color: #1db954; color: white;
    font-weight: bold; font-size: 1rem;
  }
  .debug-box {
    background-color: #282828; border: 1px solid #444; padding: 1rem;
    border-radius: 8px; max-width: 800px; margin: 2rem auto; text-align: left;
  }
  pre {
    white-space: pre-wrap; word-break: break-all;
    font-family: monospace; font-size: 0.9rem;
  }
</style>