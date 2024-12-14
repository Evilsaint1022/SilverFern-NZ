// events/wnd.js

const { Client, GatewayIntentBits } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    once: false, // Listen for the event only once
    async execute( message) {
        // Ignore messages from the bot itself
        if (message.author.bot) return;

        try {
            // Check if the message is 'Wnd'
            if (message.content.toLowerCase().includes('wnd')) {
                await message.react('💤');  // React with the 💤 emoji
            }
        } catch (error) {
            console.error('Error occurred in Wnd event:', error);
        }
    }
};
