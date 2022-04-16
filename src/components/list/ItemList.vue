<template>
  <div class="item-list">
    <div class="title-container">
      <div class="title">
        {{title}}
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
  }
}
</script>

<style lang="scss" scoped>
.item-list {
  width: 100%;

  .title-container {
    width: 100%;
    padding: 16px;
    padding-left: 32px;

    .title {
      font-size: 24px;
      font-weight: bold;
    }
  }

  .content {
    height: 350px;
    overflow: auto;
    contain: content;
    counter-reset: list-item 1;

    .list-item {
      position: relative;
      counter-increment: list-item 1;
      padding-left: 32px;

      &::before {
        position: absolute;
        font-family: 'General Sans';
        content: counter(list-item);
        left: 0px;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0.5;
        font-weight: 400;
        font-size: 18px;
        text-align: right;
      }
    }
  }
}
</style>