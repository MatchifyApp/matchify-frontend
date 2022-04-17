<template>
  <router-link class="track-list-item list-item" :to="`/track/${track.trackId}`">
    <div class="icon-name-end">
      <div class="icon-name">
        <div class="icon" :style="`background-image: url('https://i.scdn.co/image/${track.trackAlbumArtwork}');`"></div>
        <div class="name-artists">
          <div class="name">{{ track.trackName }}</div>
          <div class="artists">
            <router-link class="artist" v-for="artist in track.trackArtists" :to="`/artist/${artist.id}`" :key="artist.id">{{ artist.name }}</router-link>
          </div>
        </div>
      </div>
      <div class="end-container">
        <div class="end" v-if="track.trackAt">{{ new Date(track.trackAt).toLocaleDateString() }} {{ new Date(track.trackAt).toLocaleTimeString() }}</div>
        <div class="end" v-else>{{track.trackTotalListenCount}}</div>
      </div>
    </div>
    <div v-if="renderProgress" class="progress-bar-container">
      <div :id="`pb-${track.trackId}-${track.trackAt}`" class="progress-bar">
        <div class="progress"></div>
      </div>
    </div>
  </router-link>
</template>

<script>
import gsap from "gsap";

export default {
  props: {
    track: {
      type: Object,
      required: true
    },
    currentTrack: {
      type: Object,
      default() {
        return null;
      }
    },
    showProgress: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      progressInterval: null,
    }
  },
  computed: {
    renderProgress() {
      return this.showProgress && this.currentTrack?.trackId == this.track.trackId;
    }
  },
  methods: {
    pb() {
      clearInterval(this.progressInterval);
      this.progressInterval = setInterval(() => {
        if (!this.renderProgress) return clearInterval(this.progressInterval);
        let { trackDuration, trackAt: ogTrackAt, trackId } = this.track;
        let computedTrackAt = this.trackAt;
        gsap.to(`#pb-${trackId}-${ogTrackAt} .progress`, {
          width: `${(Date.now() - computedTrackAt) / trackDuration * 100}%`,
          duration: 0.5,
          ease: "linear"
        });
      }, 500);
    }
  },
  watch: {
    renderProgress(v) {
      if (!v) {
        if (this.progressInterval) clearInterval(this.progressInterval)
      } else {
        this.pb();
      }
    },
    track(t, o) {
      if (this.trackAt != t.trackAt) {
        this.trackAt = t.trackAt;
        return;
      }
      if (!o && !!t) {
        this.trackAt = Date.now();
        return;
      }
    }
  },
  created() {
    this.trackAt = this.track.trackAt;
  },
  mounted() {
    if (!this.renderProgress) return;
    this.pb();
  },
  beforeDestroy() {
    if (this.progressInterval) clearInterval(this.progressInterval);
  }
}
</script>

<style lang="scss" scoped>
.track-list-item {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  --icon-size: 44px;

  .icon-name-end {
    display: flex;
    width: 100%;

    .icon-name {
      display: flex;
      flex-direction: row;
      width: 100%;
      align-items: center;

      .icon {
        width: var(--icon-size);
        height: var(--icon-size);
        min-width: var(--icon-size);
        min-height: var(--icon-size);
        background-position: center;
        background-size: cover;
        border-radius: 4px;
        margin-right: 8px;
      }

      .name-artists {
        .name {
          opacity: 0.9;
          font-weight: 600;
          font-size: 22px;
        }

        .artists {
          font-size: 14px;
          opacity: 0.5;

          .artist {
            &:not(:last-child)::after {
              content: ", ";
            }
          }
        }
      }
    }

    .end-container {
      width: 100px;
      text-align: right;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 8px;
      font-size: 12px;
      opacity: 0.5;
    }
  }

  .progress-bar-container {
    position: relative;
    width: 100%;

    .progress-bar {
      --pad-end: 8px;
      position: absolute;
      width: calc(100% - var(--icon-size) - 8px - var(--pad-end));
      right: var(--pad-end);
      height: 4px;
      margin-top: 4px;
      background-color: rgb(var(--vs-gray-1));
      border-radius: 999px;

      .progress {
        border-radius: 999px;
        background-color: rgb(46, 46, 46);
        height: 4px;
        width: 0%;
        max-width: 100%;
      }
    }
  }

}

@media screen and (max-width: 1100px) {

  .track-list-item {
    --icon-size: 32px;

    .icon-name-end {

      .name-artists {
        .name {
          font-size: 16px;
        }

        .artists {
          font-size: 12px;
        }
      }
    }
  }

}
</style>