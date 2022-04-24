<template>
  <div class="comments-container">
    <UserComments v-if="type == 'user'" :userId="id"></UserComments>
    <ArtistComments v-else-if="type == 'artist'" :artistId="id"></ArtistComments>
    <AlbumComments v-else-if="type == 'album'" :albumId="id"></AlbumComments>
    <TrackComments v-else-if="type == 'track'" :trackId="id"></TrackComments>
  </div>
</template>

<script>
import userData from "@/data/user";
import UserComments from "./UserComments.vue";
import ArtistComments from "./ArtistComments.vue";
import AlbumComments from "./AlbumComments.vue";
import TrackComments from "./TrackComments.vue";

export default {
    data() {
        return {
            userData
        };
    },
    props: {
        id: String,
        type: String,
    },
    components: { UserComments, ArtistComments, AlbumComments, TrackComments }
}

</script>

<style lang="scss">
.comments {
  .title {
    padding: 32px 0;
  }

  .input-area {
    display: flex;
    align-items: center;

    .vs-button {
      width: 96px;
      height: 36px;
    }

    input {
      font-size: 16px;
      background: transparent;
      color: white;
      border: none;
      width: 100%;
      padding: 16px 0;
      border-bottom: rgba(255, 255, 255, 0.1) solid 3px;
      transition: border 100ms ease-in-out;

      &:focus {
        border-bottom: rgba(255, 255, 255, 0.2) solid 3px;
      }
    }
  }

  .items {
    display: flex;
    flex-direction: column;
    margin-top: 8px;
    height: 500px;
    contain: content;
    overflow: auto;
  }
}
</style>