const axios = require('axios');

const dogApiKey = process.env.DOG_API_KEY;

module.exports = {
  data: {
    name: 'dog',
    description: 'Get a random dog image from The Dog API',
  },
  async execute(interaction) {
    const { user, channel, guild } = interaction;
    const timestamp = new Date().toLocaleTimeString();
    const guildIconUrl = guild.iconURL({ dynamic: true, format: 'png' }) || '';

    try {
      const { data } = await axios.get('https://api.thedogapi.com/v1/images/search', {
        headers: { 'x-api-key': dogApiKey },
      });

      const dogImageUrl = data[0].url;
      const messageContent = `Here's a random dog for you! \n${dogImageUrl}`;

      await interaction.reply({ content: messageContent });

      const logChannel = guild.channels.cache.get(process.env.Logs_ID);
      if (logChannel) {
        logChannel.send({
          embeds: [{
            color: 0x020202,
            title: `**__Dog Application Command__ -【${timestamp}】**`,
            thumbnail: { url: guildIconUrl },
            description: `**User: ${user.tag}\nCommand: /Dog\nMessage: ${messageContent}\nChannel: ${channel.name}**`,
          }],
        }).catch(error => console.error("Error sending message:", error));
      } else {
        console.error("Log channel not found.");
      }
    } catch (error) {
      console.error('Error fetching dog image:', error);
      await interaction.reply({
        content: 'Oops! Something went wrong while fetching the dog image.',
        ephemeral: true,
      });
    }
  },
};

