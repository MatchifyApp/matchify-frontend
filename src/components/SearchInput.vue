<template>
<div class="search-input">
  <div class="search">
    <i class="ri-search-line"></i>
    <input type="text" :value="value" @input="$emit('input', $event.target.value)">
  </div>
</div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default() { return ""; }
    },
  }
}
</script>

<style lang="scss" scoped>
.search-input {
  .search {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    font-size: 32px;

    background-color: rgb(var(--vs-gray-2));
    padding: 8px;
    border-radius: 16px;

    input {
      font-size: 30px;
      margin-left: 8px;
      background: transparent;
      outline: none;
      border: none;
      color: white;
      width: 100%;
    }
  }
}
</style>