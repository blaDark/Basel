const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'set',
  owners: true,
  async execute(message, args, client) {
    switch (args[0]) {
      case "credits":
        const data = client.db;
         if (!args[1]) return 
         if (!args[2]) return 

         let user = client.users.cache.get(args[1].toUserId()) || client.users.cache.find(u => u.username.toLowerCase() === args[1].toLocaleLowerCase())
         if (!user) return message.reply({embeds: [new MessageEmbed().setColor(client.color).setDescription(`**⁉️ | ${message.author.username}, I can't find ${args[1]}!**`)], allowedMentions: { repliedUser: false}});                      
         if (user.bot) return message.reply({content: `:thinking:  | **${message.author.username}**, bots do not have credits!`, allowedMentions: { repliedUser: false }});
         const credits = data.get(`credits_${user.id}`) || 0; 
         if(args[2].includes("-")) {
         let amount = args[2].replace("-", '')
         if (isNaN(amount) || parseInt(amount) != amount || parseInt(amount) < 1) return message.reply({content: `** :interrobang: | ${message.author.username}, type the credit you need to removed!**`, allowedMentions: { replieduser: false }})
         if (credits < amount) return message.reply({content: `**❌ I can't remove credits**`, allowedMentions: { replieduser: false }}).catch(() => {});
         data.subtract(`credits_${user.id}`, parseInt(amount));                      
         return message.channel.send("done remove..");
        } else {
         let amount = args[2];
         if (isNaN(amount) || parseInt(amount) != amount || parseInt(amount) < 1) return message.reply({content: `** :interrobang: | ${message.author.username}, type the credit you need to gived!**`, allowedMentions: { replieduser: false }})
         data.add(`credits_${user.id}`, parseInt(args[2]));
         return message.channel.send("done give..");
      } 
        break;
    }
  },
};
