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

<style>
.item-list {

}
</style>