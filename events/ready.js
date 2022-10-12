const express = require('express');
const app = express();

module.exports = (client) => ({
  name: "ready",
  once: false,
  async execute() {
    
    console.log(`${client.user.username} Ready !!`);
    client.user.setActivity("/help");
    //لو عايز تغير اسم وصورة البوت 
    //client.user.setUsername("ProBot ✨").catch(() => 404)
    //client.user.setAvatar("https://images-ext-2.discordapp.net/external/9YypUckVSLonoKmFV5L2Sn9xLV00Bk_qn2xrgzw6v0Q/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/282859044593598464/156a0d2872579f1ffcaa5d2127239bfd.png").catch(() => 404)
    app.listen(3000);
  },
});
