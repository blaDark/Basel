module.exports = {
  name: 'daily',
  cooldown: 20,
  async execute(message, args, client) {
    message.reply({content: "Daily has been moved to https://probot.io/daily", allowedMentions: { replieduser: false }});
  },
};
