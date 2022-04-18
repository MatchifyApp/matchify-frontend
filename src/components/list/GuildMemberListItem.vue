<template>
  <router-link class="guild-member-list-item list-item" :to="`/guild/${member.guildId}`">
    <div class="icon-name-end">
      <div class="icon-name">
        <div class="icon" :style="`background-image: url('https://cdn.discordapp.com/icons/${member.guildId}/${member.guildIcon}.${member.guildIcon.startsWith('a_') ? 'gif' : 'png'}?size=256');`"></div>
        <div class="guild-nickname">
          <div class="name">{{ member.guildName }}</div>
          <div class="nickname">
            {{ member.memberNickname }}
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>

export default {
  props: {
    member: {
      type: Object,
      required: true
    },
  },
}
</script>

<style lang="scss" scoped>
.guild-member-list-item {
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

      .guild-nickname {
        .name {
          opacity: 0.9;
          font-weight: 600;
          font-size: 22px;
        }

        .nickname {
          font-size: 14px;
          opacity: 0.5;
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

}

@media screen and (max-width: 1100px) {

  .guild-member-list-item {
    --icon-size: 32px;

    .icon-name-end {

      .guild-nickname {
        .name {
          font-size: 16px;
        }

        .nickname {
          font-size: 12px;
        }
      }
    }
  }

}
</style>