<template>
  <div class="comment-item item">
    <div class="avatar" :style="`background-image: url('${getUserAvatar(comment.user)}');`"></div>
    <div class="info">
      <div class="top">
        <router-link class="author-name" :to="`/user/${comment.userId}`">
          <span>{{ comment.user.userTag.split("#")[0] }}</span>
          <span class="half-opacity">#{{ comment.user.userTag.split("#")[1] }}</span>
        </router-link>
        <div class="created-at half-opacity">
          {{ new Date(comment.createdAt).toLocaleDateString() }} {{ new Date(comment.createdAt).toLocaleTimeString() }}
        </div>
      </div>
      <div class="content-container">
        <div class="comment-content">
          {{ comment.content }}
        </div>
        <div class="controls">
          <vs-button v-if="canDeleteAll || userData.isAdmin || comment.userId == (userData.currentUser||{}).userId" icon color="danger" border @click="deleteMe">
            <i class="ri-delete-bin-line"></i>
          </vs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.comment-item {
  --icon-size: 40px;
  display: flex;
  align-items: center;
  padding: 8px;
  padding-left: 0px;

  .avatar {
    width: var(--icon-size);
    height: var(--icon-size);
    min-width: var(--icon-size);
    min-height: var(--icon-size);
    background-position: center;
    background-size: cover;
    border-radius: 4px;
    margin-right: 8px;
  }

  .info {
    display: flex;
    flex-direction: column;
    width: 100%;

    .top {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .author-name {
        font-size: 16px;
        font-weight: 500;
      }

      .created-at {
        font-size: 14px;
      }
    }

    .content-container {
      display: flex;
      .comment-content {
        font-size: 15px;
        font-weight: 300;
        margin-top: 4px;
        opacity: 0.9;
        width: 100%;
        margin-right: 8px;
      }
      .controls {
        display: flex;
      }
    }


  }
}
</style>


<script>
import { getUserAvatar } from "@/utils/getUserAvatar"
import userData from "@/data/user";

export default {
  props: {
    comment: Object,
    canDeleteAll: Boolean,
  },
  data() {
    return {
      userData
    }
  },
  methods: {
    getUserAvatar,
    deleteMe() {
      this.$emit("delete", this.comment._id);
    }
  }
}
</script>