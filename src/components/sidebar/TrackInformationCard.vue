<template>
  <div class="info-card">
    <div class="lines">
      <div class="line">
        <i class="ri-music-2-line"></i>
        <p>{{ track.trackTotalListenCount }} times listened</p>
      </div>
      <div class="line" v-if="track.trackListeners.length">
        <i class="ri-music-line"></i>
        <p>{{ track.trackListeners.length }} active listener</p>
      </div>
      <div class="line">
        <i class="ri-heart-3-line"></i>
        <p>{{ track.trackTotalLikeCount }} times liked</p>
      </div>
    </div>
    <div class="genres">
      <router-link v-for="genre in track.trackGenres" class="genre" :key="genre.name" :to="`/tracks?q=genre:'${genre.name}'`">{{ toCapitalCase(genre.name.replaceAll("_", " ")) }}</router-link>
    </div>
  </div>
</template>
<script>
import { toCapitalCase } from "@/utils/toCapitalCase"

export default {
  props: {
    track: Object,
  },
  methods: {
    toCapitalCase
  }
}
</script>
