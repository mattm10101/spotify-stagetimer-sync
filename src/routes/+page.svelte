<script lang="ts">
  import type { PageData } from './$types';
  import { supabase } from '$lib/supabaseClient';

  export let data: PageData;
  $: ({ session, playlists } = data);

  async function signOut() {
    await supabase.auth.signOut();
    session = null;
    playlists = [];
  }
</script>

<main class="container">
  {#if session}
    <div class="profile-section">
      <img
        src={session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture}
        alt="User Avatar"
        class="avatar"
      />
      <div class="user-info">
        <h2>Welcome, {session.user.user_metadata?.name}!</h2>
        <button on:click={signOut} class="button">Sign Out</button>
      </div>
    </div>
    {:else}
    <div class="user-info">
      <h2>Spotify Sync</h2>
      <p>Please sign in to continue.</p>
      <button on:click={async () => await supabase.auth.signInWithOAuth({provider: 'spotify', options: {scopes: 'user-read-playback-state user-modify-playback-state playlist-read-private'}})} class="button">
        Sign in with Spotify
      </button>
    </div>
  {/if}
</main>

<style>
  .container {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; width: 100vw; height: 100vh;
    padding: 2rem; background-color: #121212;
    color: white; font-family: system-ui, sans-serif; box-sizing: border-box;
  }
  .avatar {
    width: 80px; height: 80px; border-radius: 50%; border: 3px solid #1db954;
  }
  .user-info {
    display: flex; flex-direction: column; align-items: center;
  }
  .button {
    cursor: pointer; border: none; padding: 12px 24px; margin-top: 20px;
    border-radius: 50px; background-color: #1db954; color: white; font-weight: bold;
    text-decoration: none; transition: transform 0.2s; font-size: 1rem;
  }
  .button:hover { transform: scale(1.05); }
  .profile-section {
    display: flex; flex-direction: column; align-items: center;
    gap: 1rem;
  }
</style>