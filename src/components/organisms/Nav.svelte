<script>
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  
  let isMenuOpen = false;
  let activeSection = "hero";
  
  // Function to handle smooth scrolling when a nav link is clicked
  function scrollToSection(event, sectionId) {
    event.preventDefault();
    
    const section = document.getElementById(sectionId);
    if (section) {
      // Set the active section
      activeSection = sectionId;
      
      // Scroll to the section smoothly
      section.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Close mobile menu after clicking
      isMenuOpen = false;
    }
  }
  
  // Update active section on scroll
  onMount(() => {
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveSection() {
      const scrollPosition = window.scrollY + 100; // Add offset to account for the fixed nav
      
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          activeSection = section.getAttribute('id');
        }
      });
    }
    
    window.addEventListener('scroll', updateActiveSection);
    
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
    };
  });
  
  // Toggle mobile menu
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<nav class="fixed w-full z-50 bg-gray-900/80 backdrop-blur-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <a 
        href="#hero" 
        on:click|preventDefault={(e) => scrollToSection(e, 'hero')}
        class="text-white font-bold text-xl"
      >
        Portfolio
      </a>
      
      <div class="hidden md:flex space-x-6">
        <a 
          href="#hero" 
          class="nav-link transition-colors {activeSection === 'hero' ? 'active' : ''}" 
          on:click={(e) => scrollToSection(e, 'hero')}
        >
          Home
        </a>
        <a 
          href="#about" 
          class="nav-link transition-colors {activeSection === 'about' ? 'active' : ''}" 
          on:click={(e) => scrollToSection(e, 'about')}
        >
          About
        </a>
        <a 
          href="#work" 
          class="nav-link transition-colors {activeSection === 'work' ? 'active' : ''}" 
          on:click={(e) => scrollToSection(e, 'work')}
        >
          Work
        </a>
        <a 
          href="#contact" 
          class="nav-link transition-colors {activeSection === 'contact' ? 'active' : ''}" 
          on:click={(e) => scrollToSection(e, 'contact')}
        >
          Contact
        </a>
      </div>
      
      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button 
          class="mobile-menu-button"
          on:click={toggleMenu}
          aria-label="Toggle menu"
        >
          <div class="menu-icon {isMenuOpen ? 'open' : ''}">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </div>
    
    <!-- Mobile menu -->
    {#if isMenuOpen}
      <div 
        transition:slide={{ duration: 300 }}
        class="mobile-menu md:hidden"
      >
        <a 
          href="#hero" 
          class="mobile-nav-link {activeSection === 'hero' ? 'active' : ''}" 
          on:click={(e) => scrollToSection(e, 'hero')}
        >
          <span>Home</span>
          {#if activeSection === 'hero'}
            <span class="mobile-active-indicator"></span>
          {/if}
        </a>
        <a 
          href="#about" 
          class="mobile-nav-link {activeSection === 'about' ? 'active' : ''}" 
          on:click={(e) => scrollToSection(e, 'about')}
        >
          <span>About</span>
          {#if activeSection === 'about'}
            <span class="mobile-active-indicator"></span>
          {/if}
        </a>
        <a 
          href="#work" 
          class="mobile-nav-link {activeSection === 'work' ? 'active' : ''}" 
          on:click={(e) => scrollToSection(e, 'work')}
        >
          <span>Work</span>
          {#if activeSection === 'work'}
            <span class="mobile-active-indicator"></span>
          {/if}
        </a>
        <a 
          href="#contact" 
          class="mobile-nav-link {activeSection === 'contact' ? 'active' : ''}" 
          on:click={(e) => scrollToSection(e, 'contact')}
        >
          <span>Contact</span>
          {#if activeSection === 'contact'}
            <span class="mobile-active-indicator"></span>
          {/if}
        </a>
      </div>
    {/if}
  </div>
</nav>

<style>
  /* Styling for navigation links */
  .nav-link {
    position: relative;
    padding: 0.5rem 0.75rem;
    border-radius: 9999px;
    color: #d1d5db; /* text-gray-300 */
  }
  
  .nav-link:hover {
    color: white;
    background-color: rgba(75, 85, 99, 0.3); /* bg-gray-600/30 */
  }
  
  .nav-link.active {
    color: white;
    background-color: rgba(59, 130, 246, 0.2); /* bg-blue-500/20 */
  }
  
  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 3px;
    background-color: #3b82f6; /* bg-blue-500 */
    border-radius: 9999px;
  }
  
  /* Mobile menu button */
  .mobile-menu-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(55, 65, 81, 0.5); /* bg-gray-700/50 */
    transition: background-color 0.2s;
  }
  
  .mobile-menu-button:hover {
    background-color: rgba(55, 65, 81, 0.8); /* bg-gray-700/80 */
  }
  
  /* Hamburger icon */
  .menu-icon {
    position: relative;
    width: 20px;
    height: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .menu-icon span {
    display: block;
    height: 2px;
    width: 100%;
    background-color: white;
    border-radius: 4px;
    transition: all 0.3s;
    transform-origin: left center;
  }
  
  .menu-icon.open span:first-child {
    transform: rotate(45deg);
    width: 22px;
  }
  
  .menu-icon.open span:nth-child(2) {
    opacity: 0;
    transform: translateX(-10px);
  }
  
  .menu-icon.open span:last-child {
    transform: rotate(-45deg);
    width: 22px;
  }
  
  /* Mobile menu */
  .mobile-menu {
    background: linear-gradient(to bottom, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.98));
    margin: 0 -1rem;
    border-radius: 0 0 1rem 1rem;
    overflow: hidden;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding-bottom: 0.5rem;
  }
  
  .mobile-nav-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.25rem;
    color: #e5e7eb; /* text-gray-200 */
    font-size: 1.125rem;
    border-bottom: 1px solid rgba(75, 85, 99, 0.2);
    transition: all 0.2s;
    margin: 0 0.5rem;
  }
  
  .mobile-nav-link:last-child {
    border-bottom: none;
    border-radius: 0 0 0.75rem 0.75rem;
  }
  
  .mobile-nav-link:first-child {
    margin-top: 0.5rem;
    border-radius: 0.75rem 0.75rem 0 0;
  }
  
  .mobile-nav-link:hover {
    background-color: rgba(75, 85, 99, 0.2);
    padding-left: 1.5rem;
  }
  
  .mobile-nav-link.active {
    color: #3b82f6; /* text-blue-500 */
    font-weight: 500;
    background-color: rgba(59, 130, 246, 0.1);
  }
  
  .mobile-active-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #3b82f6; /* bg-blue-500 */
  }
</style>
