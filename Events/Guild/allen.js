// events/allen.js

const { Client, GatewayIntentBits } = require('discord.js');

// List of GIF URLs (replace these with actual GIF URLs you want to use)
const fartlist = [
    'https://tenor.com/iKwH7bWxQoH.gif', // Fart Gif
];

module.exports = {
    name: 'messageCreate',
    once: false, // Listen for the event only once
    async execute(message) {
        // Check if the message content contains the word "fart" (case-insensitive)
        if (message.content.toLowerCase().includes('fart')) {
            if (message.author.bot) return; // Don't let the bot react to its own messages
            try {
                // Select a random GIF from the fartlist
                const randomGif = fartlist[Math.floor(Math.random() * fartlist.length)];
                 // Send the selected GIF to the channel
                await message.channel.send(randomGif);
            } catch (error) {
                console.error('Failed to add reaction:', error);
            }
        }
    },
};
