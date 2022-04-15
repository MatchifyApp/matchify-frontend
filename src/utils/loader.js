import events from "../events";

export const loadQueue = new Map();

export function showLoader(msg="...") {
  let key = Math.round(Math.random() * 1000000);
  loadQueue.set(key, msg);
  events.emit("loader:show");
  return () => {
    loadQueue.delete(key);
    if (!loadQueue.size) {
      events.emit("loader:hide");
    }
  }
}