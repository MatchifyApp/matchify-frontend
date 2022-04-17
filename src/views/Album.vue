<template>
  <div v-if="album" class="album-page">
    <div class="banner"></div>
    <div class="icon-name-container">
      <div class="icon" :style="`background-image: url('https://i.scdn.co/image/${album.albumArtwork}?size=4096');`"></div>
      <div class="name-controls-container">
        <div class="name-artists">
          <h3 class="name-text">
            <div class="gradient"></div>
            <div class="text">{{ album.albumName }}</div>
          </h3>
          <div class="artists">
            <router-link class="artist" v-for="artist in album.albumArtists" :to="`/artist/${artist.id}`" :key="artist.id">
              {{ artist.name }}
            </router-link>
          </div>
        </div>
        <div class="controls">
          <div class="like" v-if="userData.currentUser">
            <like-button :state="likeState" :count="album.albumTotalLikeCount" @click="like"></like-button>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="lists">
          <item-list title="Listened Before">
            <UserListItem v-for="(user, i) in listenedBefore" :user="user" :show-count="true" :key="i"></UserListItem>
            <static-list-item>
              <vs-button size="xl" shadow color="dark" @click="loadMoreBefore" :loading="beforeLoading">Load More</vs-button>
            </static-list-item>
          </item-list>
          <item-list title="Current Listeners">
            <UserListItem v-for="(user, i) in album.albumListeners" :user="user" :key="i"></UserListItem>
          </item-list>
        </div>
      </div>
      <div class="right-side-bar">
        <RightSidebar type="album" :information="album" />
      </div>
    </div>
  </div>
</template>

<script>
import userData from "@/data/user";
import socket from "@/socket";
import LikeButton from "@/components/LikeButton";
import ItemList from "@/components/list/ItemList.vue";
import StaticListItem from "@/components/list/StaticListItem.vue";
import RightSidebar from "@/components/sidebar/RightSidebar.vue";
import { getUserAvatar } from "@/utils/getUserAvatar";
import UserListItem from "@/components/list/UserListItem.vue";

export default {
  data() {
    return {
      userData,
      album: null,
      albumId: null,
      likeState: false,
      listenedBefore: [],
      beforePage: 0,
      beforeLoading: false
    }
  },
  props: {
    xAlbumId: {
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
      this.album.albumTotalLikeCount += this.likeState ? 1 : -1;
      socket.emit("album:user:like:set", { albumId: this.albumId, state: this.likeState });
    },
    async loadMoreBefore() {
      this.beforeLoading = true;
      const PAGE_SIZE = 30;
      socket.emit("album:get:before", {
        albumId: this.albumId,
        offset: (PAGE_SIZE * this.beforePage++),
        limit: PAGE_SIZE
      }, ({ data }) => {
        this.beforeLoading = false;
        this.listenedBefore.push(...(data.filter(i => !this.listenedBefore.some(j => j.userId == i.userId))));
      })
    }
  },
  computed: {
    genres() {
      return Object.entries(this.user?.genrePoints || {}).sort((a, b) => b[1] - a[1]).slice(0, this.showMoreGenres ? 64 : 8);
    },
  },
  components: {
    LikeButton,
    ItemList,
    StaticListItem,
    RightSidebar,
    UserListItem
},
  async created() {
    this.albumId = this.xAlbumId || this.$route.params.albumId;

    let notif = this.$vs.notification({ loading: true, color: "dark", duration: "none" });

    await userData.awaitCurrentUser();
    this.loadMoreBefore();
    if (userData.currentUser) {
      socket.emit("album:album:like:get", { albumId: this.albumId }, ({ data }) => {
        this.likeState = data;
      });
    }

    socket.on("album:event", ({ data }) => {
      if (data.albumId != this.albumId) return;
      this.album = data.album;
      document.title = `${data.album.albumName} - Matchify`;
      if (notif) {
        notif.close();
        notif = null;
      }
    });

    socket.emit("album:subscribe", { albumId: this.albumId });

  },
  beforeDestroy() {
      socket.emit("album:unsubscribe", { albumId: this.albumId });
  }
}
</script>

<style lang="scss" scoped>
.album-page {
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

      .name-artists {
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