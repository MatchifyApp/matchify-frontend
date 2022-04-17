<template>
  <div id="app" vs-theme="dark">
    <nav>
      <vs-sidebar
        absolute
        v-model="activeItem"
        open
        reduce
        :hoverExpand="!isMobile"
        >
        <template #logo>
          <router-link to="/">
            <matchify-icon :size="4"></matchify-icon>
          </router-link>
        </template>
        <vs-sidebar-item id="home" to="/">
          <template #icon>
            <i class="ri-home-2-line"></i>
          </template>
          Home
        </vs-sidebar-item>
        <vs-sidebar-item id="tracks" to="/tracks">
          <template #icon>
            <i class="ri-disc-line"></i>
          </template>
          Tracks
        </vs-sidebar-item>

        <vs-sidebar-item id="albums" to="/albums">
          <template #icon>
            <i class="ri-album-line"></i>
          </template>
          Albums
        </vs-sidebar-item>

        <vs-sidebar-item id="artists" to="/artists">
          <template #icon>
            <i class="ri-user-search-line"></i>
          </template>
          Artists
        </vs-sidebar-item>

        <vs-sidebar-item id="users" to="/users">
          <template #icon>
            <i class="ri-group-line"></i>
          </template>
          Users
        </vs-sidebar-item>
        <vs-sidebar-item id="top" to="/top">
          <template #icon>
            <i class="ri-play-list-line"></i>
          </template>
          Top 50
        </vs-sidebar-item>
        <template #footer>
          <router-link :to="userData.currentUser ? '/me' : '/login'">
            <vs-avatar>
              <img v-if="userData.currentUser" :src="`https://cdn.discordapp.com/avatars/${userData.currentUser.userId}/${userData.currentUser.userAvatar}.png?size=128`" alt="">
              <i v-if="!userData.currentUser" class="ri-login-circle-line"></i>
            </vs-avatar>
          </router-link>
        </template>
      </vs-sidebar>

    </nav>
    <div class="router-view">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { isMobile } from "@/data/isMobile";
import userData from "@/data/user";
import MatchifyIcon from "./components/MatchifyIcon.vue";


export default {
  components: { MatchifyIcon },
  data() {
    return {
      activeItem: "home",
      isMobile,
      userData
    }
  },
  created() {
    (()=>{
      let token = localStorage.getItem("token");
      if (!token) return;
      userData.loginUser(token);
    })();

    (()=>{
      if (window.location.hostname == "localhost") return;
      if (window.location.hostname == "matchify.org") {
        if (window.location.protocol != "https:") {
          let u = new URL(window.location.href);
          u.protocol = "https:";
          window.location.replace(u.href);
          return;
        }
      } else {
        window.location.replace("https://matchify.org");
      }
    })();
  }
}
</script>

<style lang="scss">
@import url("./styles/main.scss");

.router-view {
  width: 100%;
  height: 100%;

  padding-left: 66px;
}
</style>
