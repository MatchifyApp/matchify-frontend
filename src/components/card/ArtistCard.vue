<template>
  <vs-card class="artist-card">
    <template #title>
      <div class="title">
        <div class="name">
          <div class="text">
            <span>{{ data.artistName }}</span>
          </div>
        </div>
      </div>
    </template>
    <template #img>
      <div class="img" :style="`background-image: url('https://i.scdn.co/image/${data.artistImage}');`"></div>
    </template>
    <template #text>
      <div class="description">
        <vs-avatar-group max="3" style="justify-content: flex-end; height: 32px;">
          <vs-avatar v-for="user in data.artistSampleListeners" :key="user.userId" size="36" :title="user.userTag">
            <img :src="getUserAvatar(user)">
          </vs-avatar>
        </vs-avatar-group>
      </div>
    </template>
    <template #interactions>
      <vs-button shadow primary>
        <i class="ri-group-line"></i>
        <span style="padding-left: 8px;">
          {{ data.artistListenerCount }}
        </span>
      </vs-button>
      <vs-button shadow primary>
        <i class="ri-music-line"></i>
        <span style="padding-left: 8px;">
          {{ data.artistTotalListenCount }}
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
  },
}
</script>

<style lang="scss" scoped>
.artist-card {
  padding: 8px;
  --card-width: 200px;
  width: 200px;

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

