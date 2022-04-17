<template>
  <div v-if="artist" class="artist-page">
    <div class="banner" :style="artist.artistBanner ? `--img: url('https://i.scdn.co/image/${artist.artistBanner}');` : ''"></div>
    <div class="icon-name-container">
      <div class="icon" :style="artist.artistImage ? `background-image: url('https://i.scdn.co/image/${artist.artistImage}');` : ''"></div>
      <div class="name-controls-container">
        <div class="name">
          <a class="name-text" target="_blank" :href="`https://open.spotify.com/artist/${artist.artistId}?referer=matchify.org`">
            <div class="gradient"></div>
            <div class="text">{{ artist.artistName }}</div>
          </a>
        </div>
        <div class="controls">
          <div class="like" v-if="userData.currentUser">
            <like-button :count="artist.artistTotalLikeCount" :state="likeState" @click="like"></like-button>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="lists">
          <div class="row">
            <item-list title="Listened Before">
              <UserListItem v-for="(user, i) in listenedBefore" :user="user" :show-count="true" :key="i"></UserListItem>
              <static-list-item>
                <vs-button size="xl" shadow color="dark" @click="loadMoreBefore" :loading="beforeLoading">Load More</vs-button>
              </static-list-item>
            </item-list>
            <item-list title="Current Listeners">
              <UserListItem v-for="(user, i) in artist.artistListeners" :user="user" :key="i"></UserListItem>
            </item-list>
          </div>
          <div class="row">
            <item-list title="Tracks">
              <TrackListItem v-for="(track, i) in tracks" :track="track" :key="i"></TrackListItem>
            </item-list>
            <item-list title="Albums">
              <AlbumListItem v-for="(album, i) in albums" :album="album" :key="i"></AlbumListItem>
            </item-list>
          </div>
        </div>
      </div>
      <div class="right">
        <RightSidebar type="artist" :information="artist" />
      </div>
    </div>
  </div>
</template>

<script>
import userData from "@/data/user";
import socket from "@/socket";
import LikeButton from "@/components/LikeButton";
import ItemList from "@/components/list/ItemList.vue";
import RightSidebar from "@/components/sidebar/RightSidebar.vue";

import StaticListItem from "@/components/list/StaticListItem.vue";
import { getUserAvatar } from "@/utils/getUserAvatar";
import UserListItem from "@/components/list/UserListItem.vue";
import TrackListItem from "@/components/list/TrackListItem.vue";
import AlbumListItem from "../components/list/AlbumListItem.vue";

export default {
  data() {
    return {
      userData,
      artist: null,
      artistId: null,
      likeState: false,
      listenedBefore: [],
      beforePage: 0,
      beforeLoading: false,
      tracks: [],
      albums: []
    }
  },
  props: {
    xArtistId: {
      type: String,
      required: false,
      default() {
        return null
      }
    }
  },
  methods: {
    getUserAvatar,
    like() {
      this.likeState = !this.likeState;
      this.artist.artistTotalLikeCount += this.likeState ? 1 : -1;
      socket.emit("artist:user:like:set", {artistId: this.artistId, state:this.likeState});
    },
    async loadMoreBefore() {
      this.beforeLoading = true;
      
      const PAGE_SIZE = 30;
      socket.emit("artist:get:before", {
        artistId: this.artistId,
        offset: (PAGE_SIZE*this.beforePage++),
        limit: PAGE_SIZE
      }, ({data})=>{
        this.beforeLoading = false;
        this.listenedBefore.push(...(data.filter(i=>!this.listenedBefore.some(j=>j.userId == i.userId))));
      })
    },
  },
  components: {
    LikeButton,
    ItemList,
    StaticListItem,
    RightSidebar,
    UserListItem,
    TrackListItem,
    AlbumListItem
},
  async created() {
    this.artistId = this.xArtistId || this.$route.params.artistId;

    this.loadMoreBefore();
    let notif = this.$vs.notification({ loading: true, color: "dark", duration: "none" });

    await userData.awaitCurrentUser();

    if (userData.currentUser) {
      socket.emit("artist:user:like:get", { artistId: this.artistId }, ({ data }) => {
        this.likeState = data;
      });
    }

    socket.emit("artist:get:tracks", { artistId: this.artistId }, (data) => {
      this.tracks = data.data.sort(
        (a, b) => b.trackTotalListenCount - a.trackTotalListenCount
      );
    });

    socket.emit("artist:get:albums", { artistId: this.artistId }, (data) => {
      this.albums = data.data.sort(
        (a, b) => b.albumTotalListenCount - a.albumTotalListenCount
      );
    });

    socket.on("artist:event", ({ data }) => {
      if (data.artistId != this.artistId) return;
      this.artist = data.artist;
      document.title = `${data.artist.artistName} - Matchify`;
      if (notif) {
        notif.close();
        notif = null;
      }
    });

    socket.emit("artist:subscribe", { artistId: this.artistId });

  },
  beforeDestroy() {
    socket.emit("artist:unsubscribe", { artistId: this.artistId });
  }
}
</script>

<style lang="scss" scoped>
.artist-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .banner {
    width: 100%;
    height: 250px;
    min-height: 250px;
    border-bottom-left-radius: 32px;
    background-position: center center;
    background-size: cover;
    background-image: linear-gradient(to top, #18191c, #18191c70), var(--img);
  }

  .icon-name-container {
    --icon-size: 200px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 32px;

    .icon {
      width: var(--icon-size);
      height: var(--icon-size);
      min-width: var(--icon-size);
      min-height: var(--icon-size);
      background-position: center center;
      background-size: cover;
      margin-top: calc(var(--icon-size) / 2 * -1);
      border-radius: calc(var(--icon-size) / 6);
    }

    .name-controls-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .name {
        margin-left: 32px;
        display: flex;
        align-items: flex-start;
        flex-direction: column;

        .name-text {
          --h: 60px;
          --w: 500px;
          height: var(--h);
          white-space: nowrap;
          overflow: hidden;
          position: relative;
          width: var(--w);
          font-weight: bold;
          font-size: 48px;
          letter-spacing: -0.03em;
          display: flex;

          &:hover .text {
            animation: marquee 5s linear infinite;
            padding-left: 100%;
          }

          .text {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
          }

          .gradient {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            pointer-events: none;
            height: var(--h);
            width: var(--w);
            background: linear-gradient(90deg, transparent 0%, transparent 75%, #18191c 100%);
          }

        }

      }

      .controls {
        display: flex;
        align-items: center;
      }
    }
  }

  .content {
    display: flex;
    flex-direction: row;
    padding-bottom: 32px;

    .left {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-top: 32px;
      padding: 0 32px;

      .lists {
        display: flex;
        flex-direction: column;

        .row {
          display: flex;
          margin-bottom: 16px;
          .item-list {
            width: 50%;
            &:first-child {
              margin-right: 16px;
            }
          }
        }
      }
    }

  }

  @media screen and (max-width: 1100px) {
    .icon-name-container {
      --icon-size: 175px;
      flex-direction: column;
      padding: 0px 0px;
      justify-content: center;

      .name-controls-container {
        margin-top: 8px;
        flex-direction: column;
        align-items: center;

        .name {
          margin-top: 16px;
          margin-left: 0px;

          .name-text {
            font-size: 32px;
            --w: calc(100vw - 200px);
            --h: 38px;

            .text {
              animation: marquee 10s linear infinite !important;
              padding-left: 100%;
            }

          }

          .artists {
            display: flex;
            justify-content: center;
            width: 100%;
          }
        }

        .controls {
          margin-top: 16px;
        }
      }

    }

    .content {
      flex-direction: column-reverse;

      .left {
        .lists {
          display: flex;
          flex-direction: column-reverse;

          .row {
            flex-direction: column;
            .item-list {
              width: 100%;
              &:first-child {
                margin-right: 0px;
              }
            }
          }
        }
      }
    }
  }
}
</style>