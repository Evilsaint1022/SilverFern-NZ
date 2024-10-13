// events/potato.js

const { Client, GatewayIntentBits } = require('discord.js');

// List of Potato GIF URLs (replace these with actual GIF URLs you want to use)
const potatoList = [
    'https://giphy.com/gifs/potate-lil-lilpotates-Q6DF3Lu9NL0M2JcIwE', // Potato GIF 1
    'https://giphy.com/gifs/potate-lilpotates-lilpotate-YLUmyoCHNLQBgnFUZg', // Potato GIF 2
    'https://giphy.com/gifs/potate-lil-lilpotates-nv3Vj74IOphzyfflxx', // Potato GIF 3
    'https://giphy.com/gifs/lilpotates-lil-potate-lilpotate-EJ0pBQ5GUpggqa5ksW', // Potato GIF 4
    'https://giphy.com/gifs/potato-lilpotate-potates-l3mzxjHqU784ZLE0Do', // Potato GIF 5
    'https://giphy.com/gifs/lil-potate-lilpotates-lilpotate-H9FTM37sNQrMUjSheq', // Potato GIF 6
    'https://giphy.com/gifs/potate-lilpotates-lilpotate-3udFjfcPIK3drvk7kx', // Potato GIF 7
    'https://giphy.com/gifs/lil-potates-potate-lilpotates-lilpotate-OFlyPwkf6KpxVQi39f', // Potato GIF 8
    'https://giphy.com/gifs/lil-potates-potate-lilpotates-lilpotate-jQX6EFSlGdQrYFhboz', // Potato GIF 9
    'https://giphy.com/gifs/potate-lil-potates-lilpotate-QoDRpjZZa27WlA05S3', // Potato GIF 10
    'https://giphy.com/gifs/lilpotates-lilpotate-lil-potate-QOw6G0V9kH9OqbkSru', // Potato GIF 11
    'https://giphy.com/gifs/stare-intense-lil-potate-aIPpAkIAEJ3UqditEZ', // Potato GIF 12
];

module.exports = {
    name: 'messageCreate', // Event name to listen for new messages
    once: false, // Set to false to allow multiple messages to trigger this event
    async execute(message) {
        // Check if the message content contains the word "potato" (case-insensitive)
        if (message.content.toLowerCase().includes('potato')) {
            if (message.author.bot) return; // Don't let the bot react to its own messages
            try {
                // Select a random GIF from the potatoList
                const randomGif = potatoList[Math.floor(Math.random() * potatoList.length)];
                // Send the selected GIF to the channel
                await message.channel.send(randomGif);
            } catch (error) {
                console.error('Failed to send potato GIF:', error);
            }
        }
    },
};
