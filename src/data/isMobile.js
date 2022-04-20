export default {
  get isMobile() {
    return matchMedia("screen and (max-width: 1100px)").matches;
  }
};