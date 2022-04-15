<template>
  <div class="like-button" @click="$emit('click')">
    <i :class="`ri-heart-3-${state ? 'fill' : 'line'}`"></i>
    <p>{{count}}</p>
  </div>
</template>

<script>
export default {
  name: 'LikeButton',
  props: {
    count: {
      type: Number,
      default: 0
    },
    state: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.like-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 20px;

  background: rgba(255, 164, 224, 0.1);
  border: 2px solid rgba(255, 164, 224, 0.1);
  box-sizing: border-box;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: rgba(255, 164, 224, 0.15);
    border: 2px solid rgba(255, 164, 224, 0.15);

    i, p {
      color: #fc83d4;
    }
  }

  i {
    color: #FFA4E0;
    font-size: 24px;
  }

  p {
    color: #FFA4E0;
    font-size: 18px;
    margin-left: 8px;
  }
}
</style>