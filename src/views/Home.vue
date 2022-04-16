<template>
  <div class="home">
    <div class="title-container">
      <h1 class="title">Popular Tracks</h1>
    </div>
    <div class="items">
      <router-link v-for="track in tracks" :key="track.trackId" class="item" :to="`/track/${track.trackId}`">
        <vs-card>
          <template #title>
            <div class="title">
              <div class="name">
                <div class="text">
                  <span>{{ track.trackName }}</span>
                </div>
              </div>
            </div>
          </template>
          <template #img>
            <div class="img" :style="`background-image: url('https://i.scdn.co/image/${track.trackAlbumArtwork}');`"></div>
          </template>
          <template #text>
            <div class="description">
              <p class="half-opacity" style="padding-bottom: 5px;">
                <router-link class="artist" :to="`/artist/${track.trackArtists[0].id}`">{{ track.trackArtists[0].name }}</router-link>
              </p>
              <vs-avatar-group max="3" style="justify-content: flex-end; height: 32px;">
                <vs-avatar v-for="user in track.trackSampleListeners" :key="user.userId" size="36" :title="user.userTag">
                  <img :src="`https://cdn.discordapp.com/avatars/${user.userId}/${user.userAvatar}.png?size=1024`">
                </vs-avatar>
              </vs-avatar-group>
            </div>
          </template>
          <template #interactions>
            <vs-button shadow primary>
              <i class="ri-group-line"></i>
              <span style="padding-left: 8px;">
                {{ track.trackListenerCount }}
              </span>
            </vs-button>
            <vs-button shadow primary>
              <i class="ri-music-line"></i>
              <span style="padding-left: 8px;">
                {{ track.trackTotalListenCount }}
              </span>
            </vs-button>
          </template>
        </vs-card>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {

  .title-container {
    width: 100%;
    padding: 16px 8px;
    
  }

  @media screen and (max-width: 1100px) {
    .title-container {
      text-align: center;
    }

  }

  .items {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;

    .item {
      padding: 8px;
      --card-width: 200px;
      width: 200px;

      .img {
        width: 200px;
        height: 200px;
        background-size: cover;
        background-position: center;
      }

      .artist {
        &:hover {
          text-decoration: underline;
        }
      }

      .title {
        .name {
          --name-height: 26px;
          position: relative;
          width: calc(var(--card-width) - var(--card-spacing));
          word-break: none;
          overflow: hidden;
          white-space: nowrap;
          height: var(--name-height);

          .text {
            z-index: 0;
            width: calc(var(--card-width) - var(--card-spacing));
            position: absolute;
            left: 0;
            top: 0;
            font-size: 18px;
            font-weight: 800;

            &:hover span {
              display: inline-block;
              padding-left: 100%;
              animation: marquee 5s linear infinite;
            }
          }
        }
      }
    }
  }
}
</style>

<script>
import socket from "@/socket";
import _ from "lodash";

export default {
  data() {
    return {
      tracks: []
    }
  },
  created() {
    document.title = "Home - Matchify";
    let notif = this.$vs.notification({ loading: true, color: "dark" });

    socket.on("loops:popularTracks", ({ data }) => {
      this.tracks = data.map(i => ({ ...i, trackSampleListeners: _.shuffle(i.trackListeners), trackListeners: undefined }));
      if (notif) {
        notif.close();
        notif = null;
      }
    });
    socket.emit("loops:subscribe", { loop: "popularTracks" });
  },
  beforeDestroy() {
    socket.emit("loops:unsubscribe", { loop: "popularTracks" });
  }
}
</script>
