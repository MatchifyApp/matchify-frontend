<template>
  <div class="info-card">
    <div class="lines">
      <div class="line">
        <i class="ri-music-2-line"></i>
        <p>{{ artist.artistTotalListenCount }} times listened</p>
      </div>
      <div class="line" v-if="artist.artistListeners.length">
        <i class="ri-music-line"></i>
        <p>{{ artist.artistListeners.length }} active listener</p>
      </div>
      <div class="line">
        <i class="ri-heart-3-line"></i>
        <p>{{ artist.artistTotalLikeCount }} times liked</p>
      </div>
    </div>
    <div class="genres">
      <router-link v-for="genre in artist.artistGenres" class="genre" :key="genre" :to="`/artists?q=genre:'${genre}'`">{{toCapitalCase(genre.replaceAll("_", " "))}}</router-link>
    </div>
  </div>
</template>

<script>
import { toCapitalCase } from "@/utils/toCapitalCase"

export default {
  props: {
    artist: Object,
  },
  methods: {
    toCapitalCase
  }
}
</script>