<template>
  <router-link class="track-list-item list-item" :to="`/track/${track.trackId}`">
    <div class="icon" :style="`background-image: url('https://i.scdn.co/image/${track.trackAlbumArtwork}');`"></div>
    <div class="name-artists">
      <div class="name">{{ track.trackName }}</div>
      <div class="artists">
        <router-link class="artist" v-for="artist in track.trackArtists" :to="`/artist/${artist.id}`" :key="artist.id">{{ artist.name }}</router-link>
      </div>
    </div>
  </router-link>
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

<style lang="scss" scoped>
.track-list-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 0;

  .icon {
    width: 44px;
    height: 44px;
    min-width: 44px;
    min-height: 44px;
    background-position: center;
    background-size: cover;
    border-radius: 4px;
    margin-right: 8px;
  }

  .name-artists {
    .name {
      opacity: 0.9;
      font-weight: 600;
      font-size: 22px;
    }

    .artists {
      font-size: 14px;
      opacity: 0.5;
    }
  }

  @media screen and (max-width: 1100px) {
    .icon {
      width: 32px;
      height: 32px;
      min-width: 32px;
      min-height: 32px;
    }

    .name-artists {
      .name {
        font-size: 16px;
      }

      .artists {
        font-size: 12px;
      }
    }
  }
}
</style>