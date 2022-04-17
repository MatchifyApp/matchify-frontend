<template>
  <router-link class="user-list-item list-item" :to="`/user/${user.userId}`">
    <div class="icon-name-end">
      <div class="icon-name">
        <div class="icon" :style="`background-image: url('${getUserAvatar(user)}');`"></div>
        <div class="name">
          {{ user.userTag.split("#")[0] }}
          <div class="half-opacity">#{{ user.userTag.split("#")[1] }}</div>
        </div>
      </div>
      <div v-if="showCount" class="end-container">
        <div class="end">
          {{user.listenCount || user.totalListenCount}}
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import { getUserAvatar } from "@/utils/getUserAvatar"

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    showCount: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    getUserAvatar
  },
}
</script>

<style lang="scss" scoped>
.user-list-item {
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
      align-items: center;
      width: 100%;

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

      .name {
        display: flex;
        align-items: center;
        opacity: 0.9;
        font-weight: 600;
        font-size: 26px;
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

}

@media screen and (max-width: 1100px) {

  .user-list-item {
    --icon-size: 36px;

    .name {
      font-size: 19px !important;
    }
  }

}
</style>