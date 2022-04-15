<template>
  <div class="track-list-item">
    <div class="icon" :style="`background-image: url('https://i.scdn.co/image/${track.trackAlbumArtwork}');`"></div>
    <div class="name-artists">
      <div class="name">{{track.trackName}}</div>
      <div class="artists">
        <router-link class="artist" v-for="artist in track.trackArtists" :to="`/artist/${artist.id}`" :key="artist.id">{{artist.name}}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    track: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
.track-list-item {
  display: flex;
  flex-direction: column;
}
</style>