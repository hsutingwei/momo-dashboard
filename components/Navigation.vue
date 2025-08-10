<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">M</span>
            </div>
            <span class="text-xl font-bold text-gray-900">Momo Dashboard</span>
          </NuxtLink>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            to="/" 
            class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === '/' }"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink 
            to="/products" 
            class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === '/products' }"
          >
            Products
          </NuxtLink>
          <NuxtLink 
            to="/comments" 
            class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === '/comments' }"
          >
            Comments
          </NuxtLink>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-700 hover:text-primary-600 p-2 rounded-md"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
          <NuxtLink 
            to="/" 
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === '/', 'text-gray-700 hover:text-primary-600': $route.path !== '/' }"
            @click="mobileMenuOpen = false"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink 
            to="/products" 
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === '/products', 'text-gray-700 hover:text-primary-600': $route.path !== '/products' }"
            @click="mobileMenuOpen = false"
          >
            Products
          </NuxtLink>
          <NuxtLink 
            to="/comments" 
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === '/comments', 'text-gray-700 hover:text-primary-600': $route.path !== '/comments' }"
            @click="mobileMenuOpen = false"
          >
            Comments
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
</script> 