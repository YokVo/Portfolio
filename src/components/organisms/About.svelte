<section id="about" class="py-20 bg-gray-800">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-white mb-8">About Me</h2>
    
    <div class="grid md:grid-cols-2 gap-8">
      <div class="space-y-4">
        <p class="text-gray-300">As a dedicated newbie in the exciting field of [tên lĩnh vực], I am eager to learn and contribute, bringing a fresh perspective and a strong enthusiasm for [một khía cạnh bạn quan tâm] while actively developing my skills in [một vài kỹ năng bạn đang học hoặc muốn phát triển].</p>
        <div class="flex flex-wrap gap-2">
          {#each ['React', 'Svelte', 'TypeScript', 'Node.js'] as skill}
            <span class="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">{skill}</span>
          {/each}
        </div>
      </div>
      
      <div class="animate-float flex items-center justify-center">
        <div class="image-container">
          <img src="your-image-url.jpg" alt="Profile" class="profile-image rounded-lg shadow-xl"/>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  
  .image-container {
    width: 300px;
    height: 300px;
    overflow: hidden;
    border-radius: 0.5rem;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  }
  
  .profile-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
</style>
