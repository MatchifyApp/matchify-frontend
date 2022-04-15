<template>
  <div v-if="user" class="user-page">
    <div class="banner" :style="`--img: ${user.userBanner ? `url('https://cdn.discordapp.com/banners/${user.userId}/${user.userBanner}.${user.userBanner.startsWith('a_') ? 'gif' : 'png'}?size=4096');` : `${bannerColor}`}`"></div>
    <div class="icon-name-container">
      <div class="icon" :style="`background-image: url('https://cdn.discordapp.com/avatars/${user.userId}/${user.userAvatar}.${user.userAvatar.startsWith('a_') ? 'gif' : 'png'}?size=4096');`"></div>
      <div class="name-like-container">
        <h3 class="name">{{ user.userTag }}</h3>
        <div class="like" v-if="userData.currentUser">
          <like-button :state="likeState" :count="user.totalUsersLikedMe" @click="like"></like-button>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        
        <div class="lists">
          <item-list title="History">
            <track-list-item v-for="track in trackHistory" :track="track" :key="track.trackId"></track-list-item>
          </item-list>
        </div>
      </div>
      <div class="right">
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
              <div class="name">{{showMoreGenres ? "Less" : "More"}}..</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userData from "@/data/user";
import socket from "@/socket";
import LikeButton from "@/components/LikeButton";
import { toCapitalCase } from "@/utils/toCapitalCase";
import ItemList from "@/components/list/ItemList.vue";
import TrackListItem from "@/components/list/TrackListItem.vue";

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
      extraOffset: 0,
      historyPage: 1
    }
  },
  methods: {
    toCapitalCase,
    like() {
      this.likeState = !this.likeState;
      this.user.totalUsersLikedMe += this.likeState ? 1 : -1;
      socket.emit("user:user:like:set", {userId: this.userId, state:this.likeState});
    },
    async loadMoreHistory() {
      const PAGE_SIZE = 20;
      socket.emit("user:get:history", {
        userId: this.userId,
        offset: this.extraOffset+(PAGE_SIZE*this.historyPage++),
        limit: PAGE_SIZE
      }, ({data})=>{
        this.trackHistory.push(...data);
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
    TrackListItem
  },
  async created() {
    this.userId = this.$route.params.userId;

    await userData.awaitCurrentUser();
    this.loadMoreHistory();
    if (userData.currentUser) {
      socket.emit("user:user:like:get", {userId: this.userId}, ({data})=>{
        this.likeState = data;
      });
    }

    if (userData.currentUser?.userId == this.userId) {
      this.$watch(()=>userData.currentUser, (user)=>{
        this.user = user;
        if (user.currentTrack) {
          if (!this.trackHistory?.[0]?.trackId) return;
          if (user.currentTrack?.trackId != this.trackHistory?.[0]?.trackId) {
              this.trackHistory.unshift({
                trackId: user.currentTrack.trackId,
                trackAlbumArtwork: user.currentTrack.trackAlbumArtwork,
                trackName: user.currentTrack.trackName,
                trackArtists: user.currentTrack.trackArtists,
                trackAt: user.currentTrack.trackAt,
              });
              this.extraOffset++;
            }
        }
      });
    } else {
      socket.on("user:event", ({ data }) => {
        this.user = data.user;
        if (data.user.currentTrack) {
          if (!this.trackHistory?.[0]?.trackId) return;
          if (data.user.currentTrack?.trackId != this.trackHistory?.[0]?.trackId) {
              this.trackHistory.unshift({
                trackId: data.user.currentTrack.trackId,
                trackAlbumArtwork: data.user.currentTrack.trackAlbumArtwork,
                trackName: data.user.currentTrack.trackName,
                trackArtists: data.user.currentTrack.trackArtists,
                trackAt: data.user.currentTrack.trackAt,
              });
              this.extraOffset++;
            }
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
    }

    .name-like-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .name {
        margin-left: 32px;
        font-size: 48px;
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
      height: 100vh;

    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 400px;
      padding-right: 32px;

      .info-card {
        margin-top: 28px;
        background-color: rgb(var(--vs-gray-2));
        border-radius: 28px;
        padding: 28px;
        max-width: 400px;

        .lines {
          display: flex;
          flex-direction: column;

          .line {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            font-size: 18px;
            margin-bottom: 10px;

            i {
              font-size: 24px;
              margin-right: 8px;
            }
          }

        }

        .genres {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-start;
          width: 100%;
          margin-top: 16px;

          .genre {
            background-color: rgb(var(--vs-gray-4));
            border-radius: 9999px;
            padding: 6px;
            font-size: 12px;
            color: #f1f1f1;
            margin-right: 4px;
            margin-bottom: 4px;
            display: flex;

            &.static {
              cursor: pointer;
            }

            .amount {
              margin-left: 4px;
              font-weight: 500;
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

          .name-like-container {
            margin-top: 8px;
            flex-direction: column;
            align-items: center;

            .name {
              margin-top: 16px;
              margin-left: 0px;
              font-size: 32px;
            }

            .like {
              margin-top: 16px;
            }
          }

        }

    .content {
      flex-direction: column;

      .right {
        width: 100%;
        padding-right: 0px;
        
      }
    }
  }
}
</style>