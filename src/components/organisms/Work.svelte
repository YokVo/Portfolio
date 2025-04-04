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
      <div class="text-center text-gray-400">Loading projects...</div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each repos as repo}
          <a href={repo.link} target="_blank" rel="noopener noreferrer" 
             class="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
            <h3 class="text-xl font-semibold text-white mb-2">{repo.repo}</h3>
            <p class="text-gray-400 text-sm mb-4">{repo.description}</p>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-300">{repo.language}</span>
              <div class="flex items-center space-x-4">
                <span class="text-gray-300">⭐ {repo.stars}</span>
                <span class="text-gray-300">🔱 {repo.forks}</span>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>
