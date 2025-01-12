const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignore bot messages to prevent loops
        if (message.author.bot) return;

        try {
            // Check if the message includes the word "roger" (case-insensitive)
            if (message.content.toLowerCase().includes('roger')) {
                await message.react('🏍️');  // React with the 🏍️ emoji
            }
        } catch (error) {
            console.error('Error occurred in Roger event:', error);
        }
    },
};
