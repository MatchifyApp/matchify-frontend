<template>
  <div class="users">
    <div class="title-container">
      <h1 class="title">Users</h1>
      <search-input v-model="query"></search-input>
    </div>
    <div class="items">
      <router-link v-for="user in visibleUsers" :key="user.userId" :to="`/user/${user.userId}`">
        <user-card :data="user"></user-card>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.users {

  .title-container {
    width: 100%;
    padding: 16px 8px;
    display: flex;
    align-items: center;

    .title {
      margin-right: 32px;
    }

    .search-input {
      padding: 0 16px;
    }
  }

  @media screen and (max-width: 1100px) {
    .title-container {
      flex-direction: column;
    }

    .title {
      margin-right: 0px;
      margin-bottom: 16px;
    }
  }

  .items {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
  }
}
</style>

<script>
import socket from "@/socket";
import _ from "lodash";
import SearchInput from "../components/SearchInput.vue";
import { getUserAvatar } from "@/utils/getUserAvatar";
import UserCard from "@/components/card/UserCard.vue";

export default {
  data() {
    return {
      users: [],
      sampleUsers: [],
      query: ""
    };
  },
  methods: {
    getUserAvatar
  },
  computed: {
    visibleUsers() {
      return this.query.trim() ? this.users : this.sampleUsers;
    }
  },
  watch: {
    query: _.debounce(function(q) {
      q = q.trim();
      history.replaceState({}, "", `/users${q ? `?q=${q}` : ''}`);
      socket.emit("user:search:unsubscribe");
      if (!q) return;
      this.users = [];
      let notif = this.$vs.notification({ loading: true, color: "dark", duration: "none" });
      socket.emit("user:search:subscribe", { search: q });
      socket.once("user:search", () => {
        notif.close();
      });
    }, 500)
  },
  created() {
    this.query = this.$route.query.q || "";
    document.title = "Users - Matchify";
    socket.on("loops:sampleUsers", ({data}) => {
      this.sampleUsers = data;
    });
    socket.on("user:search", ({data}) => {
      this.users = data.results;
    });

    socket.emit("loops:subscribe", { loop: "sampleUsers" });
  },
  beforeDestroy() {
    socket.emit("user:search:unsubscribe");
    socket.emit("loops:unsubscribe", { loop: "sampleUsers" });
  },
  components: { SearchInput, UserCard }
}
</script>
