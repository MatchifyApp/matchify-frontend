<template>
  <div class="right">
    <TrackInformationCard v-if="type == 'track'" :track="information"></TrackInformationCard>
    <UserInformationCard v-else-if="type == 'user'" :user="information"></UserInformationCard>
    <AlbumInformationCard v-else-if="type == 'album'" :album="information"></AlbumInformationCard>
    <ArtistInformationCard v-else-if="type == 'artist'" :artist="information"></ArtistInformationCard>
  </div>
</template>
<script>
import UserInformationCard from "./UserInformationCard.vue";
import TrackInformationCard from "./TrackInformationCard.vue";
import AlbumInformationCard from "./AlbumInformationCard.vue";
import ArtistInformationCard from "./ArtistInformationCard.vue";
export default {
  props: {
    information: Object,
    type: String,
  },
  components: { UserInformationCard, TrackInformationCard, AlbumInformationCard, ArtistInformationCard }
}
</script>
<style lang="scss">
.right {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  padding-right: 32px;

  .info-card {
    margin-top: 1.75em;
    background-color: rgb(var(--vs-gray-2));
    border-radius: 1.75em;
    padding: 1.75em;
    max-width: 300px;
    width: 100%;

    .lines {
      display: flex;
      flex-direction: column;

      .line {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 1.125em;
        margin-bottom: .625em;

        i {
          font-size: 1.5em;
          margin-right: .5em;
        }
      }

    }

    .genres {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-start;
      width: 100%;
      margin-top: 1em;

      .genre {
        background-color: rgb(var(--vs-gray-4));
        border-radius: 9999px;
        padding: .375em;
        font-size: .75em;
        color: #f1f1f1;
        margin-right: 4px;
        margin-bottom: 4px;
        display: flex;

        &.static {
          cursor: pointer;
        }

        .amount {
          margin-left: .25em;
          font-weight: 500;
        }
      }
    }
  }
}

@media screen and (max-width: 1100px) {
  .right {
    width: 100%;
    padding-right: 0px;

    .info-card {
      margin-right: 16px;
      font-size: 14px;
    }
  }
}
</style>