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
  let elapsedSeconds = 0;
  let currentMusicActivity: any = null;
  let startTime = 0;
  let ticker: number;

  function updateProgress() {
    if (!currentMusicActivity?.timestamps?.start) return;
    
    // Calculate elapsed time since song started
    const now = Date.now();
    startTime = currentMusicActivity.timestamps.start;
    elapsedSeconds = Math.floor((now - startTime) / 1000);
    
    // Calculate duration and progress
    if (currentMusicActivity?.timestamps?.end) {
      duration = currentMusicActivity.timestamps.end - startTime;
      progress = Math.min(100, ((now - startTime) / duration) * 100);
    }
  }

  // Format time as MM:SS without relying on millisecond calculations each time
  function formatTime(seconds: number): string {
    if (seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  onMount(() => {
    wsConnection = new LanyardWebSocket(DISCORD_USER_ID, (data) => {
      discordData = data;
      discordStatus = data.discord_status;
      
      // Prioritize Spotify
      if (data.spotify) {
        currentMusicActivity = {
          name: "Spotify",
          details: data.spotify.song,
          state: data.spotify.artist,
          assets: {
            large_image: data.spotify.album_art_url
          },
          timestamps: data.spotify.timestamps
        };
      }
      // If no Spotify, check for YouTube Music activity
      else if (data.activities) {
        currentMusicActivity = data.activities.find(activity => 
          activity.name === "YouTube Music" && activity.type === 2
        );
        
        if (!currentMusicActivity) {
          currentMusicActivity = null;
        }
      } else {
        currentMusicActivity = null;
      }
      
      // Run initial update
      updateProgress();
      
      // Reset the timer
      if (ticker) window.clearInterval(ticker);
      
      // Only start ticker if we have music activity
      if (currentMusicActivity?.timestamps?.start) {
        // Update the elapsed time every second
        ticker = window.setInterval(() => {
          elapsedSeconds++;
          
          // Also update progress percentage
          if (currentMusicActivity?.timestamps?.end) {
            const totalDurationMs = currentMusicActivity.timestamps.end - currentMusicActivity.timestamps.start;
            progress = Math.min(100, (elapsedSeconds * 1000 / totalDurationMs) * 100);
          }
        }, 1000);
      }
    });
  });

  onDestroy(() => {
    if (wsConnection) {
      wsConnection.disconnect();
    }
    if (ticker) {
      window.clearInterval(ticker);
    }
  });
  
  // Improved function to get the proper image URL for YouTube Music
  function getMusicImage(activity: any): string {
    if (!activity?.assets?.large_image) return "";
    
    if (activity.name === "YouTube Music") {
      if (activity.assets.large_image.startsWith("mp:external/")) {
        // Try to extract video ID using a regex pattern
        const ytVideoIdMatch = activity.assets.large_image.match(/vi\/([a-zA-Z0-9_-]+)\//);
        if (ytVideoIdMatch && ytVideoIdMatch[1]) {
          return `https://i.ytimg.com/vi/${ytVideoIdMatch[1]}/hqdefault.jpg`;
        }
        
        // Direct URL extraction fallback
        const httpsIndex = activity.assets.large_image.indexOf("https");
        if (httpsIndex !== -1) {
          return activity.assets.large_image.substring(httpsIndex);
        }
      }
      return activity.assets.large_image;
    } 
    
    if (activity.name === "Spotify") {
      return activity.assets.large_image;
    }
    
    return "";
  }
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
        {#if currentMusicActivity}
          <div class="inline-flex flex-col items-center bg-black/30 backdrop-blur-sm rounded-xl px-4 py-2 text-white animate-slide-up w-80">
            <div class="flex items-center w-full mb-2">
              <img 
                src={getMusicImage(currentMusicActivity)} 
                alt="Album Art" 
                class="w-12 h-12 rounded-lg mr-3"
              />
              <div class="flex-1 min-w-0">
                <p class="font-medium truncate">{currentMusicActivity.details || 'Unknown track'}</p>
                <p class="text-sm text-gray-300 truncate">{currentMusicActivity.state || 'Unknown artist'}</p>
              </div>
            </div>
            
            <div class="w-full space-y-1">
              <div class="relative h-1 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  class="absolute h-full bg-gradient-to-r"
                  class:from-green-500={currentMusicActivity.name === "Spotify"} 
                  class:to-green-400={currentMusicActivity.name === "Spotify"}
                  class:from-red-500={currentMusicActivity.name === "YouTube Music"}
                  class:to-red-400={currentMusicActivity.name === "YouTube Music"}
                  style="width: {progress}%"
                ></div>
              </div>
              <div class="flex justify-between text-xs text-gray-400">
                <span>{formatTime(elapsedSeconds)}</span>
                <span>{formatTime(Math.floor(duration/1000))}</span>
              </div>
              <div class="text-xs text-gray-400 mt-1">
                {currentMusicActivity.name === "YouTube Music" ? "YouTube Music" : "Spotify"}
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
