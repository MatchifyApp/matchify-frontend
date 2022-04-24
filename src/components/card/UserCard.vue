<template>
  <vs-card class="user-card" :class="{'premium': data.userPremiumUntil > Date.now()}">
    <template #title>
      <div class="title">
        <div class="name">
          <div class="text">
            <span>{{ data.userTag }}</span>
          </div>
        </div>
      </div>
    </template>
    <template #img>
      <div class="img" :style="`background-image: url('${getUserAvatar(data)}');`"></div>
    </template>
    <template #text>
      <div class="description">
        <p v-if="data.currentTrack">{{ data.currentTrack.trackTitle }}</p>
        <p v-else></p>
      </div>
    </template>
    <template #interactions>
      <vs-button shadow primary>
        <i class="ri-heart-line"></i>
        <span style="padding-left: 8px;">
          {{ data.totalUsersLikedMe }}
        </span>
      </vs-button>
      <vs-button shadow primary>
        <i class="ri-music-line"></i>
        <span style="padding-left: 8px;">
          {{ data.totalListenCount }}
        </span>
      </vs-button>
    </template>
  </vs-card>
</template>

<script>
import { getUserAvatar } from "@/utils/getUserAvatar"

export default {
  props: {
    data: Object,
  },
  methods: {
    getUserAvatar
  }
}
</script>

<style lang="scss">
.user-card {
  padding: 8px;
  --card-width: 200px;
  width: 200px;

  &.premium {
    .vs-card {
      box-shadow: 0px 0px 0px 4px gold, 0px 0px 16px 4px gold !important;
    }
  }

  .img {
    width: 200px;
    height: 200px;
    background-size: cover;
    background-position: center;
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
</style>