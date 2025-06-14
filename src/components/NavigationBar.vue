<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="container">
      <div class="navbar-content">
        <RouterLink to="/" class="navbar-logo">
          <span class="logo-text">inove.<span>profile</span></span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <div class="navbar-nav desktop-nav">
          <RouterLink 
            v-for="item in navItems" 
            :key="item.name"
            :to="item.path" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === item.path }"
          >
            {{ item.name }}
          </RouterLink>
        </div>

        <!-- Mobile Menu Button -->
        <button 
          class="mobile-menu-btn"
          @click="toggleMobileMenu"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Toggle navigation menu"
        >
          <span class="hamburger-line" :class="{ 'hamburger-line-active': isMobileMenuOpen }"></span>
          <span class="hamburger-line" :class="{ 'hamburger-line-active': isMobileMenuOpen }"></span>
          <span class="hamburger-line" :class="{ 'hamburger-line-active': isMobileMenuOpen }"></span>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div class="mobile-nav" :class="{ 'mobile-nav-open': isMobileMenuOpen }">
        <RouterLink 
          v-for="item in navItems" 
          :key="item.name"
          :to="item.path" 
          class="mobile-nav-link"
          @click="closeMobileMenu"
        >
          {{ item.name }}
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const navItems = [
  { name: 'Home', path: '/' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-outline-variant);
  transition: all var(--transition-normal);
}

.navbar-scrolled {
  background-color: rgba(18, 18, 18, 0.95);
  box-shadow: var(--shadow-2);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
}

.navbar-logo {
  text-decoration: none;
  color: var(--color-text);
  font-weight: 700;
  font-size: var(--font-size-title-large);
  transition: color var(--transition-fast);
}

.navbar-logo:hover {
  color: var(--color-primary);
}

.logo-text {
  color: white;
  font-family: var(--font-family);
  font-size: 2rem;
}

.logo-text span {
  font-weight: 200;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.nav-link {
  text-decoration: none;
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: var(--font-size-body-large);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  position: relative;
}

.nav-link:hover {
  color: var(--color-primary);
  background-color: rgba(103, 80, 164, 0.1);
}

.nav-link-active {
  color: var(--color-primary);
  background-color: rgba(103, 80, 164, 0.15);
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast);
}

.mobile-menu-btn:hover {
  background-color: rgba(103, 80, 164, 0.1);
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background-color: var(--color-text);
  margin: 2px 0;
  transition: all 0.3s ease;
  border-radius: 2px;
  transform-origin: center;
  position: relative;
}

.mobile-menu-btn {
  position: relative;
  width: 40px;
  height: 40px;
}

.hamburger-line-active {
  margin: -1px 0;
  position: absolute;
  top: 50%;
  left: 50%;
}

.hamburger-line-active:nth-child(1) {
  transform: translate(-50%, -50%) rotate(45deg);
}

.hamburger-line-active:nth-child(2) {
  opacity: 0;
  transform: translateX(20px);
}

.hamburger-line-active:nth-child(3) {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.mobile-nav {
  display: none;
  flex-direction: column;
  padding: 0;
  border-top: 1px solid transparent;
  margin-top: 0;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: all var(--transition-normal);
}

.mobile-nav-open {
  display: flex;
  padding: var(--spacing-lg) 0;
  border-top: 1px solid var(--color-outline-variant);
  margin-top: var(--spacing-md);
  max-height: 300px;
  opacity: 1;
}

.mobile-nav-link {
  text-decoration: none;
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: var(--font-size-body-large);
  padding: var(--spacing-md) 0;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}

.mobile-nav-link:hover {
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  /* Mobile nav is now controlled by mobile-nav-open class only */
}
</style>

