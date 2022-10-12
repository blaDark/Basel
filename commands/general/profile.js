const { MessageAttachment, MessageEmbed } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  name: 'profile',
  cooldown: 20,
  async execute(message, args, client) {
    
    await message.channel.sendTyping()
    let user = message.author;
    if (args[0]) user = client.users.cache.get(args[0].toUserId()) || client.users.cache.find(u => u.username.toLowerCase() === args[0].toLocaleLowerCase())
    if (!user) return message.reply({embeds: [new MessageEmbed().setColor(client.color).setDescription(`🔍 | **${message.author.username}**, the user could not be found.`)], allowedMentions: { repliedUser: false }}); 
    if (user.bot) return message.reply({content: `:robot:  **| ${message.author.username}**, bots do not have ranks!`, allowedMentions: {repliedUser: false }}); 
    const canvas = createCanvas(400, 400);
    const ctx = canvas.getContext('2d')
    const background = await loadImage(`https://api.probot.io/profile/${user.id}`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  
    const attach = new MessageAttachment(canvas.toBuffer(), 'profile.png');
    message.channel.send({ files: [attach] })
  },
};
