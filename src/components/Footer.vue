<template>
  <footer class="app-footer">
    <div class="container">
      <p>&copy; {{ new Date().getFullYear() }} inove.profile. All rights reserved.</p>
      <div class="footer-links">
        <!-- You can add actual routes later if needed -->
        <RouterLink to="#!" class="footer-link-item">Privacy Policy</RouterLink>
        <span class="footer-link-separator">|</span>
        <RouterLink to="#!" class="footer-link-item">Terms of Service</RouterLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.app-footer {
  background-color: var(--color-surface-container, #222028);
  color: var(--color-on-surface-variant, #cac4cf);
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
  border-top: 1px solid var(--color-outline-variant, #49454e);
  /* margin-top: auto; Ensures footer is at bottom if page content is short, 
     but for HomeView, we'll let the natural flow dictate its position after content sections. */
}

.app-footer .container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.app-footer p {
  margin: 0;
  font-size: var(--font-size-body-medium);
}

.footer-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.footer-link-item {
  color: var(--color-on-surface-variant, #cac4cf); /* Subtler color for links */
  text-decoration: none;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.footer-link-item:hover {
  color: var(--color-primary, #d0bcff);
  background-color: var(--color-primary-transparent-10, rgba(208, 188, 255, 0.1));
  text-decoration: none; /* Remove underline on hover for a cleaner button-like feel */
}

.footer-link-separator {
  color: var(--color-outline, #8f8a99);
}

/* Responsive adjustments if needed */
@media (min-width: 768px) {
  .app-footer .container {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
