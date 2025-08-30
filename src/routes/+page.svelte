<script lang="ts">
  import type { PageData } from './$types';
  import { supabase } from '$lib/supabaseClient';

  export let data: PageData;
  $: ({ session, playlists } = data);

  async function signOut() {
    await supabase.auth.signOut();
    // For an instant UI update on logout
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

    <div class="playlist-section">
      <h3>Your Playlists</h3>
      {#if playlists.length > 0}
        <ul class="playlist-grid">
          {#each playlists as playlist}
            <li class="playlist-item">
              <img
                src={playlist.images[0]?.url}
                alt="{playlist.name} cover"
                class="playlist-cover"
              />
              <span class="playlist-name">{playlist.name}</span>
            </li>
          {/each}
        </ul>
      {:else}
        <p>Could not find any playlists.</p>
      {/if}
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
    display: flex; flex-direction: column; align-items: center; width: 100vw;
    min-height: 100vh; padding: 2rem; background-color: #121212;
    color: white; font-family: system-ui, sans-serif; box-sizing: border-box;
  }
  .avatar {
    width: 80px; height: 80px; border-radius: 50%; border: 3px solid #1db954;
  }
  .user-info {
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .button {
    cursor: pointer; border: none; padding: 12px 24px; margin-top: 20px;
    border-radius: 50px; background-color: #1db954; color: white; font-weight: bold;
    text-decoration: none; transition: transform 0.2s; font-size: 1rem;
  }
  .button:hover { transform: scale(1.05); }
  .profile-section {
    display: flex; flex-direction: column; align-items: center;
    gap: 1rem; margin-bottom: 2rem;
  }
  .playlist-section {
    width: 100%; max-width: 900px; text-align: center;
  }
  .playlist-grid {
    list-style: none; padding: 0; margin-top: 1.5rem; display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1.5rem;
  }
  .playlist-item {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: 0.5rem;
  }
  .playlist-cover {
    width: 150px; height: 150px; object-fit: cover; border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  }
  .playlist-name { font-size: 0.9rem; font-weight: 500; }
</style>