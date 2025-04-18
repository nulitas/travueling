<template>
  <section class="relative w-full min-h-screen flex items-center bg-black">
    <div class="absolute inset-0 bg-gradient-to-b from-black to-gray-900 opacity-75"></div>
    <div class="relative w-full z-10">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div class="text-center lg:text-left">
            <div class="max-w-xl mx-auto lg:mx-0">
              <h2 class="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                Discover Your Traveling
              </h2>

              <p class="mt-4 text-gray-300 text-lg md:text-xl">
                One Piece is real and you can visit it. Plan your trip to the world of One Piece and
                experience the adventure of a lifetime.
              </p>

              <div class="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                <router-link
                  to="/login"
                  class="inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-300"
                >
                  Plan Your Trip
                </router-link>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 lg:mt-0">
            <div class="aspect-w-16 aspect-h-9 sm:aspect-w-1 sm:aspect-h-1">
              <img
                alt="Wall Maria"
                src="https://i.imgur.com/rSFLJj9.jpg"
                class="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
            <div class="aspect-w-16 aspect-h-9 sm:aspect-w-1 sm:aspect-h-1">
              <img
                alt="Wano"
                src="https://m.media-amazon.com/images/I/81HMb7ZvghS._AC_UF1000,1000_QL80_.jpg"
                class="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'HeroPage',
}
</script>
