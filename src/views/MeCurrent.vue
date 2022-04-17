<template>
  <div v-if="trackListeners && albumListeners && artistListeners && userData.currentUser.currentTrack" class="me-current">
    <div class="icon-name-container">
      <div class="icon" :style="`background-image: url('https://i.scdn.co/image/${userData.currentUser.currentTrack.trackAlbumArtwork}');`"></div>
      <div class="name-controls-container">
        <div class="name">
          <router-link class="name-text" :to="`/track/${userData.currentUser.currentTrack.trackId}`">
            <div class="gradient"></div>
            <div class="text">{{ userData.currentUser.currentTrack.trackName }}</div>
          </router-link>
          <div class="artists">
            <router-link class="artist" v-for="artist in userData.currentUser.currentTrack.trackArtists" :to="`/artist/${artist.id}`" :key="artist.id">
              {{ artist.name }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="lists">
      <div class="row">
        <ItemList title="Track Listeners" class="content">
          <UserListItem v-for="(user, i) in trackListeners" :user="user" :key="i"></UserListItem>
        </ItemList>
        <item-list title="Album Listeners" class="content">
          <UserListItem v-for="(user, i) in albumListeners" :user="user" :key="i"></UserListItem>
        </item-list>
      </div>
      <div class="row">
        <item-list title="Artists Listeners" class="content">
          <UserListItem v-for="(user, i) in artistListeners" :user="user" :key="i"></UserListItem>
        </item-list>
      </div>
    </div>
  </div>
</template>

<script>
import userData from "@/data/user";
import socket from "@/socket";
import _ from "lodash";
import ItemList from "@/components/list/ItemList.vue";
import UserListItem from "@/components/list/UserListItem.vue";

export default {
  data() {
    return {
      trackListeners: null,
      albumListeners: null,
      artistListeners: null,
      userData,
      lastTrackId: null,
      renderTrackView: false
    };
  },
  methods: {
    unsubscribe(value) {
      socket.emit("track:unsubscribe", {
        trackId: value.trackId,
      });
      socket.emit("album:unsubscribe", {
        albumId: value.trackAlbumId,
      });
      value.trackArtists.forEach(artist => {
        socket.emit("artist:unsubscribe", {
          artistId: artist.id,
        });
      });
    },
    subscribe(newValue, oldValue) {
      if (this.lastTrackId == newValue?.trackId)
        return;
      if (oldValue) {
        this.unsubscribe(oldValue);
        this.unsubscribe(newValue);
      }
      if (!newValue) return;
      socket.emit("track:subscribe", {
        trackId: newValue.trackId,
      });
      socket.emit("album:subscribe", {
        albumId: newValue.trackAlbumId,
      });
      newValue.trackArtists.forEach(artist => {
        socket.emit("artist:subscribe", {
          artistId: artist.id,
        });
      });
      this.lastTrackId = newValue.trackId;
    }
  },
  async created() {
    document.title = "Me Current - Matchify";
    await userData.awaitCurrentUser();
    if (!userData.currentUser)
      return;
    let notif = this.$vs.notification({ loading: true, color: "dark", duration: "none" });
    this.$watch(() => userData.currentUser.currentTrack, (newValue, oldValue) => {
      this.subscribe(newValue, oldValue);
    });
    this.subscribe(userData.currentUser.currentTrack);
    socket.on("track:event", ({ data }) => {
      this.trackListeners = data.track.trackListeners;
    });
    socket.on("album:event", ({ data }) => {
      this.albumListeners = data.album.albumListeners;
    });
    let self = this;
    let artistListeners = new Map();
    let artistDebounce = _.debounce(function() {
      self.artistListeners = [...artistListeners.values()];
      artistListeners = new Map();
      if (notif) {
        notif.close();
        notif = null;
      }
    }, 500);
    socket.on("artist:event", ({ data }) => {
      data.artist.artistListeners.forEach(user => {
        artistListeners.set(user.userId, user);
      });
      artistDebounce();
    });
  },
  beforeDestroy() {
    this.unsubscribe(userData.currentUser.currentTrack);
  },
  components: { ItemList, UserListItem }
}
</script>

<style lang="scss">
.me-current {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;

  .icon-name-container {
    --icon-size: 150px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 32px;
    width: 100%;

    .icon {
      width: var(--icon-size);
      height: var(--icon-size);
      min-width: var(--icon-size);
      min-height: var(--icon-size);
      background-position: center center;
      background-size: cover;
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
    }
  }

  .lists {
    display: flex;
    flex-direction: column;
    width: 100%;

    .row {
      display: flex;
      margin-bottom: 16px;
      width: 100%;

      .content {
        width: 50%;

        &:first-child {
          margin-right: 16px;
        }
      }
    }
  }
}

@media screen and (max-width: 1100px) {
  .me-current {
    align-items: flex-start;
    justify-content: flex-start;

    .icon-name-container {
      --icon-size: 150px;
      flex-direction: column;
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

    .lists {
      display: flex;
      flex-direction: column-reverse;

      .row {
        flex-direction: column-reverse;

        .content {
          width: 100%;

          &:first-child {
            margin-right: 0px;
          }
        }
      }
    }
  }
}
</style>