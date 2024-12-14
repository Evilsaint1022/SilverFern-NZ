// events/allen.js

const { Client, GatewayIntentBits } = require('discord.js');

// List of GIF URLs (replace these with actual GIF URLs you want to use)
const fartlist = [
    'https://tenor.com/iKwH7bWxQoH.gif', // Fart Gif
];

// Map to store the cooldowns
const cooldowns = new Map();

module.exports = {
    name: 'messageCreate',
    once: false, // Listen for the event only once
    async execute(message) {
        // Check if the message content contains the word "fart" (case-insensitive)
        if (message.content.toLowerCase().includes('fart')) {
            if (message.author.bot) return; // Don't let the bot react to its own messages

            const now = Date.now();
            const cooldownAmount = 20 * 2000; // 10 seconds in milliseconds

            if (cooldowns.has(message.author.id)) {
                const expirationTime = cooldowns.get(message.author.id) + cooldownAmount;
                
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 2000;
                    return message.reply(`Allen is Stinky.`);
                }
            }

            // Add or update the cooldown for the user
            cooldowns.set(message.author.id, now);

            try {
                // Select a random GIF from the fartlist
                const randomGif = fartlist[Math.floor(Math.random() * fartlist.length)];
                 // Send the selected GIF to the channel
                await message.channel.send(randomGif);
            } catch (error) {
                console.error('Failed to add reaction:', error);
            }

            // Remove the cooldown after the cooldown period
            setTimeout(() => cooldowns.delete(message.author.id), cooldownAmount);

        }
    },
};
