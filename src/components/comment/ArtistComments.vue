<template>
  <div class="comments">
    <h2 class="title">Comments</h2>
    <div v-if="userData.currentUser" class="input-area">
      <input v-model="commentText" type="text" placeholder="Comment something.." :disabled="isSendingComment">
      <vs-button shadow size="s" @click="sendComment" :loading="isSendingComment" :disabled="!commentText">
        Send
      </vs-button>
    </div>
    <div class="items">
      <CommentItem v-for="(comment, i) in comments" :comment="comment" :key="i" @delete="deleteComment(comment._id)"></CommentItem>
      <static-list-item v-if="comments.length >= 20">
        <vs-button size="xl" shadow color="dark" @click="loadMoreComment" :loading="commentLoading">Load More</vs-button>
      </static-list-item>
    </div>
  </div>
</template>

<script>
import socket from "@/socket";
import CommentItem from "./CommentItem.vue";
import userData from "@/data/user";

export default {
  data() {
    return {
      userData,
      comments: [],
      commentText: "",
      isSendingComment: false,
      commentLoading: false,
      extraCommentOffset: 0,
      commentPage: 0
    };
  },
  props: {
    artistId: String
  },
  methods: {
    async loadMoreComment() {
      this.commentLoading = true;
      const PAGE_SIZE = 20;
      socket.emit("artist:current-user:comment:list", {
        artistId: this.artistId,
        offset: this.extraCommentOffset + (PAGE_SIZE * this.commentPage++),
        limit: PAGE_SIZE
      }, ({ data }) => {
        this.commentLoading = false;
        this.comments.push(...data);
      });
    },
    async sendComment() {
      this.isSendingComment = true;
      socket.emit("artist:current-user:comment:create", {
        artistId: this.artistId,
        comment: this.commentText
      }, (i) => {
        this.extraCommentOffset++;
        this.isSendingComment = false;
        this.commentText = "";
        if (!i.ok) {
          this.$vs.notification({
            color: "danger",
            title: "Unable post comment!",
            text: i.error
          });
          return;
        }
      })
    },
    async deleteComment(_id) {
      let i = this.comments.findIndex(i => i._id == _id);
      if (i == -1)
        return;
      this.comments.splice(i, 1);
      socket.emit("artist:current-user:comment:delete", {
        commentId: _id
      }, (i) => {
        if (!i.ok) {
          this.$vs.notification({
            color: "danger",
            title: "Unable delete comment!",
            text: i.error
          });
          return;
        }
      });
    }
  },
  created() {
    this.loadMoreComment();

    socket.on("artist:comment", ({ data }) => {
      if (this.artistId != data.artistId) return;
      this.extraCommentOffset++;
      this.comments.unshift({ ...data, createdAt: Date.now() });
    });

    socket.on("artist:comment:delete", ({ data }) => {
      let i = this.comments.findIndex(i => i._id == data);
      if (i == -1) return;
      let did = this.comments.splice(i, 1);
      if (did?.length) this.extraCommentOffset--;
    })
  },
  components: { CommentItem }
}

</script>

