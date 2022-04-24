<template>
  <div v-if="track" class="track-page">
    <div class="banner"></div>
    <div class="icon-name-container">
      <div class="icon" :style="`background-image: url('https://i.scdn.co/image/${track.trackAlbumArtwork}');`"></div>
      <div class="name-controls-container">
        <div class="name">
          <a class="name-text" target="_blank" :href="`https://open.spotify.com/track/${track.trackId}?referer=matchify.org`">
            <div class="gradient"></div>
            <div class="text">{{ track.trackName }}</div>
          </a>
          <div class="artists">
            <router-link class="artist" v-for="artist in track.trackArtists" :to="`/artist/${artist.id}`" :key="artist.id">
              {{ artist.name }}
            </router-link>
          </div>
        </div>
        <div class="controls">
          <div class="like" v-if="userData.currentUser">
            <like-button :count="track.trackTotalLikeCount" :state="likeState" @click="like"></like-button>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="lists">
          <item-list title="Listened Before">
            <UserListItem v-for="(user, i) in listenedBefore" :user="user" :show-count="true" :key="i"></UserListItem>
            <static-list-item v-if="listenedBefore.length >= 20">
              <vs-button size="xl" shadow color="dark" @click="loadMoreBefore" :loading="beforeLoading">Load More</vs-button>
            </static-list-item>
          </item-list>
          <item-list title="Current Listeners">
            <UserListItem v-for="(user, i) in track.trackListeners" :user="user" :key="i"></UserListItem>
          </item-list>
        </div>
        <Comments type="track" :id="trackId"></Comments>
      </div>
      <div class="right">
        <RightSidebar type="track" :information="track" />
      </div>
    </div>
  </div>
</template>

<script>
import userData from "@/data/user";
import socket from "@/socket";
import LikeButton from "@/components/LikeButton";
import ItemList from "@/components/list/ItemList.vue";
// import UserListItem from "@/components/list/UserListItem.vue";
import RightSidebar from "@/components/sidebar/RightSidebar.vue";

import StaticListItem from "@/components/list/StaticListItem.vue";
import { getUserAvatar } from "@/utils/getUserAvatar";
import UserListItem from "@/components/list/UserListItem.vue";
import Comments from "@/components/comment/Comments.vue";

export default {
  data() {
    return {
      userData,
      track: null,
      trackId: null,
      likeState: false,
      listenedBefore: [],
      beforePage: 0,
      beforeLoading: false
    }
  },
  props: {
    xTrackId: {
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
      this.track.trackTotalLikeCount += this.likeState ? 1 : -1;
      socket.emit("track:current-user:like:set", { trackId: this.trackId, state: this.likeState });
    },
    async loadMoreBefore() {
      const PAGE_SIZE = 30;
      this.beforeLoading = true;
      socket.emit("track:get:before", {
        trackId: this.trackId,
        offset: (PAGE_SIZE * this.beforePage++),
        limit: PAGE_SIZE
      }, ({ data }) => {
        this.beforeLoading = false;
        this.listenedBefore.push(...(data.filter(i => !this.listenedBefore.some(j => j.userId == i.userId))));
      })
    }
  },
  components: {
    LikeButton,
    ItemList,
    StaticListItem,
    RightSidebar,
    UserListItem,
    Comments
},
  async created() {
    this.trackId = this.xTrackId || this.$route.params.trackId;

    this.loadMoreBefore();
    let notif = this.$vs.notification({ loading: true, color: "dark", duration: "none" });

    await userData.awaitCurrentUser();

    if (userData.currentUser) {
      socket.emit("track:current-user:like:get", { trackId: this.trackId }, ({ data }) => {
        this.likeState = data;
      });
    }

    socket.on("track:event", ({ data }) => {
      if (data.trackId != this.trackId) return;
      this.track = data.track;
      document.title = `${data.track.trackName} - Matchify`;
      if (notif) {
        notif.close();
        notif = null;
      }
    });

    socket.emit("track:subscribe", { trackId: this.trackId });

  },
  beforeDestroy() {
    socket.emit("track:unsubscribe", { trackId: this.trackId });
  }
}
</script>

<style lang="scss" scoped>
.track-page {
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

        .artists {
          font-size: 18px;
          font-weight: 400;
          margin-left: 2px;
          opacity: 0.5;

          .artist {
            &:hover {
              text-decoration: underline;
            }

            &:not(:last-child) {
              margin-right: 2px;
            }

            &:not(:last-child)::after {
              content: ", ";
            }
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

        .item-list {
          &:first-child {
            margin-right: 16px;
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

          .item-list {
            &:first-child {
              margin-right: 0px;
            }
          }
        }
      }
    }
  }
}
</style>