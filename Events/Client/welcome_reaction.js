// events/welcome_reaction.js

const { Client, GatewayIntentBits } = require('discord.js');

const Chat_Id = '1155691009792028779';
const WelcomeEmojiId = '1163199160791613544';

module.exports = {
    name: 'messageCreate', // Event name to listen for new messages
    once: false, // Change to false to allow multiple messages to trigger this
    async execute(message) {
        // Check if the message is from the specific channel
        if (message.channel.id === Chat_Id) {
            // Convert message content to lowercase and check if it contains the word "welcome"
            if (message.content.toLowerCase().includes('welcome')) {
                try {
                    // React with the custom emoji
                    await message.react(WelcomeEmojiId);
                } catch (error) {
                    console.error('Failed to add reaction:', error);
                }
            }
        }
    },
};
