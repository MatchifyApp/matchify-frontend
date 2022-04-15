<template>
  <div class="matchify-icon" :style="`--s: ${size}px`">
    <div class="line" :style="`--h: ${sizes[0]}`"></div>
    <div class="line" :style="`--h: ${sizes[1]}`"></div>
    <div class="line" :style="`--h: ${sizes[2]}`"></div>
    <div class="line" :style="`--h: ${sizes[3]}`"></div>
    <div class="line" :style="`--h: ${sizes[4]}`"></div>
    <div class="line" :style="`--h: ${sizes[5]}`"></div>
  </div>
</template>

<style lang="scss" scoped>
.matchify-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--s);
  color: white;
  --h: 1;

  .line {
    margin-right: .5em;
    width: .75em;
    background-color: currentColor;
    border-radius: .75em;
    box-shadow: 0px .0983em .1475em rgba(0, 0, 0, 0.1), inset 0px -0.0983em .1229em rgba(0, 0, 0, 0.25);
    transition: height 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .line:last-child {
    margin-right: 0;
  }

  .line:nth-child(1) {height: calc(var(--h) * 2.0625em);}
  .line:nth-child(2) {height: calc(var(--h) * 3.625em);}
  .line:nth-child(3) {height: calc(var(--h) * 2.875em);}
  .line:nth-child(4) {height: calc(var(--h) * 4.625em);}
  .line:nth-child(5) {height: calc(var(--h) * 3.625em);}
  .line:nth-child(6) {height: calc(var(--h) * 2.0625em);}
}
</style>

<script>
export default {
  props: {
    sizes: {
      type: Array,
      default() {
        return [1, 1, 1, 1, 1, 1]
      }
    },
    size: {
      type: Number,
      default() {
        return 16;
      }
    }
  }
}
</script>
