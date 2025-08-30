<script lang="ts">
  import type { PageData } from './$types';
  import { supabase } from '$lib/supabaseClient';

  export let data: PageData;
  $: ({ session, playlists } = data);

  // New state for selected playlist and its tracks
  let selectedPlaylistId: string | null = null;
  let tracks: any[] = [];
  let isLoadingTracks = false;

  async function fetchTracks(playlistId: string) {
    if (!session?.provider_token) return;

    selectedPlaylistId = playlistId;
    isLoadingTracks = true;
    tracks = []; // Clear previous tracks

    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/{playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${session.provider_token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch tracks');
      const data = await response.json();
      tracks = data.items;
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      isLoadingTracks = false;
    }
  }

  // Helper to format milliseconds into MM:SS
  function formatDuration(ms: number) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  }

  async function signOut() {
    await supabase.auth.signOut();
    session = null;
    playlists = [];
  }
</script>

<main class="container">
  {#if session}
    <div class="profile-section">
      </div>

    <div class="content-grid">
      <div class="playlist-section">
        <h3>Your Playlists</h3>
        <ul class="item-list">
          {#each playlists as playlist}
            <li>
              <button class="item-button" on:click={() => fetchTracks(playlist.id)} class:active={selectedPlaylistId === playlist.id}>
                <img src={playlist.images[0]?.url} alt="" class="item-cover"/>
                <span class="item-name">{playlist.name}</span>
              </button>
            </li>
          {/each}
        </ul>
      </div>

      <div class="track-section">
        <h3>Tracks</h3>
        {#if isLoadingTracks}
          <p>Loading tracks...</p>
        {:else if tracks.length > 0}
          <ul class="item-list">
            {#each tracks as item}
              <li>
                <div class="track-item">
                  <span class="item-name">{item.track.name}</span>
                  <span class="track-duration">{formatDuration(item.track.duration_ms)}</span>
                </div>
              </li>
            {/each}
          </ul>
        {:else if selectedPlaylistId}
          <p>No tracks found in this playlist.</p>
        {:else}
          <p>Select a playlist to see its tracks.</p>
        {/if}
      </div>
    </div>
  {:else}
    {/if}
</main>

<style>
/* --- Previous Styles (can be replaced for the new layout) --- */
.container {
  width: 100%; min-height: 100vh; padding: 2rem; background-color: #121212;
  color: white; font-family: system-ui, sans-serif; box-sizing: border-box;
}
.profile-section { /* ...same as before... */ }
.button { /* ...same as before... */ }

/* --- New & Updated Styles for Two-Column Layout --- */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 2fr; /* Playlists take 1/3, Tracks take 2/3 */
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin-top: 2rem;
}
.playlist-section, .track-section {
  background-color: #181818;
  border-radius: 8px;
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}
.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.item-button {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  border: none;
  background-color: transparent;
  color: white;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;
}
.item-button:hover {
  background-color: #282828;
}
.item-button.active {
  background-color: #333;
}
.item-cover {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}
.item-name {
  font-weight: 500;
}
.track-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #282828;
}
.track-duration {
  color: #aaa;
}
</style>