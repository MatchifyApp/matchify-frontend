<template>
  <div class="login-page"></div>
</template>

<script>
import socket from "../socket"
export default {
  created() {
    socket.emit("auth:get:url", { host: window.location.host }, ({data})=>{
      window.location.replace(data);
    });
  }
}
</script>