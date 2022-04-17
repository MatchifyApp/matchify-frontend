<template>
  <div class="home">
    <div class="title-container">
      <h1 class="title">Popular Tracks</h1>
    </div>
    <div class="items">
      <router-link v-for="track in tracks" :key="track.trackId" :to="`/track/${track.trackId}`">
        <TrackCard :data="track"></TrackCard>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {

  .title-container {
    width: 100%;
    padding: 16px 8px;

  }

  @media screen and (max-width: 1100px) {
    .title-container {
      text-align: center;
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
import TrackCard from "@/components/card/TrackCard.vue";

export default {
  data() {
    return {
      tracks: []
    };
  },
  created() {
    document.title = "Home - Matchify";
    let notif = this.$vs.notification({ loading: true, color: "dark", duration: "none" });
    socket.on("loops:popularTracks", ({ data }) => {
      this.tracks = data.map(i => ({ ...i, trackSampleListeners: _.shuffle(i.trackListeners), trackListeners: undefined }));
      if (notif) {
        notif.close();
        notif = null;
      }
    });
    socket.emit("loops:subscribe", { loop: "popularTracks" });
  },
  beforeDestroy() {
    socket.emit("loops:unsubscribe", { loop: "popularTracks" });
  },
  components: { TrackCard }
}
</script>
