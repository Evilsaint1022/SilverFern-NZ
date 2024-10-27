const axios = require('axios');

// The Dog API Key (Use environment variables or config file for security)
const dogApiKey = process.env.DOG_API_KEY;

module.exports = {
  data: {
    name: 'dog',
    description: 'Get a random dog image from The Dog API',
  },
  async execute(interaction) {
    const { user, channel, guild } = interaction; // Extract user, channel, and guild info
    const timestamp = new Date().toLocaleTimeString(); // Get the current timestamp
    const guildIconUrl = guild.iconURL({ dynamic: true, format: 'png' }) || ''; // Get the guild's icon URL (fallback if null)
    let messageContent = ''; // Initialize message content variable

    try {
      const response = await axios.get('https://api.thedogapi.com/v1/images/search', {
        headers: {
          'x-api-key': dogApiKey,
        },
      });

      const dogImageUrl = response.data[0].url;
      messageContent = `Here's a random dog for you! 🐕\n${dogImageUrl}`;

      // Reply to the interaction with the dog image
      await interaction.reply({
        content: messageContent,
      });

      // Log the command in the log channel
      const logChannel = guild.channels.cache.get(process.env.Logs_ID); // Get log channel from environment variable
      if (logChannel) {
        logChannel.send({
          embeds: [{
            color: 0x020202, // Dark color for the embed
            title: `**__Dog Application Command__ -【${timestamp}】**`, // Updated title to "Dog"
            thumbnail: { url: guildIconUrl }, // Display guild icon as thumbnail
            description: `**User: ${user.tag}\nCommand: /Dog\nMessage: ${messageContent}\nChannel: ${channel.name}**`, // Updated description with "Dog"
          }],
        }).catch(error => {
          console.error("Error sending message:", error); // Error handling if sending the log fails
        });
      } else {
        console.error("Log channel not found."); // Error if log channel doesn't exist
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
