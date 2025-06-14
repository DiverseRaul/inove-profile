<template>
  <div class="home-view-wrapper">
    <div class="hero-container">
    <NavBar />
    <div class="particles-bg"></div>
    <section class="hero-section" :class="{ visible: isVisible }">
      <h1 v-if="firstName" class="welcome-title gradient-text">Welcome, {{ firstName }}!</h1>
      <h1 v-else class="welcome-title gradient-text">Welcome to inove.profile</h1>
      <p class="tagline">Showcase your skills and projects with a stunning developer profile.</p>
      <div class="hero-cta-buttons">
        <button class="cta-button primary" @click="scrollToProjects">View My Work</button>
        <button class="cta-button secondary" @click="navigateToCatalog">Explore Catalog</button>
      </div>
    </section>
    </div>

    <section id="favorites-section" class="content-section favorites-section">
      <div class="container">
        <h2 class="section-title">My Favorites</h2>
        <div v-if="isLoadingFavorites" class="loading-indicator">
          <p>Loading your favorites...</p>
          <!-- You can add a spinner or more elaborate loading animation here -->
        </div>
        <div v-else-if="favoritesError" class="error-message">
          <p>{{ favoritesError }}</p>
        </div>
        <div v-else-if="!favoritesList || favoritesList.length === 0" class="section-placeholder">
          <p>You haven't added any favorites yet!</p>
          <p>Explore and mark some items as your favorites to see them here.</p>
        </div>
        <div v-else class="favorites-grid">
          <div v-for="favorite in favoritesList" :key="favorite.id" class="favorite-item-card">
            <a :href="favorite.link_url || '#!'" target="_blank" rel="noopener noreferrer" class="favorite-link">
              <img v-if="favorite.image_url" :src="favorite.image_url" :alt="favorite.title || 'Favorite item image'" class="favorite-image">
              <div v-else class="favorite-image-placeholder">
                <span class="material-icons-outlined">star_border</span>
              </div>
              <div class="favorite-content">
                <h3 class="favorite-title">{{ favorite.title || 'Unnamed Favorite' }}</h3>
                <p v-if="favorite.description" class="favorite-description">{{ favorite.description }}</p>
                <span class="favorite-item-type">Type: {{ favorite.item_type }}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { User, Subscription, PostgrestError } from '@supabase/supabase-js'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'

const isVisible = ref(false)
const currentUser = ref<User | null>(null)
const firstName = ref<string | null>(null)
let authListener: Subscription | null = null;

interface FavoriteItem {
  id: number;
  user_id: string;
  item_type: string;
  item_ref_id: string;
  title?: string | null;
  description?: string | null;
  image_url?: string | null;
  link_url?: string | null;
  created_at: string;
}

const favoritesList = ref<FavoriteItem[]>([]);
const isLoadingFavorites = ref(false);
const favoritesError = ref<string | null>(null);

const updateUserProfile = (user: User | null) => {
  currentUser.value = user;
  if (user && user.user_metadata && user.user_metadata.first_name) {
    fetchFavorites(user.id); // Fetch favorites when user profile is updated
    firstName.value = user.user_metadata.first_name;
  } else {
    firstName.value = null;
  }
};

const fetchFavorites = async (userId: string) => {
  if (!userId) return;
  isLoadingFavorites.value = true;
  favoritesError.value = null;
  favoritesList.value = [];

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data) {
      favoritesList.value = data;
    }
  } catch (err) {
    const e = err as PostgrestError | Error;
    console.error('Error fetching favorites:', e.message);
    favoritesError.value = 'Could not load your favorites at this time.';
  } finally {
    isLoadingFavorites.value = false;
  }
};

onMounted(async () => {
  setTimeout(() => {
    isVisible.value = true
  }, 100);

  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    updateUserProfile(session.user);
    // fetchFavorites(session.user.id); // Already called in updateUserProfile
  } else {
    updateUserProfile(null);
    favoritesList.value = []; // Clear favorites if user logs out
  }
  isVisible.value = true; // Trigger fade-in for hero section

  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    updateUserProfile(session?.user ?? null);
  });
  authListener = listener.subscription;
})
const navigateToCatalog = () => {
  // Placeholder: Implement navigation to catalog page/view
  console.log('Navigate to catalog clicked');
  // Example: router.push('/catalog');
};

const scrollToProjects = () => {
  // Placeholder: Implement scroll to projects section or navigation
  console.log('Scroll to projects clicked');
  // Example: router.push('/projects') or document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' });
};

onUnmounted(() => {
  if (authListener) {
    authListener.unsubscribe();
  }
});
</script>


<style scoped>
.home-view-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure wrapper takes full height if content is short */
}

.hero-container {
  /* min-height: 100vh; Let hero take natural height or a specific height like 80vh or 90vh if preferred */
  height: 90vh; /* Example: Make hero take 90% of viewport height */
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden; /* For background animation if it overflows */
  /* Adjusted gradient for a potentially more 'subtle' but defined look */
  background: linear-gradient(135deg, 
    var(--color-surface-dim, #2c2a33) 0%, /* Darker surface color */
    var(--color-primary-container-semi-opaque, rgba(103, 58, 183, 0.1)) 35%, /* Primary, adjusted opacity */
    var(--color-secondary-container-semi-opaque, rgba(0, 121, 107, 0.1)) 65%, /* Secondary, adjusted opacity */
    var(--color-surface, #1e1c24) 100%); /* Another darker surface color */
  background-size: 300% 300%; /* Slightly smaller size for potentially faster perceived animation */
  animation: gradientBG 20s ease infinite; /* Slightly faster animation */
  z-index: 0; /* Ensure it's a base layer */
}

.content-section {
  padding: var(--spacing-xxl) var(--spacing-md) var(--spacing-xxl); /* Ensure consistent padding */
  background-color: var(--color-surface-container, #222028); /* Using a slightly darker surface for more depth */
  color: var(--color-on-surface, #e6e1e5);
  border-top: 1px solid var(--color-outline-variant, #49454e);
}

.content-section .container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.section-title {
  margin-top: var(--spacing-3xl);
  font-size: var(--font-size-headline-large, 2.5rem); /* Larger, more impactful title */
  font-weight: 600; /* Slightly bolder */
  color: var(--color-on-surface, #e6e1e5); /* Match primary text color for clean look */
  margin-bottom: var(--spacing-xl); /* More space below title */
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: var(--spacing-md);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background-color: var(--color-primary, #d0bcff);
  border-radius: 2px;
}

.loading-indicator p,
.error-message p {
  font-size: var(--font-size-title-medium, 1.25rem);
  color: var(--color-on-surface-variant, #cac4cf);
  padding: var(--spacing-xl);
  text-align: center;
}

.error-message p {
  color: var(--color-error, #f2b8b5);
}

.section-placeholder {
  font-size: var(--font-size-title-medium, 1.25rem); /* Slightly larger for emphasis */
  color: var(--color-on-surface-variant, #cac4cf);
  line-height: 1.8;
  max-width: 750px;
  margin: 0 auto var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: var(--color-surface-container-low, #28262e);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-1);
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.particles-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1; /* Above main gradient, below hero text */
}

.particles-bg::before, .particles-bg::after {
  content: '';
  position: absolute;
  width: 300px; /* Size of the particle shapes */
  height: 300px;
  background: radial-gradient(circle, var(--color-primary-transparent-10, rgba(103, 58, 183, 0.05)) 0%, transparent 70%);
  border-radius: 50%;
  animation: floatParticle 30s infinite ease-in-out;
  opacity: 0.5;
}

.particles-bg::after {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, var(--color-secondary-transparent-10, rgba(0, 121, 107, 0.05)) 0%, transparent 70%);
  animation-delay: -15s; /* Offset animation */
  animation-duration: 35s;
  bottom: 10%;
  right: 5%;
}

.particles-bg::before {
  top: 15%;
  left: 10%;
}

@keyframes floatParticle {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
  25% { transform: translateY(-30px) translateX(20px) scale(1.1); }
  50% { transform: translateY(20px) translateX(-30px) scale(0.9); }
  75% { transform: translateY(-10px) translateX(10px) scale(1.05); }
}

.hero-section {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  color: var(--color-on-surface);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  position: relative; /* To ensure content is above particle background */
  z-index: 2; /* Ensure hero text is on top of all backgrounds */
}

.hero-section.visible {
  opacity: 1;
  transform: translateY(0);
}

.welcome-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem); /* Responsive font size */
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.tagline {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-on-surface-variant);
  max-width: 600px;
  margin-top: 0.75rem; /* Increased margin */
  margin-bottom: 2rem; /* Added margin for CTA */
  line-height: 1.6;
  opacity: 0;
  transform: translateY(15px);
  animation: fadeInTagline 0.8s ease-out 0.4s forwards; /* Delayed animation */
}

@keyframes fadeInTagline {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-cta-buttons {
  display: flex;
  gap: 1rem; /* Space between buttons */
  margin-top: 1.5rem; /* Adjust as needed from tagline */
  flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
  justify-content: center;
}

.cta-button {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  padding: 0.8rem 2rem;
  border-radius: 2rem; /* More rounded */
  border: none;
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  opacity: 0;
  transform: translateY(10px) scale(0.95);
  animation: fadeInCTA 0.7s ease-out 0.8s forwards; /* Adjusted timing */
}

.cta-button.primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}

.cta-button.primary:hover, .cta-button.primary:focus {
  background-color: var(--color-primary-dark, #5a369b);
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 7px 22px rgba(var(--color-primary-rgb, 103, 58, 183), 0.35);
}

.cta-button.secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.cta-button.secondary:hover, .cta-button.secondary:focus {
  background-color: var(--color-primary-transparent-10, rgba(103, 58, 183, 0.1));
  color: var(--color-primary-dark, #5a369b);
  border-color: var(--color-primary-dark, #5a369b);
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 7px 22px rgba(var(--color-primary-rgb, 103, 58, 183), 0.15);
}

.cta-button:hover, .cta-button:focus {
  background-color: var(--color-primary-dark, #5a369b); /* Define primary-dark or use a slightly darker primary */
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 20px rgba(var(--color-primary-rgb, 103, 58, 183), 0.3);
}

@keyframes fadeInCTA {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Basic styles for the hero section */
.gradient-text {
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-tertiary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
