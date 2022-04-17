<template>
  <router-link class="album-list-item list-item" :to="`/album/${album.albumId}`">
    <div class="icon-name-end">
      <div class="icon-name">
        <div class="icon" :style="`background-image: url('https://i.scdn.co/image/${album.albumArtwork}');`"></div>
        <div class="name-artists">
          <div class="name">{{ album.albumName }}</div>
          <div class="artists">
            <router-link class="artist" v-for="artist in album.albumArtists" :to="`/artist/${artist.id}`" :key="artist.id">{{ artist.name }}</router-link>
          </div>
        </div>
      </div>
      <div class="end-container">
        <div class="end">{{album.albumTotalListenCount}}</div>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    album: {
      type: Object,
      required: true
    },
  },
}
</script>

<style lang="scss" scoped>
.album-list-item {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  --icon-size: 44px;

  .icon-name-end {
    display: flex;
    width: 100%;

    .icon-name {
      display: flex;
      flex-direction: row;
      width: 100%;
      align-items: center;

      .icon {
        width: var(--icon-size);
        height: var(--icon-size);
        min-width: var(--icon-size);
        min-height: var(--icon-size);
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

          .artist {
            &:not(:last-child)::after {
              content: ", ";
            }
          }
        }
      }
    }

    .end-container {
      width: 100px;
      text-align: right;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 8px;
      font-size: 12px;
      opacity: 0.5;
    }
  }

}

@media screen and (max-width: 1100px) {

  .track-list-item {
    --icon-size: 32px;

    .icon-name-end {

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

}
</style>