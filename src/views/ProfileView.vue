<template>
  <div class="profile-view-wrapper">
    <NavBar />
    <main class="profile-main-content">
      <div class="profile-card">
        <h1 class="profile-title">Manage Your Profile</h1>

        <div v-if="isLoading" class="status-message loading-message">
          <div class="loader"></div>
          <p>Loading your profile...</p>
        </div>
        <div v-else-if="error && !profile" class="status-message error-container">
          <p>{{ error }}</p>
        </div>

        <div v-else-if="profile" class="profile-form-container">
          <form @submit.prevent="handleProfileUpdate" class="profile-form">
            <!-- Profile Edit Form Fields -->
            <div class="avatar-section">
              <img 
                :src="editableProfile.avatar_url || defaultAvatar" 
                alt="User Avatar" 
                class="profile-avatar-preview"
                @error="onAvatarError"
              />
              <div class="form-group avatar-url-group">
                <label for="avatarUrl" class="form-label">Avatar URL</label>
                <input 
                  type="url" 
                  id="avatarUrl" 
                  v-model="editableProfile.avatar_url" 
                  placeholder="https://example.com/avatar.png"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="username" class="form-label">Username</label>
                <input type="text" id="username" v-model="editableProfile.username" placeholder="your_cool_username" class="form-input"/>
                <small class="input-hint">This will be part of your public profile URL.</small>
              </div>
              <div class="form-group">
                <label for="fullName" class="form-label">Full Name</label>
                <input type="text" id="fullName" v-model="editableProfile.full_name" placeholder="Ada Lovelace" class="form-input"/>
              </div>
            </div>

            <div class="form-group">
              <label for="bio" class="form-label">Bio</label>
              <textarea id="bio" v-model="editableProfile.bio" rows="4" placeholder="Tell the world about your amazing work and passions..." class="form-input form-textarea"></textarea>
            </div>

            <div class="form-group">
              <label for="websiteUrl" class="form-label">Website URL</label>
              <input type="url" id="websiteUrl" v-model="editableProfile.website_url" placeholder="https://your-portfolio.com" class="form-input"/>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="button-primary save-button" :disabled="isSaving">
                <span v-if="isSaving" class="button-loader"></span>
                {{ isSaving ? 'Saving...' : 'Save Profile' }}
              </button>
              <p v-if="saveStatusMessage" 
                 :class="['save-status', saveError ? 'error-text' : 'success-text']"
                 aria-live="polite"
              >
                {{ saveStatusMessage }}
              </p>
            </div>
          </form>

          <!-- Your Portfolios Section Placeholder -->
          <div class="portfolios-section">
            <h2 class="section-title">Your Portfolios</h2>
            <div class="placeholder-content">
              <p>This is where your portfolio items or links will be displayed.</p>
              <p>Functionality to add and manage portfolios will be implemented soon!</p>
            </div>
          </div>
          <!-- End Your Portfolios Section Placeholder -->

        </div>
        
        <div v-else-if="!isLoading && !profile && currentUser" class="status-message create-profile-prompt">
          <p>No profile found. Let's create one!</p>
          <button @click="initializeEmptyProfile" class="button-secondary create-button">
            Create Your Profile
          </button>
        </div>

      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import type { User, PostgrestError } from '@supabase/supabase-js';
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/Footer.vue';

// Default placeholder avatar (consider hosting this or using a generic one)
const defaultAvatar = ref('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2NjY2NjYyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMCAyMWMwLTEuMS0uOS0yLTItMmgtMTRjLTEuMSAwLTItLjktMi0ydi0xNGMwLTEuMS45LTItMi0yaDE0YzEuMSAwIDIgLjkgMiAyeiIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iOSIgcj0iMyIvPjxwYXRoIGQ9Ik02LjU1IDE3LjVjMCAuMy4xLjUuMy44LjIuMy40LjQuNy40aDQuNWMuMyAwIC41LS4xLjctLjQuMi0uMy4zLS41LjMtLjh2LTEuNWMwLS4zLS4xLS41LS4zLS44LS4yLS4zLS40LS40LS43LS40aC00LjVjLS4zIDAtLjUuMS0uNy40LS4yLjMtLjMuNS0uMy44djEuNXoiLz48L3N2Zz4=');

const onAvatarError = (event: Event) => {
  (event.target as HTMLImageElement).src = defaultAvatar.value;
};

interface Profile {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  website_url?: string | null;
  updated_at?: string | null;
}

const currentUser = ref<User | null>(null);
const profile = ref<Profile | null>(null);
const editableProfile = reactive<Partial<Profile>>({});

const isLoading = ref(true);
const error = ref<string | null>(null);
const isSaving = ref(false);
const saveStatusMessage = ref<string | null>(null);
const saveError = ref(false);

const fetchProfile = async (userId: string) => {
  isLoading.value = true;
  error.value = null;
  try {
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }
    if (data) {
      profile.value = data;
      Object.assign(editableProfile, data);
    } else {
      profile.value = null; 
    }
  } catch (err) {
    const e = err as PostgrestError | Error;
    console.error('Error fetching profile:', e.message);
    error.value = 'Failed to load profile data. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

const initializeEmptyProfile = () => {
  if (!currentUser.value) return;
  const newProfileShell: Profile = {
    id: currentUser.value.id,
    username: '',
    full_name: '',
    bio: '',
    avatar_url: '',
    website_url: '',
  };
  profile.value = { ...newProfileShell }; // Set profile to a non-null object to trigger form display
  Object.assign(editableProfile, newProfileShell);
  error.value = null;
  saveStatusMessage.value = null;
};

const handleProfileUpdate = async () => {
  if (!currentUser.value) {
    saveStatusMessage.value = 'Authentication error. Please log in again.';
    saveError.value = true;
    return;
  }

  isSaving.value = true;
  saveStatusMessage.value = null;
  saveError.value = false;

  const profileDataToSave: Omit<Profile, 'updated_at'> & { updated_at?: string } = {
    id: currentUser.value.id,
    username: editableProfile.username || null,
    full_name: editableProfile.full_name || null,
    bio: editableProfile.bio || null,
    avatar_url: editableProfile.avatar_url || null,
    website_url: editableProfile.website_url || null,
  };
  
  profileDataToSave.updated_at = new Date().toISOString();

  try {
    const { data, error: upsertError } = await supabase
      .from('profiles')
      .upsert(profileDataToSave, { onConflict: 'id' })
      .select()
      .single();

    if (upsertError) throw upsertError;

    if (data) {
      profile.value = data;
      Object.assign(editableProfile, data);
      saveStatusMessage.value = 'Profile updated successfully!';
      saveError.value = false;
    }
  } catch (err) {
    const e = err as PostgrestError | Error;
    console.error('Error saving profile:', e.message);
    saveStatusMessage.value = `Save failed: ${e.message.substring(0, 100)}`;
    saveError.value = true;
  } finally {
    isSaving.value = false;
    setTimeout(() => { saveStatusMessage.value = null; }, 5000);
  }
};

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    currentUser.value = session.user;
    await fetchProfile(session.user.id);
  } else {
    error.value = 'Please log in to manage your profile.';
    isLoading.value = false;
  }

  supabase.auth.onAuthStateChange((_event, newSession) => {
    if (newSession?.user && newSession.user.id !== currentUser.value?.id) {
      currentUser.value = newSession.user;
      fetchProfile(newSession.user.id);
    } else if (!newSession?.user) {
      currentUser.value = null;
      profile.value = null;
      Object.keys(editableProfile).forEach(key => delete editableProfile[key as keyof Profile]);
      error.value = 'You have been logged out. Please log in.';
      isLoading.value = false; // Ensure loading state is reset
    }
  });
});

watch(profile, (newProfileData) => {
  if (newProfileData) {
    Object.assign(editableProfile, newProfileData);
  }
}, { deep: true });

</script>

<style scoped>
.profile-view-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-background-gradient, linear-gradient(135deg, var(--color-surface-container-lowest, #1f1d2b), var(--color-surface-container-low, #272537)));
  background-size: 400% 400%;
  background-size: 400% 400%;
  animation: subtleGradientBG 25s ease infinite;
  will-change: background-position; /* Hint for browser optimization */
}

@keyframes subtleGradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.profile-main-content {
  flex-grow: 1;
  display: flex;
  align-items: center; /* Center card vertically */
  justify-content: center; /* Center card horizontally */
  padding: calc(var(--navbar-height, 60px) + var(--spacing-lg)) var(--spacing-md) var(--spacing-xl);
}

.profile-card {
  width: 100%;
  max-width: 750px; /* Slightly wider for more content */
  padding: var(--spacing-xxl) var(--spacing-xxl); /* Increased padding */
  background-color: var(--color-surface, #1a1825);
  border-radius: var(--radius-xl, 20px);
  box-shadow: var(--shadow-4, 0 8px 30px rgba(0,0,0,0.25));
  animation: fadeInScaleUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}

@keyframes fadeInScaleUp {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.profile-title {
  font-size: var(--font-size-headline-medium, 2.15rem); /* Slightly larger */
  color: var(--color-primary, #d0bcff);
  text-align: center;
  margin-bottom: var(--spacing-xxl);
  font-weight: 700; /* Bolder */
  letter-spacing: 0.5px; /* Added letter spacing */
  text-shadow: 0 1px 3px rgba(0,0,0,0.2); /* Subtle text shadow */
}

.status-message {
  text-align: center;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
  color: var(--color-on-surface-variant, #cac4cf);
}

.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-title-medium);
}

.error-container {
  background-color: var(--color-error-container-transparent, #5c191980);
  color: var(--color-on-error-container, #ffdad6);
  border: 1px solid var(--color-error, #f2b8b5);
}

.profile-form-container {
  padding: 0 var(--spacing-lg); /* Add horizontal padding to prevent content touching edges */
  animation: slideInUp 0.5s ease-out;
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  gap: var(--spacing-md);
}

.profile-avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-primary-container, #4f378b);
  box-shadow: var(--shadow-2);
  background-color: var(--color-surface-container-high); /* Placeholder bg */
}

.avatar-url-group {
  width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
}

@media (min-width: 600px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
  .avatar-section {
    flex-direction: row;
    align-items: flex-end;
    gap: var(--spacing-lg);
  }
  .profile-avatar-preview {
    width: 100px;
    height: 100px;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm); /* Slightly more gap for label and input */
  margin-bottom: var(--spacing-lg_plus_sm); /* Increased bottom margin */
}

.form-label {
  font-size: var(--font-size-label-large, 0.95rem);
  color: var(--color-on-surface-variant, #cac4cf);
  font-weight: 500;
}

.form-input, .form-textarea {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--color-surface-container-high, #2c2a3a);
  color: var(--color-on-surface, #e6e1e5);
  border: 1px solid var(--color-outline, #454257);
  border-radius: var(--radius-md, 8px);
  font-size: var(--font-size-body-large, 1rem);
  transition: all 0.2s ease-in-out;
}

.form-input::placeholder, .form-textarea::placeholder {
  color: var(--color-on-surface-variant-translucent, #cac4cf80);
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--color-primary, #d0bcff);
  box-shadow: 0 0 0 2px var(--color-primary-transparent-20, #d0bcff33);
  background-color: var(--color-surface-container-highest, #383549);
}

.input-hint {
  font-size: var(--font-size-body-small, 0.75rem);
  color: var(--color-on-surface-variant, #b0aac0);
  padding-left: var(--spacing-xs);
}

.form-actions {
  margin-top: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.button-primary, .button-secondary {
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-full);
  font-size: var(--font-size-label-large, 1rem);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  border: none;
  min-width: 200px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.button-primary {
  background-color: var(--color-primary, #d0bcff);
  color: var(--color-on-primary, #381e72);
  box-shadow: var(--shadow-1);
}

.button-primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark, #b59ff5);
  transform: translateY(-2px);
  box-shadow: var(--shadow-2);
}

.button-primary:disabled {
  background-color: var(--color-surface-variant, #49454F);
  color: var(--color-on-surface-variant, #CAC4CF);
  cursor: not-allowed;
  box-shadow: none;
}

.button-secondary {
  background-color: var(--color-secondary-container, #4a4458);
  color: var(--color-on-secondary-container, #e8def8);
}

.button-secondary:hover {
  background-color: var(--color-secondary-container-hover, #5e5870);
  transform: translateY(-2px);
}

.save-status {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-body-medium);
  font-weight: 500;
}

.success-text {
  color: var(--color-tertiary, #79d87d);
}

.error-text {
  color: var(--color-error, #f2b8b5);
}

.create-profile-prompt {
  background-color: var(--color-surface-container-high, #2c2a3a);
  border: 1px dashed var(--color-outline-variant, #6b667d);
}

.create-profile-prompt p {
  margin-bottom: var(--spacing-md);
}

.loader {
  width: 24px;
  height: 24px;
  border: 3px solid var(--color-primary-transparent-40, #d0bcff66);
  border-bottom-color: var(--color-primary, #d0bcff);
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

.button-loader {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-on-primary-transparent, #ffffff80);
  border-bottom-color: var(--color-on-primary, #381e72);
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 0.8s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Styles for Portfolios Section */
.portfolios-section {
  margin-top: var(--spacing-xxl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-outline-variant, #454257);
}

.section-title {
  font-size: var(--font-size-headline-small, 1.75rem);
  color: var(--color-on-surface, #e6e1e5);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.placeholder-content {
  background-color: var(--color-surface-container, #222028);
  padding: var(--spacing-lg) var(--spacing-xl);
  border-radius: var(--radius-md);
  text-align: center;
  color: var(--color-on-surface-variant, #cac4cf);
  font-size: var(--font-size-body-large);
  border: 1px dashed var(--color-outline, #8f8a99);
}

.placeholder-content p {
  margin-bottom: var(--spacing-sm);
}

.placeholder-content p:last-child {
  margin-bottom: 0;
}

/* Custom spacing variable (if not already defined globally) */
:root {
  --spacing-lg_plus_sm: calc(var(--spacing-lg) + var(--spacing-sm)); /* Example: 24px + 8px = 32px */
}

</style>
