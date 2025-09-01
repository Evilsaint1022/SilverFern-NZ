const { Events } = require('discord.js'); // Importing events from discord.js

// Object to store the last user who sent a message
let lastUser = null;

module.exports = {
  name: Events.MessageCreate, // Listen to the message creation event
  async execute(message) {
    // Ignore bot messages
    if (message.author.bot) return;

    // Check if the message is in the specified channel
    if (message.channel.id === '1318005435575570502') {
      
      // Check if the message is from the same user as the last message
      if (lastUser === message.author.id) {
        // Delete the message if it is from the same user
        await message.delete();

        // Send a warning message in the channel
        const tempMessage = await message.channel.send(`<@${message.author.id}>, You must wait for another user to send a message before you can send another one.`);
        
        // Sync back to the previous message's author if a temp message is sent
        // Make sure we aren't syncing to bot messages
        if (lastUser && lastUser !== message.author.id) {
          // Sync to the previous message's author by updating the lastUser
          lastUser = message.author.id;
        }

        // Set a timeout to delete the temporary message after 10 seconds
        setTimeout(() => {
          tempMessage.delete().catch(() => {}); // Safely catch errors if the message cannot be deleted
        }, 10000); // 10000 milliseconds = 10 seconds
        return; // Stop further execution
      }

      // Update lastUser to the current user if it's not the same as the previous user
      lastUser = message.author.id;

      // Check if the message starts with '^banned'
      if (!message.content.startsWith('^banned')) {
        // Delete the message if it doesn't start with '^banned'
        await message.delete();
        
        // Send a temporary message in the channel
        const tempMessage = await message.channel.send(`<@${message.author.id}>, Your message was deleted because it didn’t start with ^banned.`);
        
        // Sync back to the previous message's author if a temp message is sent
        if (lastUser && lastUser !== message.author.id) {
          // Sync to the previous message's author by updating the lastUser
          lastUser = message.author.id;
        }

        // Set a timeout to delete the temporary message after 10 seconds
        setTimeout(() => {
          tempMessage.delete().catch(() => {}); // Safely catch errors if the message cannot be deleted
        }, 10000); // 10000 milliseconds = 10 seconds
      }
    }
  }
};
