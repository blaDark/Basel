const { MessageEmbed, Collection } = require('discord.js');
const { prefix, owners } = require('../src/config');
const cooldowns = new Collection();

module.exports = client => ({
  name: 'messageCreate',
  once: false,
  async execute(message) {
    
    if (message.author.bot) return;
    client.prefix = prefix;
    
    if (!message.content.startsWith(client.prefix) /*&& message.content.split(' ')[0].substr(1).toLowerCase() != 'help'*/) return;
    const args = message.content.slice(prefix.length).replace(/\٠/g, '0').replace(/\١/g, '1').replace(/\٢/g, '2').replace(/\٣/g, '3').replace(/\٤/g, '4').replace(/\٥/g, '5').replace(/\٦/g, '6').replace(/\٧/g, '7').replace(/\٨/g, '8').replace(/\٩/g, '9').split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    
    if (command.owners && !owners.includes(message.author.id)) return;
   
      if (!command.owners) {
      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
      }
      let now = Date.now();
      let timestamps = cooldowns.get(command.name);
      let cooldownAmount = (command.cooldown || 3) * 1000;
      if (timestamps.has(message.author.id)) {
        let expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
          let timeLeft = (expirationTime - now ) / 1000;
          if (!cooldowns.has(message.author.id)) {
            cooldowns.set(message.author.id, true);
            return message.reply({content: `**${message.author.username}**, Cool down (**${timeLeft.toFixed(0)} seconds** left)`, allowedMentions: { repliedUser: false }})
              .then(msg => {    
              setTimeout(async () => msg.delete(), 2500).catch(async () => null) 
              setTimeout(async () => message.delete(), 2500).catch(async () => null)
             }).catch(async () => {
           });
          } else return;
        }
      }
      timestamps.set(message.author.id, now);
      setTimeout(() => {
        timestamps.delete(message.author.id);
        cooldowns.delete(message.author.id);
      }, cooldownAmount);
    }
    if (command.admin && !message.member.permissions.has(command.permissions)) return;
    if (command.args && !args.length) {
      args[0] = command.name;
      try {
        client.commands.get('help').execute(message, args, client);
      } catch (err) {
        console.error(err);
      }
      return;
    }
    try {
      command.execute(message, args, client);
    } catch (err) {
      return console.error(err);
    }
  }
});  