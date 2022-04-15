<template>
  <div class="login-callback-page">
    <div class="bottom">
      <div class="container">
        <div class="icon">
          <svg v-if="!error && !loading" viewBox="0 0 127.14 96.36">
            <g>
              <path style="fill:currentColor;" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
            </g>
          </svg>
          <i v-if="loading" class="ri-loader-5-line rotating"></i>
          <i v-if="error && !loading" class="ri-error-warning-line"></i>
        </div>
        <div class="info">
          <div class="title">
            {{ error ? `Error!` : (loading ? "Logging in.." : "Success!") }}
          </div>
          <div v-if="user || error" class="subtitle">
            {{ error ? error : user.userTag }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes rotating {
  0% {
    transform: rotateZ(360deg);
  }

  100% {
    transform: rotateZ(0deg);
  }
}

.rotating {
  animation: rotating 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
}

.login-callback-page {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;

  .bottom {
    display: flex;
    margin-top: 50px;
    margin-right: 50px;
    align-items: center;
    justify-content: flex-start;
    width: 100%;

    .container {
      display: flex;
      width: 100%;
      justify-content: center;
      align-items: center;

      .icon {
        width: 50px;
        min-width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        svg, i {
          width: 50px;
          font-size: 50px;
        }
      }
      .info {
        margin-left: 8px;
        width: 100%;
        display: flex;
        flex-direction: column;

        .title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>

<script>
import socket from "../socket"
import userData from "@/data/user";

export default {
  data() {
    return {
      error: "",
      loading: true,
      user: null
    }
  },
  created() {
    const code = this.$route.query.code;
    const state = this.$route.query.state;
    
    if (!code || !state) {
      this.$router.push("/");
      return;
    }

    socket.emit("auth:callback", {code, state}, async (callbackResponse)=>{
      if (!callbackResponse.ok) {
        this.error = callbackResponse.error;
        this.loading = false;
        return;
      }
      
      let user = await userData.loginUser(callbackResponse.data.token);

      this.user = user;
      this.loading = false;
      setTimeout(()=>{
        this.$router.push("/");
      }, 1000)
    })
  }
}
</script>