<template>
  <div class="tracks">
    <div class="title-container">
      <h1 class="title">Tracks</h1>
      <search-input v-model="query"></search-input>
    </div>
    <div class="items">
      <router-link v-for="track in visibleTracks" :key="track.trackId" class="item" :to="`/track/${track.trackId}`">
        <track-card :data="track"></track-card>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tracks {

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
import TrackCard from "@/components/card/TrackCard.vue";


export default {
  data() {
    return {
      tracks: [],
      sampleTracks: [],
      query: ""
    };
  },
  methods: {
    getUserAvatar
  },
  computed: {
    visibleTracks() {
      return this.query.trim() ? this.tracks : this.sampleTracks;
    }
  },
  watch: {
    query: _.debounce(function(q) {
      q = q.trim();
      history.replaceState({}, "", `/tracks${q ? `?q=${q}` : ""}`);
      socket.emit("track:search:unsubscribe");
      if (!q)
        return;
      this.tracks = [];
      let notif = this.$vs.notification({ loading: true, color: "dark", duration: "none" });
      socket.emit("track:search:subscribe", { search: q });
      socket.once("track:search", () => {
        this.$nextTick(() => {
          notif.close();
        });
      });
    }, 500)
  },
  created() {
    this.query = this.$route.query.q || "";
    document.title = "Tracks - Matchify";
    let notif = this.$vs.notification({ loading: true, color: "dark", duration: "none" });
    socket.on("loops:sampleTracks", ({ data }) => {
      this.sampleTracks = data;
      if (notif) {
        notif.close();
        notif = null;
      }
    });
    socket.on("track:search", ({ data }) => {
      this.tracks = data.results;
    });
    socket.emit("loops:subscribe", { loop: "sampleTracks" });
  },
  beforeDestroy() {
    socket.emit("loops:unsubscribe", { loop: "sampleTracks" });
    socket.emit("track:search:unsubscribe");
  },
  components: { SearchInput, TrackCard }
}
</script>
