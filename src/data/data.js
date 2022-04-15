import chillout from "chillout";

const EVERYONE_PREMIUM = true;

export default {
  currentUser: null,
  async awaitCurrentUser() {
    if (localStorage.getItem("token")) {
      await chillout.waitUntil(() => this.currentUser ? chillout.StopIteration : null);
      return this.currentUser;
    }
    return null;
  },
  get isUserPremium() {
    return (this.currentUser.userPremiumUntil > Date.now()) || EVERYONE_PREMIUM;
  }
}