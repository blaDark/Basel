const { Client, Collection, MessageEmbed } = require('discord.js');
const { c } = require('./aliases/c') 
require('events').EventEmitter.defaultMaxListeners = 9999999; 
const Intent = 32767
const client = new Client({
intents: Intent, 
});

const { prefix, color, owners } = require('./src/config');
const { readdirSync } = require('fs');
const EventEmitter = require('events');
const events = readdirSync('events');

client.commands = new Collection();
client.prefix = prefix;
client.db = require('pro.db');
client.color = color;
client.events = new EventEmitter();

process.on("unhandledRejection", error => {
  return console.log(error) 
});

events.filter(e => e.endsWith('.js')).forEach(event => {
  event = require(`./events/${event}`)(client);
  event.once ? client.once(event.name, event.execute) : client.on(event.name, event.execute);
});

events.filter(e => !e.endsWith('.js')).forEach(folder => {
  readdirSync('events/' + folder).forEach(event => {
    event = require(`./events/${folder}/${event}`)(client);
    event.once ? client.once(event.name, event.execute) : client.on(event.name, event.execute);
  });
});

for (let folder of readdirSync('commands').filter(folder => !folder.includes('.'))) {
  for (let file of readdirSync('commands/' + folder).filter(f => f.endsWith('.js'))) {    
    let command = require(`./commands/${folder}/${file}`);
    command.category = folder;
    client.commands.set(command.name, command);
  }
}
  
      
client.login(process.env.token)
c(client);
require('./src/util');