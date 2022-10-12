const { MessageEmbed, Collection } = require('discord.js');
const ms = require('ms');
const cooldowns = new Collection();

module.exports.c = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.content.startsWith("c") || message.content.startsWith("C")) {
    if (cooldowns.has(message.author.id)) {
      return message.reply({ content: `**${message.author.username}**, Cool down (**${ms(cooldowns.get(message.author.id) - Date.now()).replace("s", "")} seconds** left)`, allowedMentions: { replieduser: false }}).then((msg) => {
       setTimeout(() => msg.delete(), 2500).catch(() => 404)})
          } else {
      cooldowns.set(message.author.id, Date.now() + 20000);
      setTimeout(() => {
      cooldowns.delete(message.author.id);
        }, 20000);
      }
      const data = client.db;
      const args = message.content.split(" ")
      args[0] = message.content.split(" ")[1];
      args[1] = message.content.split(" ")[2];
      args[2] = message.content.split(" ")[3];
      let user = message.author;
      if (args[0]) user = client.users.cache.get(args[0].toUserId()) || client.users.cache.find(u => u.username.toLowerCase() === args[0].toLocaleLowerCase())
      if (!user) return message.reply({
        embeds: [new MessageEmbed().setColor(client.color).setDescription(`**⁉️ | ${message.author.username}, I can't find ${args[0]}!**`)],
        allowedMentions: {
          repliedUser: false
        }
      });
      if (user.bot) return message.reply({
        content: `:thinking:  | **${message.author.username}**, bots do not have credits!`,
        allowedMentions: {
          repliedUser: false
        }
      });
      const amount = args[1];
      let credits = data.get(`credits_${user.id}`) || 0;
      if (!amount) {
        if (user.id === message.author.id) {
          return message.reply({
            content: `:bank: | ** ${message.author.username}, your account balance is \`$${credits}\`.**`,
            allowedMentions: {
              repliedUser: false
            }
          })
        } else {
          return message.reply({
            content: `** ${user.username} :credit_card: balance is \`$${credits}\`.**`,
            allowedMentions: {
              repliedUser: false
            },
          });
        }
      } else {
        if (user.id === message.author.id) return message.reply({
          content: `:bank: | ** ${user.username}, your account balance is \`$${credits}\`.**`,
          allowedMentions: {
            repliedUser: false
          },
        })
        credits = data.get(`credits_${message.author.id}`) || 0;
        if (isNaN(amount) || parseInt(amount) != amount || parseInt(amount) < 1) return message.reply({
          content: `** :interrobang: | ${message.author.username}, type the credit you need to transfer!**`,
          allowedMentions: {
            replieduser: false
          }
        });
        let tax = Math.floor(parseInt(amount - amount / parseInt(100 / 5)))
        if (tax === 0) tax = 1
        let number = (Math.random() * (99999 - 10000) + 10000);
        if (credits < amount) return message.reply({
          content: `** :thinking: | ${message.author.username}, Your balance is not enough for that!**`,
          allowedMentions: {
            replieduser: false
          }
        })
        let msg = await message.reply({
          content: `** ${message.author.username}, Transfer Fees: \`${amount - tax}\`, Amount :\`$${tax}\`** \n  type these numbers to confirm :`,
          files: [await require('../src/managers/createCaptcha')(parseInt(number))],
          allowedMentions: {
            replieduser: false
          }
        })
        const filter = m => m.author.id === message.author.id
        const collector = message.channel.createMessageCollector({
          filter,
          time: 15000,
          max: 1
        });
        collector.on('collect', (m) => {
          if (m.content.includes(`${parseInt(number)}`)) {
            msg.delete().catch(() => 404);
            m.delete().catch(() => 404);
            message.channel.send(`**:moneybag: | ${message.author.username}, has transferred \`$${tax}\` to ${user}**`)
            user.send(`:atm:  |  Transfer Receipt \`\`\`You have received $${tax} from user ${message.author.username} (ID: ${message.author.id}) Reason: No reason provided\`\`\` `)
            data.add(`credits_${user.id}`, parseInt(tax));
            data.subtract(`credits_${message.author.id}`, parseInt(amount));
            return;
          } else {
            msg.delete().catch(() => 404);
          }
        })
        collector.on("end", () => {
          msg.delete().catch(() => 404);
        })
      }
    }
  })
}
