<template>
  <div v-if="userData.currentUser" class="me-page">
    <div class="sidebar">
      <router-link :to="`/user/${userData.currentUser.userId}`" class="item">
        Current User
        <vs-avatar v-if="userData.currentUser">
          <img :src="getUserAvatar(userData.currentUser)" alt="">
        </vs-avatar>
      </router-link>
      <router-link :to="`/me/current`" class="item">
        Current Track
        <vs-avatar v-if="userData.currentUser.currentTrack">
          <img :src="`https://i.scdn.co/image/${userData.currentUser.currentTrack.trackAlbumArtwork}`" alt="">
        </vs-avatar>
      </router-link>
      <router-link :to="`/user/${(randomMatch || {}).userId}`" class="item" :class="{'disabled': !randomMatch}">
        Random Match
        <vs-avatar v-if="randomMatch">
          <img :src="getUserAvatar(randomMatch)" alt="">
        </vs-avatar>
      </router-link>
      <span @click="logout" class="item danger">
        Logout
      </span>
      <span @click="blockMe" class="item danger">
        Disable Account
      </span>
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
    flex-direction: column;
    padding-top: 16px;
    padding-right: 16px;
    .sidebar {
      width: 100%;
      margin-bottom: 32px;
      .item {
        padding: 0 16px;
        height: 70px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.25);
        cursor: pointer;
        user-select: none;
        min-width: max-content;
        display: flex;
        align-items: center;
        justify-content: space-between;        

        &.disabled {
          pointer-events: none;
          opacity: 0.35;
        }

        &:hover:not(.disabled), &.active {
          background-color: rgba(255, 255, 255, 0.15);
        }

        &.danger {
          color: tomato;
          border-bottom: 1px solid rgba(255, 99, 71, 0.25);
          &:hover:not(.disabled), &.active {
            background-color: rgba(255, 99, 71, 0.15);
          }
        }
      }
    }

  }
</style>