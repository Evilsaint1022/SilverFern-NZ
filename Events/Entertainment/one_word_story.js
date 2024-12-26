const { Events } = require('discord.js');
let lastUser = null;  // Store the last member who sent a valid message
const targetChannelID = '1318004687680835614';  // Channel ID to listen for

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    try {
      // Ignore messages from bots and ensure the message is from the target channel
      if (message.author.bot || message.channel.id !== targetChannelID) return;

      // Check if the message contains a single word with only alphabetic characters
      const messageContent = message.content.trim();
      const isSingleWord = /^[a-zA-Z]+$/.test(messageContent);

      // If this member has already sent a message
      if (lastUser === message.author.id) {
        // Delete the message and send a warning if they try to send another
        await message.delete();

        const tempMessage = await message.channel.send(`${message.author}, you can only send one message at a time. Please wait for someone else to send a message first.`);

        // Ensure the message gets deleted after 10 seconds (10000 milliseconds)
        setTimeout(async () => {
          try {
            await tempMessage.delete();
          } catch (error) {
            console.error('Failed to delete temporary message:', error);
          }
        }, 10000);

        return;
      }

      // If the message is a valid single word, update the last user
      if (isSingleWord) {
        lastUser = message.author.id;
      }

      // If it's not a single word, delete the message and warn the user
      if (!isSingleWord) {
        await message.delete();

        const tempMessage = await message.channel.send(`${message.author}, please send only a single word using alphabetic characters.`);

        // Ensure the message gets deleted after 10 seconds (10000 milliseconds)
        setTimeout(async () => {
          try {
            await tempMessage.delete();
          } catch (error) {
            console.error('Failed to delete temporary message:', error);
          }
        }, 10000);
      }

    } catch (error) {
      console.error('Error in message event:', error);
      // Handle the error gracefully (no DM sending here)
    }
  },
};
