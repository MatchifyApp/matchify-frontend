<template>
  <div v-if="user" class="user-page">
    <div class="banner" :style="user.userBanner ? `--img: url('https://cdn.discordapp.com/banners/${user.userId}/${user.userBanner}.${user.userBanner.startsWith('a_') ? 'gif' : 'png'}?size=4096');` : ``"></div>
    <div class="icon-name-container">
      <div class="icon" :class="{'premium': user.userPremiumUntil > Date.now()}" :style="`background-image: url('${getUserAvatar(user)}?size=4096');`"></div>
      <div class="name-controls-container">
        <div class="name">
          <h3 class="name-text">
            <div class="gradient"></div>
            <div class="text">{{ user.userTag }}</div>
          </h3>
          <vs-tooltip color="dark" not-arrow>
            <a class="add-button" :href="`https://discord.com/users/${user.userId}?referer=matchify.org`" target="_blank">
              <div class="open">
                <div class="icon-container">
                  <svg viewBox="0 0 127.14 96.36">
                    <g>
                      <path style="fill:currentColor;" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </g>
                  </svg>
                  <i class="ri-search-line"></i>
                </div>
              </div>
            </a>
            <template #tooltip>
              Open <strong>{{ user.userTag }}</strong> on Discord!
            </template>
          </vs-tooltip>
        </div>
        <div class="controls">
          <div class="like" v-if="userData.currentUser">
            <like-button :state="likeState" :count="user.totalUsersLikedMe" @click="like"></like-button>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="lists">
          <div class="row">
            <item-list title="History">
              <track-list-item v-for="(track, i) in trackHistory" :track="track" :current-track="user.currentTrack" :show-progress="i === 0" :key="i"></track-list-item>
              <static-list-item v-if="trackHistory.length >= 20">
                <vs-button size="xl" shadow color="dark" @click="loadMoreHistory" :loading="historyLoading">Load More</vs-button>
              </static-list-item>
            </item-list>
            <item-list v-if="userData.isPremium" title="Guilds">
              <GuildMemberListItem v-for="(member, i) in guildUsers" :member="member" :key="i"></GuildMemberListItem>
            </item-list>
          </div>
        </div>
        <Comments type="user" :id="userId"></Comments>
      </div>
      <div class="right-side-bar">
        <RightSidebar type="user" :information="user" />
      </div>
    </div>
  </div>
</template>

<script>
import userData from "@/data/user";
import socket from "@/socket";
import LikeButton from "@/components/LikeButton";
import ItemList from "@/components/list/ItemList.vue";
import TrackListItem from "@/components/list/TrackListItem.vue";
import StaticListItem from "@/components/list/StaticListItem.vue";
import RightSidebar from "@/components/sidebar/RightSidebar.vue";
import { getUserAvatar } from "@/utils/getUserAvatar";
import GuildMemberListItem from "@/components/list/GuildMemberListItem.vue";
import Comments from "@/components/comment/Comments.vue";

export default {
  data() {
    return {
      userData,
      user: null,
      userId: null,
      bannerColor: "#000000",
      showMoreGenres: false,
      likeState: false,
      trackHistory: [],
      guildUsers: [],
      extraHistoryOffset: 0,
      historyPage: 0,
      historyLoading: false,
    }
  },
  props: {
    xUserId: {
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
      this.user.totalUsersLikedMe += this.likeState ? 1 : -1;
      socket.emit("user:current-user:like:set", { userId: this.userId, state: this.likeState });
    },
    async loadMoreHistory() {
      const PAGE_SIZE = 20;
      this.historyLoading = true;
      socket.emit("user:get:history", {
        userId: this.userId,
        offset: this.extraHistoryOffset + (PAGE_SIZE * this.historyPage++),
        limit: PAGE_SIZE
      }, ({ data }) => {
        this.historyLoading = false;
        this.trackHistory.push(...data);
      })
    },
  },
  computed: {
    genres() {
      return Object.entries(this.user?.genrePoints || {}).sort((a, b) => b[1] - a[1]).slice(0, this.showMoreGenres ? 64 : 8);
    },
  },
  components: {
    LikeButton,
    ItemList,
    TrackListItem,
    StaticListItem,
    RightSidebar,
    GuildMemberListItem,
    Comments
},
  async created() {
    this.userId = this.xUserId || this.$route.params.userId;

    let notif = this.$vs.notification({ loading: true, color: "dark", duration: "none" });

    await userData.awaitCurrentUser();
    this.loadMoreHistory();
    
    if (userData.currentUser) {
      socket.emit("user:current-user:like:get", { userId: this.userId }, ({ data }) => {
        this.likeState = data;
      });
      if (userData.isPremium) {
        socket.emit("user:get:guild-users", { userId: this.userId }, ({ data }) => {
          this.guildUsers = data;
        });
      }
    }

    if (userData.currentUser?.userId == this.userId) {
      this.$watch(() => userData.currentUser, (user) => {
        this.user = user;
        document.title = `${user.userTag} - Matchify`;
        if (user.currentTrack) {
          if (!this.trackHistory?.[0]?.trackId) return;
          if (user.currentTrack?.trackId != this.trackHistory?.[0]?.trackId) {
            this.trackHistory.unshift({
              trackId: user.currentTrack.trackId,
              trackAlbumArtwork: user.currentTrack.trackAlbumArtwork,
              trackName: user.currentTrack.trackName,
              trackArtists: user.currentTrack.trackArtists,
              trackAt: user.currentTrack.trackAt,
              trackDuration: user.currentTrack.trackDuration
            });
            this.extraHistoryOffset++;
          }
        }
        if (notif) {
          notif.close();
          notif = null;
        }
      });
    } else {
      socket.on("user:event", ({ data }) => {
        if (data.userId != this.userId) return;
        this.user = data.user;
        document.title = `${data.user.userTag} - Matchify`;
        if (data.user.currentTrack) {
          if (!this.trackHistory?.[0]?.trackId) return;
          if (data.user.currentTrack?.trackId != this.trackHistory?.[0]?.trackId) {
            this.trackHistory.unshift({
              trackId: data.user.currentTrack.trackId,
              trackAlbumArtwork: data.user.currentTrack.trackAlbumArtwork,
              trackName: data.user.currentTrack.trackName,
              trackArtists: data.user.currentTrack.trackArtists,
              trackAt: data.user.currentTrack.trackAt,
              trackDuration: data.user.currentTrack.trackDuration
            });
            this.extraHistoryOffset++;
          }
        }
        if (notif) {
          notif.close();
          notif = null;
        }
      });

      socket.emit("user:subscribe", { userId: this.userId });
    }

  },
  beforeDestroy() {
    if (userData.currentUser.userId != this.userId)
      socket.emit("user:unsubscribe", { userId: this.userId });
  }
}
</script>

<style lang="scss" scoped>
.user-page {
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

      &.premium {
        border: 4px solid gold;
        filter: drop-shadow(0px 0px 16px gold);
      }
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


        .open {
          margin-left: 8px;
          margin-top: -8px;
          cursor: pointer;
          opacity: 0.95;

          &:hover {
            transform: scale(1.05);
            opacity: 1;
          }

          &:active {
            transform: scale(0.95);
          }

          .icon-container {
            width: 32px;
            height: 32px;
            position: relative;
            filter: drop-shadow(0px 0px 6px black);

            svg {
              position: absolute;
              top: calc(50% + 1px);
              left: calc(50% - 4px);
              transform: translate(-50%, -50%);
              width: 50%;
              height: 50%;
              color: rgba(255, 255, 255, 1);
            }

            i {
              font-size: 38px;
              position: absolute;
              top: 0;
              right: 0;
              color: rgba(255, 255, 255, 1);
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
        flex-direction: column;

        .row {
          display: flex;
          margin-bottom: 16px;
          .item-list {
            width: 100%;
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