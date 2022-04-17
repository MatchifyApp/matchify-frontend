<template>
  <div class="artists">
    <div class="title-container">
      <h1 class="title">Artists</h1>
      <search-input v-model="query"></search-input>
    </div>
    <div class="items">
      <router-link v-for="artist in visibleArtists" :key="artist.artistId" class="item" :to="`/artist/${artist.artistId}`">
        <artist-card :data="artist"></artist-card>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.artists {

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
import ArtistCard from "@/components/card/ArtistCard.vue";


export default {
  data() {
    return {
      artists: [],
      sampleArtists: [],
      query: ""
    };
  },
  methods: {
    getUserAvatar
  },
  computed: {
    visibleArtists() {
      return this.query.trim() ? this.artists : this.sampleArtists;
    }
  },
  watch: {
    query: _.debounce(function(q) {
      q = q.trim();
      history.replaceState({}, "", `/artists${q ? `?q=${q}` : ""}`);
      socket.emit("artist:search:unsubscribe");
      if (!q)
        return;
      this.artists = [];
      let notif = this.$vs.notification({ loading: true, color: "dark", duration: "none" });
      socket.emit("artist:search:subscribe", { search: q });
      socket.once("artist:search", () => {
        this.$nextTick(() => {
          notif.close();
        });
      });
    }, 500)
  },
  created() {
    this.query = this.$route.query.q || "";
    document.title = "Artists - Matchify";
    let notif = this.$vs.notification({ loading: true, color: "dark", duration: "none" });
    socket.on("loops:sampleArtists", ({ data }) => {
      this.sampleArtists = data;
      if (notif) {
        notif.close();
        notif = null;
      }
    });
    socket.on("artist:search", ({ data }) => {
      this.artists = data.results;
    });
    socket.emit("loops:subscribe", { loop: "sampleArtists" });
  },
  beforeDestroy() {
    socket.emit("loops:unsubscribe", { loop: "sampleArtists" });
    socket.emit("artist:search:unsubscribe");
  },
  components: { SearchInput, ArtistCard }
}
</script>
