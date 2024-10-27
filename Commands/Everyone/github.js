const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('Get the link to the GitHub repository!'),

  async execute(interaction) {
    const { guild, user, channel } = interaction;
    const logChannel = guild.channels.cache.get(process.env.Logs_ID); // Get log channel from environment variable
    const timestamp = new Date().toLocaleTimeString(); // Get the current timestamp
    const guildIconUrl = guild.iconURL() || ''; // Get the guild icon URL
    let messageContent = ''; // Initialize message content variable

    messageContent = `Check out the GitHub repository:\nhttps://github.com/Evilsaint1022/SilverFern-NZ`;
    interaction.reply({ content: messageContent });

    // Log the command in the log channel
    if (logChannel) {
      logChannel.send({
        embeds: [{
          color: 0x020202, // Dark color for the embed
          title: `**__GitHub Application Command__ -【${timestamp}】**`, // Updated title to "GitHub"
          thumbnail: { url: guildIconUrl }, // Display guild icon as thumbnail
          description: `**User: ${user.tag}\nCommand: /GitHub\nMessage: ${messageContent}\nChannel: ${channel.name}**`, // Updated description with "GitHub"
        }],
      }).catch(error => {
        console.error("Error sending message:", error); // Error handling if sending the log fails
      });
    } else {
      console.error("Log channel not found."); // Error if log channel doesn't exist
    }
  },
};
