<template>
  <div class="me-page">
    <div class="cards">
      <router-link :to="`/user/${userData.currentUser.userId}`">
        <vs-card>
          <template #title>
            <h3 style="display:flex;">
              <span>{{userData.currentUser.userTag.split("#")[0]}}</span>
              <span class="half-opacity">
                #{{userData.currentUser.userTag.split("#")[1]}}
              </span>
            </h3>
          </template>
          <template #img>
            <img :src="`https://cdn.discordapp.com/avatars/${userData.currentUser.userId}/${userData.currentUser.userAvatar}.png?size=1024`" alt="">
          </template>
          <template #text>
            <p>
              View your account!
            </p>
          </template>
          <template #interactions>
            <vs-button v-if="userData.currentUser.currentTrack" :to="`/track/${userData.currentUser.currentTrack.trackId}`" color="spotify" class="currentTrack-btn" >
              <i class="ri-spotify-fill"></i>
              {{userData.currentUser.currentTrack.trackTitle}}
            </vs-button>
          </template>
        </vs-card>
      </router-link>
      <router-link v-if="userData.currentUser.currentTrack" to="/me/current">
        <vs-card>
          <template #title>
            <h3>
              Current Track
            </h3>
          </template>
          <template #img>
            <img :src="`https://i.scdn.co/image/${userData.currentUser.currentTrack.trackAlbumArtwork}`" alt="">
          </template>
          <template #text>
            <p>
              View same time listeners with you!
            </p>
          </template>
        </vs-card>
      </router-link>
    </div>
  </div>
</template>

<script>
import userData from "@/data/user";

export default {
  data() {
    return {
      userData
    }
  },
  created() {
    document.title = `Me - Matchify`;
  }
}
</script>

<style lang="scss">
  .me-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    padding: 50px;

    .cards {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
    }

    .currentTrack-btn {
      font-size: 0.8rem;
      i {
        font-size: 1.2rem;
        margin-right: 4px;
      }
    }

    .vs-card {
      margin: 8px;
    }
  }
</style>