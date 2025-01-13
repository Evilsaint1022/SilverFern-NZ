// events/shrimp.js

const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

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

// Path to the shrimp cooldown JSON file
const cooldownFilePath = path.join(__dirname, '../../Utilities/Timers/Shrimp_cooldown.json');

// Load cooldown data from the JSON file (if exists)
let cooldowns = {};
if (fs.existsSync(cooldownFilePath)) {
    cooldowns = JSON.parse(fs.readFileSync(cooldownFilePath, 'utf-8'));
}

// Cooldown duration (3 minutes = 180,000 ms)
const cooldownAmount = 3 * 60 * 1000;

module.exports = {
    name: 'messageCreate', // Event name to listen for new messages
    once: false, // Set to false to allow multiple messages to trigger this event
    async execute(message) {
        // Check if the message content contains the word "shrimp" (case-insensitive)
        if (message.content.toLowerCase().includes('shrimp')) {
            if (message.author.bot) return; // Don't let the bot react to its own messages
            
            const now = Date.now();

            if (cooldowns[message.author.id]) {
                const expirationTime = cooldowns[message.author.id] + cooldownAmount;
                
                if (now < expirationTime) {
                    // The message is in cooldown. React with the shrimp emoji and exit.
                    try {
                        await message.react(ShrimpEmojiId);
                    } catch (error) {
                        console.error('Failed to add reaction during cooldown:', error);
                    }
                    return;
                }
            }

            // Add or update the cooldown for the user
            cooldowns[message.author.id] = now;

            try {
                // Select a random GIF from the shrimpList
                const randomGif = shrimpList[Math.floor(Math.random() * shrimpList.length)];
                // React with the custom emoji
                await message.react(ShrimpEmojiId);
                // Send the selected GIF to the channel
                await message.channel.send(randomGif);
            } catch (error) {
                console.error('Failed to process shrimp message:', error);
            }

            // Save the updated cooldown data to the JSON file
            fs.writeFileSync(cooldownFilePath, JSON.stringify(cooldowns, null, 2), 'utf-8');
        }
    },
};
