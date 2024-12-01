const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('Get the link to the GitHub repository!'),

  async execute(interaction) {
    const { guild, user, channel } = interaction;
    const logChannel = guild.channels.cache.get(process.env.Logs_ID);
    const timestamp = new Date().toLocaleTimeString();
    const guildIconUrl = guild.iconURL() || '';
    const messageContent = 'Check out the GitHub repository:\nhttps://github.com/Evilsaint1022/SilverFern-NZ';

    await interaction.reply({ content: messageContent });

    if (logChannel) {
      logChannel.send({
        embeds: [{
          color: 0x020202,
          title: `**__GitHub Application Command__ -【${timestamp}】**`,
          thumbnail: { url: guildIconUrl },
          description: `**User: ${user.tag}\nMessage: ${messageContent}\nChannel: ${channel.name}**`,
        }],
      }).catch(console.error);
    } else {
      console.error("Log channel not found.");
    }
  },
};

