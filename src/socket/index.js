import io from "socket.io-client";

// const socket = io(window.webpackHotUpdate ? "http://localhost:80" : (window.location.protocol + "//" + window.location.host));
const socket = io("https://matchify.org/", {
  reconnection: false
});

socket.on("disconnect", () => {
  setTimeout(() => {
    window.location.reload();
  }, 5000);
})

export default socket;