<template>
  <div v-if="user" class="user-page">
    <div class="banner" :style="`--img: ${user.userBanner ? `url('https://cdn.discordapp.com/banners/${user.userId}/${user.userBanner}.${user.userBanner.startsWith('a_') ? 'gif' : 'png'}?size=4096');` : `${bannerColor}`}`"></div>
    <div class="icon-name-container">
      <div class="icon" :style="`background-image: url('${getUserAvatar(user)}?size=4096');`"></div>
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
            <track-list-item v-for="(track, i) in trackHistory" :track="track" :key="i"></track-list-item>
            <static-list-item>
              <vs-button size="xl" shadow color="dark" @click="loadMoreHistory" :loading="historyLoading">Load More</vs-button>
            </static-list-item>
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
import StaticListItem from "@/components/list/StaticListItem.vue";
import { getUserAvatar } from "@/utils/getUserAvatar";

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
      historyPage: 0,
      historyLoading: false
    }
  },
  methods: {
    toCapitalCase,
    getUserAvatar,
    like() {
      this.likeState = !this.likeState;
      this.user.totalUsersLikedMe += this.likeState ? 1 : -1;
      socket.emit("user:user:like:set", {userId: this.userId, state:this.likeState});
    },
    async loadMoreHistory() {
      const PAGE_SIZE = 20;
      this.historyLoading = true;
      socket.emit("user:get:history", {
        userId: this.userId,
        offset: this.extraOffset+(PAGE_SIZE*this.historyPage++),
        limit: PAGE_SIZE
      }, ({data})=>{
        this.historyLoading = false;
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
    TrackListItem,
    StaticListItem
},
  async created() {
    this.userId = this.$route.params.userId;

    let notif = this.$vs.notification({ loading: true, color: "dark" });

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
              });
              this.extraOffset++;
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
              });
              this.extraOffset++;
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
      margin-top: 32px;
      padding: 0 32px;
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 400px;
      padding-right: 32px;

      .info-card {
        margin-top: 1.75em;
        background-color: rgb(var(--vs-gray-2));
        border-radius: 1.75em;
        padding: 1.75em;
        max-width: 400px;

        .lines {
          display: flex;
          flex-direction: column;

          .line {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            font-size: 1.125em;
            margin-bottom: .625em;

            i {
              font-size: 1.5em;
              margin-right: .5em;
            }
          }

        }

        .genres {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-start;
          width: 100%;
          margin-top: 1em;

          .genre {
            background-color: rgb(var(--vs-gray-4));
            border-radius: 9999px;
            padding: .375em;
            font-size: .75em;
            color: #f1f1f1;
            margin-right: 4px;
            margin-bottom: 4px;
            display: flex;

            &.static {
              cursor: pointer;
            }

            .amount {
              margin-left: .25em;
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
      flex-direction: column-reverse;

      .right {
        width: 100%;
        padding-right: 0px;

        .info-card {
          margin-right: 16px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>