<script lang="ts">
  import type { GithubRepo } from '$lib/types/github';
  import { onMount } from 'svelte';

  let repos: GithubRepo[] = [];
  let loading = true;

  onMount(async () => {
    try {
      const response = await fetch('https://chiraitori-gh-pinned-repo.deno.dev/?username=chiraitori');
      repos = await response.json();
    } catch (error) {
      console.error('Failed to fetch repos:', error);
    } finally {
      loading = false;
    }
  });
</script>

<section id="work" class="py-20 bg-gray-900">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-white mb-8">My Work</h2>
    
    {#if loading}
      <div class="flex justify-center items-center h-64">
        <div class="loading-spinner"></div>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each repos as repo}
          <a href={repo.link} target="_blank" rel="noopener noreferrer" 
             class="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors h-full flex flex-col">
            <h3 class="text-xl font-semibold text-white mb-2 truncate">{repo.repo}</h3>
            <p class="text-gray-400 text-sm mb-4 flex-grow line-clamp-3">{repo.description || 'No description available'}</p>
            <div class="flex items-center justify-between text-sm mt-auto">
              <span class="text-gray-300 truncate max-w-[40%]" title={repo.language}>{repo.language || 'Unknown'}</span>
              <div class="flex items-center space-x-4">
                <span class="text-gray-300 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  {repo.stars}
                </span>
                <span class="text-gray-300 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  {repo.forks}
                </span>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  /* Loading spinner */
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    border-left-color: #3b82f6;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Text truncation utils */
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
