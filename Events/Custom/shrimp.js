// events/shrimp.js

const { Client, GatewayIntentBits } = require('discord.js');

const ShrimpEmojiId = '1174330756722606110';

// List of GIF URLs (replace these with actual GIF URLs you want to use)
const shrimpList = [
    'https://giphy.com/gifs/shrimp-pikaole-spookyshrimp-4nFsICN3bS4GjlfY0q', // Shrimp GIF 1
    'https://giphy.com/gifs/fuckthatsdelicious-26FPnO9LTlARwYpLW', // Shrimp GIF 2
    'https://giphy.com/gifs/shremp-shrempin-shremps-1MiXzJYBYqK5PBUzes', // Shrimp GIF 3
    'https://giphy.com/gifs/shrempin-shrimp-shremp-shremps-w29QPkDsiOMxquLJFN', // Shrimp GIF 4
    'https://giphy.com/gifs/shrempin-shrimp-shremp-shremps-yTUex0jIFw5hKQovLU', // Shrimp GIF 5
    'https://giphy.com/gifs/shrempin-shrimp-shremp-shremps-THuO7JQbmVdpEZnrMw', // Shrimp GIF 6
];

// Map to store the cooldowns
const cooldowns = new Map();

module.exports = {
    name: 'messageCreate', // Event name to listen for new messages
    once: false, // Set to false to allow multiple messages to trigger this event
    async execute(message) {
        // Check if the message content contains the word "shrimp" (case-insensitive)
        if (message.content.toLowerCase().includes('shrimp')) {
            if (message.author.bot) return; // Don't let the bot react to its own messages
            
            const now = Date.now();
            const cooldownAmount = 20 * 2000; // 10 seconds in milliseconds

            if (cooldowns.has(message.author.id)) {
                const expirationTime = cooldowns.get(message.author.id) + cooldownAmount;
                
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 2000;
                    return message.reply(`Shrimply Shrimptastic`);
                }
            }

            // Add or update the cooldown for the user
            cooldowns.set(message.author.id, now);

            try {
                // Select a random GIF from the shrimpList
                const randomGif = shrimpList[Math.floor(Math.random() * shrimpList.length)];
                // React with the custom emoji
                await message.react(ShrimpEmojiId);
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
