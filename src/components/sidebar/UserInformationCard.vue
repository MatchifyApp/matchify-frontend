<template>
  <div class="info-card">
    <div class="lines">
      <div class="line" v-if="user.currentTrack">
        <i class="ri-album-fill breath"></i>
        <p>
          <router-link :to="`/track/${user.currentTrack.trackId}`">{{ user.currentTrack.trackTitle }}</router-link>
        </p>
      </div>
      <div class="line">
        <i class="ri-music-2-line"></i>
        <p>{{ user.totalListenCount }} songs listened</p>
      </div>
      <div class="line">
        <i class="ri-heart-3-line"></i>
        <p>{{ user.totalUsersLikedMe }} likes</p>
      </div>
    </div>
    <div class="genres">
      <router-link v-for="genre in genres" class="genre" :key="genre[0]" :to="`/users?q=genre:'${genre[0]}>${genre[1]}'`">
        <span class="name">{{ toCapitalCase(genre[0].replaceAll("_", " ")) }}</span>
        <div class="amount">{{ genre[1] }}</div>
      </router-link>
      <div class="genre static" @click="showMoreGenres = !showMoreGenres">
        <div class="name">{{ showMoreGenres ? "Less" : "More" }}..</div>
      </div>
    </div>
  </div>
</template>
<script>
import { toCapitalCase } from "@/utils/toCapitalCase"

export default {
  props: {
    user: Object,
  },
  methods: {
    toCapitalCase
  },
  data() {
    return {
      showMoreGenres: false
    }
  },
  computed: {
    genres() {
      return Object.entries(this.user?.genrePoints || {}).sort((a, b) => b[1] - a[1]).slice(0, this.showMoreGenres ? 64 : 8);
    },
  },
}
</script>