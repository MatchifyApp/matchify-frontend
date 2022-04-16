import socket from "@/socket";
import chillout from "chillout";

export default {
  currentUser: null,
  userId: null,
  async awaitCurrentUser() {
    if (localStorage.getItem("token")) {
      await chillout.waitUntil(() => this.currentUser ? chillout.StopIteration : null);
      return this.currentUser;
    }
    return null;
  },
  async loginUser(token) {
    if (this.currentUser) throw "Already logged in";
    let loginResponse = await new Promise(r => socket.emit("auth:login", { token: token }, r));
    if (!loginResponse.ok) throw loginResponse.error;
    localStorage.setItem("token", token);
    this.currentUser = loginResponse.data;
    this.userId = this.currentUser.userId;

    socket.on("user:event", ({ data }) => {
      if (data.userId != this.userId) return;
      this.currentUser = { ...(this.currentUser || {}), ...data.user };
    });

    socket.emit("user:subscribe", { userId: loginResponse.data.userId });

    return loginResponse.data
  },
  logoutUser() {
    this.currentUser = null;
    localStorage.removeItem("token");
  }
};