export function getUserAvatar(user) {
  return user.userAvatar ? `https://cdn.discordapp.com/avatars/${user.userId}/${user.userAvatar}.${user.userAvatar.startsWith('a_') ? 'gif' : 'png'}` : `https://cdn.discordapp.com/embed/avatars/${Number(user.userTag.split('#')[1]) % 5}.png`
}