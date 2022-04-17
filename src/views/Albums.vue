<template>
  <div class="albums">
    <div class="title-container">
      <h1 class="title">Albums</h1>
      <search-input v-model="query"></search-input>
    </div>
    <div class="items">
      <router-link v-for="album in visibleAlbums" :key="album.albumId" class="item" :to="`/album/${album.albumId}`">
        <AlbumCard :data="album"></AlbumCard>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.albums {

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

import { getUserAvatar } from "@/utils/getUserAvatar";
import SearchInput from "@/components/SearchInput.vue";
import AlbumCard from "@/components/card/AlbumCard.vue";


export default {
  data() {
    return {
      albums: [],
      sampleAlbums: [],
      query: ""
    };
  },
  methods: {
    getUserAvatar
  },
  computed: {
    visibleAlbums() {
      return this.query.trim() ? this.albums : this.sampleAlbums;
    }
  },
  watch: {
    query: _.debounce(function(q) {
      q = q.trim();
      history.replaceState({}, "", `/albums${q ? `?q=${q}` : ""}`);
      socket.emit("album:search:unsubscribe");
      if (!q) return;
      this.albums = [];
      let notif = this.$vs.notification({ loading: true, color: "dark", duration: "none" });
      socket.emit("album:search:subscribe", { search: q });
      socket.once("album:search", () => {
        this.$nextTick(() => {
          notif.close();
        });
      });
    }, 500)
  },
  created() {
    this.query = this.$route.query.q || "";
    document.title = "Albums - Matchify";
    let notif = this.$vs.notification({ loading: true, color: "dark", duration: "none" });
    socket.on("loops:sampleAlbums", ({ data }) => {
      this.sampleAlbums = data;
      if (notif) {
        notif.close();
        notif = null;
      }
    });
    socket.on("album:search", ({ data }) => {
      this.albums = data.results;
    });
    socket.emit("loops:subscribe", { loop: "sampleAlbums" });
  },
  beforeDestroy() {
    socket.emit("album:search:unsubscribe");
    socket.emit("loops:unsubscribe", { loop: "sampleAlbums" });
  },
  components: { SearchInput, AlbumCard }
}
</script>
