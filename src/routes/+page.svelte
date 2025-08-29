<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import type { Session } from '@supabase/supabase-js';

  let session: Session | null = null;

  onMount(() => {
    // Check for an existing session when the page loads
    supabase.auth.getSession().then(({ data }) => {
      session = data.session;
    });

    // Set up a real-time listener for any changes in auth state (login/logout)
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      session = newSession;
    });

    // Unsubscribe from the listener when the component is destroyed
    return () => data.subscription.unsubscribe();
  });

  // Function to sign in with Spotify
  async function signInWithSpotify() {
    await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        // Requesting permission to read playlists and control the player
        scopes: 'user-read-playback-state user-modify-playback-state playlist-read-private',
      },
    });
  }

  // Function to sign out
  async function signOut() {
    await supabase.auth.signOut();
  }
</script>

<main class="container">
  {#if session}
    <img
      src={session.user.user_metadata?.avatar_url}
      alt="User Avatar"
      class="avatar"
    />
    <div class="user-info">
      <h2>Welcome, {session.user.user_metadata?.full_name}!</h2>
      <button on:click={signOut} class="button">Sign Out</button>
    </div>
  {:else}
    <div class="user-info">
      <h2>Spotify Sync</h2>
      <p>Please sign in to continue.</p>
      <button on:click={signInWithSpotify} class="button">Sign in with Spotify</button>
    </div>
  {/if}
</main>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100vw;
    height: 100vh;
    background-color: #121212;
    color: white;
    font-family: system-ui, sans-serif;
  }
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid #1db954; /* Spotify Green */
  }
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .button {
    cursor: pointer;
    border: none;
    padding: 12px 24px;
    margin-top: 20px;
    border-radius: 50px;
    background-color: #1db954; /* Spotify Green */
    color: white;
    font-weight: bold;
    text-decoration: none;
    transition: transform 0.2s;
    font-size: 1rem;
  }
  .button:hover {
    transform: scale(1.05);
  }

  /* Portrait layout (mobile-first) */
  .container {
    flex-direction: column;
    gap: 20px;
  }

  /* Landscape layout */
  @media (orientation: landscape) {
    .container {
      flex-direction: row;
      gap: 50px;
    }
  }
</style>