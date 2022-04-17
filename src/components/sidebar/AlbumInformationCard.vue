<template>
  <div class="info-card">
    <div class="lines">
      <div class="line">
        <i class="ri-music-2-line"></i>
        <p>{{ album.albumTotalListenCount }} times listened</p>
      </div>
      <div class="line" v-if="album.albumListeners.length">
        <i class="ri-music-line"></i>
        <p>{{ album.albumListeners.length }} active listener</p>
      </div>
      <div class="line">
        <i class="ri-heart-3-line"></i>
        <p>{{ album.albumTotalLikeCount }} times liked</p>
      </div>
    </div>
    <div class="genres">
      <router-link v-for="genre in album.albumGenres" class="genre" :key="genre.name" :to="`/albums?q=genre:'${genre.name}'`">{{ toCapitalCase(genre.name.replaceAll("_", " ")) }}</router-link>
    </div>
  </div>
</template>
<script>
import { toCapitalCase } from "@/utils/toCapitalCase"

export default {
  props: {
    album: Object,
  },
  methods: {
    toCapitalCase
  }
}
</script>
