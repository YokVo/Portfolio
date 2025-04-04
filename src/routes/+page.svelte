<script>
  import Hero from '../components/organisms/Hero.svelte';
  import About from '../components/organisms/About.svelte';
  import Contact from '../components/organisms/Contact.svelte';
  import Footer from '../components/organisms/Footer.svelte';
  import Nav from '../components/organisms/Nav.svelte';
  import Work from '../components/organisms/Work.svelte';
</script>

<Nav />
<main class="min-h-screen bg-gray-900">
  <Hero />
  <About />
  <Work />
  <Contact />
  <Footer />
</main>
