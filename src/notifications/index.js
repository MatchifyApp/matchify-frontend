import socket from "@/socket";
import NotificationTypes from "./NotificationTypes";
import Push from "push.js";
import { getUserAvatar } from "@/utils/getUserAvatar";
import _ from "lodash";

socket.on("current-user:notification", _.debounce(({ data: { type, args } }) => {
  switch (type) {
    case NotificationTypes.SYSTEM_MESSAGE: {
      Push.create("System Message", {
        body: args.message,
        icon: "https://matchify.org/img/icons/logo.png",
        timeout: 4000
      })
      break;
    }
    case NotificationTypes.COMMENT_CREATE: {
      Push.create(`${args.user.userTag} sent a comment`, {
        icon: getUserAvatar(args.user),
        body: args.content,
        timeout: 4000
      });
      break;
    }
    case NotificationTypes.COMMENT_DELETE: {
      Push.create(`${args.user.userTag} deleted a comment`, {
        icon: getUserAvatar(args.user),
        body: args.content,
        timeout: 4000
      });
      break;
    }
    case NotificationTypes.LIKE_CREATE: {
      Push.create(`${args.user.userTag} liked you`, {
        icon: getUserAvatar(args.user),
        timeout: 4000
      });
      break;
    }
    case NotificationTypes.LIKE_DELETE: {
      Push.create(`${args.user.userTag} unliked you`, {
        icon: getUserAvatar(args.user),
        timeout: 4000
      });
      break;
    }
  }
}, 4000));