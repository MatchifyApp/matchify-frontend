<template>
  <div class="home">
    <div class="title-container">
      <h1 class="title">Users</h1>
      <search-input v-model="query"></search-input>
    </div>
    <div class="items">
      <router-link v-for="user in visibleUsers" :key="user.userId" class="item" :to="`/user/${user.userId}`">
        <vs-card>
          <template #title>
            <div class="title">
              <div class="name">
                <div class="text">
                  <span>{{ user.userTag }}</span>
                </div>
              </div>
            </div>
          </template>
          <template #img>
            <div class="img" :style="`background-image: url('${getUserAvatar(user)}');`"></div>
          </template>
          <template #text>
            <div class="description">
              <p v-if="user.currentTrack">{{user.currentTrack.trackTitle}}</p>
              <p v-else></p>
            </div>
          </template>
          <template #interactions>
            <vs-button shadow primary>
              <i class="ri-music-line"></i>
              <span style="padding-left: 8px;">
                {{ user.totalListenCount }}
              </span>
            </vs-button>
          </template>
        </vs-card>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {

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

    .item {
      padding: 8px;
      --card-width: 200px;
      width: 200px;

      .img {
        width: 200px;
        height: 200px;
        background-size: cover;
        background-position: center;
      }

      .artist {
        &:hover {
          text-decoration: underline;
        }
      }

      .title {
        .name {
          --name-height: 26px;
          position: relative;
          width: calc(var(--card-width) - var(--card-spacing));
          word-break: none;
          overflow: hidden;
          white-space: nowrap;
          height: var(--name-height);

          .text {
            z-index: 0;
            width: calc(var(--card-width) - var(--card-spacing));
            position: absolute;
            left: 0;
            top: 0;
            font-size: 18px;
            font-weight: 800;

            &:hover span {
              display: inline-block;
              padding-left: 100%;
              animation: marquee 5s linear infinite;
            }
          }
        }
      }
    }
  }
}
</style>

<script>
import socket from "@/socket";
import _ from "lodash";
import SearchInput from "../components/SearchInput.vue";

import { getUserAvatar } from "@/utils/getUserAvatar";

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
      let notif = this.$vs.notification({ loading: true, color: "dark" });
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
  components: { SearchInput }
}
</script>
