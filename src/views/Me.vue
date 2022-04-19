<template>
  <div v-if="userData.currentUser" class="me-page">
    <div class="cards">
      <router-link :to="`/user/${userData.currentUser.userId}`">
        <vs-card>
          <template #title>
            <h3 style="display:flex;">
              <span>{{userData.currentUser.userTag.split("#")[0]}}</span>
              <span class="half-opacity">
                #{{userData.currentUser.userTag.split("#")[1]}}
              </span>
            </h3>
          </template>
          <template #img>
            <img :src="`${getUserAvatar(userData.currentUser)}?size=512`" alt="">
          </template>
          <template #text>
            <p>
              View your account!
            </p>
          </template>
          <template #interactions>
            <vs-button v-if="userData.currentUser.currentTrack" :to="`/track/${userData.currentUser.currentTrack.trackId}`" color="spotify" class="currentTrack-btn" >
              <i class="ri-spotify-fill"></i>
              {{userData.currentUser.currentTrack.trackTitle}}
            </vs-button>
          </template>
        </vs-card>
      </router-link>
      <router-link v-if="userData.currentUser.currentTrack" to="/me/current">
        <vs-card>
          <template #title>
            <h3>
              Current Track
            </h3>
          </template>
          <template #img>
            <img :src="`https://i.scdn.co/image/${userData.currentUser.currentTrack.trackAlbumArtwork}`" alt="">
          </template>
          <template #text>
            <p>
              View same time listeners with you!
            </p>
          </template>
        </vs-card>
      </router-link>
      <router-link v-if="randomMatch" :to="`/user/${randomMatch.userId}`">
        <vs-card>
          <template #title>
            <h3>
              Matches
            </h3>
          </template>
          <template #img>
            <img :src="getUserAvatar(randomMatch)" alt="">
          </template>
          <template #text>
            <p>
              Click here to see your random match!
            </p>
          </template>
        </vs-card>
      </router-link>
    </div>
    <div class="buttons">
      <vs-button color="danger" flat @click="logout">Logout</vs-button>
      <vs-button color="danger" flat @click="blockMe">Disable My Account</vs-button>
    </div>
  </div>
</template>

<script>
import userData from "@/data/user";
import router from "@/router";
import socket from "@/socket";
import { getUserAvatar } from "@/utils/getUserAvatar";
import Vue from "vue";



export default {
  data() {
    return {
      userData,
      randomMatch: null,
      matchCheckInterval: null
    }
  },
  async created() {
    document.title = `Me - Matchify`;

    await userData.awaitCurrentUser()
    if (!userData.currentUser) return;

    this.checkMatches();
    this.matchCheckInterval = setInterval(()=>{
      this.checkMatches();
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.matchCheckInterval);
  },
  methods: {
    getUserAvatar,
    checkMatches() {
      socket.emit("current-user:get:matches", {size: 1}, ({data})=>{
        this.randomMatch = data.length > 0 ? data[0] : null;
      });
    },
    logout() {
      userData.logoutUser();
      window.location.href = "/";
    },
    blockMe() {
      if (prompt("Are you sure about that? All your data going to be deleted! And you are no longer tracked by Matchify!\n\nType 'yes' to confirm.", "no") !== "yes") return;
      userData.logoutUser();
      socket.emit("auth:blockMe");
      router.push("/");
      Vue.$vs.notification({
        title: "Account Blocked",
        text: "Your account has been blocked. All your data has been deleted. And you are no longer tracked by Matchify. Until you login again.",
        color: "danger",
        progress: "auto",
        time: 10000
      });
    }
  },
}
</script>

<style lang="scss">
  .me-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    padding: 50px;
    flex-direction: column;

    .cards {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;

      .currentTrack-btn {
        font-size: 0.8rem;
        i {
          font-size: 1.2rem;
          margin-right: 4px;
        }
      }

      .vs-card {
        margin: 8px;
        max-width: 300px;
      }
    }

    .buttons {
      margin-top: 8px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
    }
    
  }
</style>