<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { LanyardWebSocket } from '$lib/utils/lanyard';
  import type { LanyardResponse } from '$lib/utils/lanyard';

  const DISCORD_USER_ID = '685716988471148552';
  let discordData: LanyardResponse['data'] | null = null;
  let wsConnection: LanyardWebSocket;
  let discordStatus = '';
  let progress = 0;
  let duration = 0;

  function updateProgress() {
    if (discordData?.spotify) {
      const start = discordData.spotify.timestamps.start;
      const end = discordData.spotify.timestamps.end;
      duration = end - start;
      const current = Date.now() - start;
      progress = (current / duration) * 100;
    }
  }

  onMount(() => {
    wsConnection = new LanyardWebSocket(DISCORD_USER_ID, (data) => {
      discordData = data;
      discordStatus = data.discord_status;
    });
    const progressInterval = setInterval(updateProgress, 1000);
    return () => clearInterval(progressInterval);
  });

  onDestroy(() => {
    if (wsConnection) {
      wsConnection.disconnect();
    }
  });

  $: formattedTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
</script>

<section class="relative h-screen flex items-center justify-center overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 animate-gradient"></div>
  
  <div class="relative z-10 text-center px-4">
    <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
      Hello, I'm <span class="text-blue-300">Yok_Vo</span>
    </h1>
    
    <p class="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in">
      Love to look to the program and learning.<br>
      Attempting to program.
    </p>

    <div class="space-y-4">
      <div class="flex flex-col items-center gap-4">
        {#if discordData?.spotify}
          <div class="inline-flex flex-col items-center bg-black/30 backdrop-blur-sm rounded-xl px-4 py-2 text-white animate-slide-up w-80">
            <div class="flex items-center w-full mb-2">
              <img src={discordData.spotify.album_art_url} alt="Album Art" class="w-12 h-12 rounded-lg mr-3"/>
              <div class="flex-1 min-w-0">
                <p class="font-medium truncate">{discordData.spotify.song}</p>
                <p class="text-sm text-gray-300 truncate">{discordData.spotify.artist}</p>
              </div>
            </div>
            
            <div class="w-full space-y-1">
              <div class="relative h-1 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  class="absolute h-full bg-green-500 transition-all duration-1000 ease-linear"
                  style="width: {progress}%"
                ></div>
              </div>
              <div class="flex justify-between text-xs text-gray-400">
                <span>{formattedTime(Date.now() - discordData.spotify.timestamps.start)}</span>
                <span>{formattedTime(duration)}</span>
              </div>
            </div>
          </div>
        {/if}
        
        <div class="inline-flex items-center bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 text-white">
          <div class="w-3 h-3 rounded-full mr-2 {
            discordStatus === 'online' ? 'bg-green-500' :
            discordStatus === 'idle' ? 'bg-yellow-500' :
            discordStatus === 'dnd' ? 'bg-red-500' : 'bg-gray-500'
          }"></div>
          <span class="capitalize">{discordStatus || 'offline'}</span>
        </div>
      </div>
    </div>
  </div>

  <button 
    on:click={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
    class="absolute bottom-8 animate-bounce-slow cursor-pointer group"
    aria-label="Scroll to about section"
  >
    <svg 
      class="w-8 h-8 text-white/70 group-hover:text-white transition-colors" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      />
    </svg>
  </button>
</section>

<style>
  .animate-gradient {
    animation: gradient 8s ease infinite;
    background-size: 200% 200%;
  }

  .animate-slide-up {
    animation: slideUp 0.8s ease-out forwards;
  }

  .animate-fade-in {
    animation: fadeIn 1s ease-out forwards;
  }

  .animate-bounce-slow {
    animation: bounce 2s infinite;
  }

  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(15px);
    }
  }

  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
