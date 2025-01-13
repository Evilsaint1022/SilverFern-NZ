// events/allen.js

const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// List of GIF URLs (replace these with actual GIF URLs you want to use)
const fartlist = [
    'https://tenor.com/iKwH7bWxQoH.gif', // Fart Gif
];

// Path to the cooldown JSON file
const cooldownFilePath = path.join(__dirname, '../../Utilities/Timers/allen_fart_cooldown.json');

// Function to load cooldown data from the file
const loadCooldowns = () => {
    try {
        const data = fs.readFileSync(cooldownFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading cooldown data:', error);
        return {}; // Return an empty object if the file doesn't exist or there's an error
    }
};

// Function to save cooldown data to the file
const saveCooldowns = (cooldowns) => {
    try {
        fs.writeFileSync(cooldownFilePath, JSON.stringify(cooldowns, null, 2));
    } catch (error) {
        console.error('Error saving cooldown data:', error);
    }
};

module.exports = {
    name: 'messageCreate',
    once: false, // Listen for the event only once
    async execute(message) {
        // Check if the message content contains the word "fart" (case-insensitive)
        if (message.content.toLowerCase().includes('fart')) {
            if (message.author.bot) return; // Don't let the bot react to its own messages

            const now = Date.now();
            const cooldownAmount = 3 * 60 * 1000; // 3 minutes in milliseconds

            // Load the current cooldowns from the file
            const cooldowns = loadCooldowns();

            // Add reaction before checking cooldown
            try {
                await message.react('💨'); // React with a fart emoji (you can change this to another emoji if needed)
            } catch (error) {
                console.error('Failed to add reaction:', error);
            }

            // Check if the user is in cooldown
            if (cooldowns.hasOwnProperty(message.author.id)) {
                const expirationTime = cooldowns[message.author.id] + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000; // Convert to seconds
                    return;
                }
            }

            // Add or update the cooldown for the user
            cooldowns[message.author.id] = now;

            // Save the updated cooldown data to the file
            saveCooldowns(cooldowns);

            // Send the selected fart GIF only after the cooldown period has passed
            try {
                // Select a random GIF from the fartlist
                const randomGif = fartlist[Math.floor(Math.random() * fartlist.length)];
                // Send the selected GIF to the channel
                await message.channel.send(randomGif);
            } catch (error) {
                console.error('Failed to send fart gif:', error);
            }

            // Remove the cooldown after the cooldown period
            setTimeout(() => {
                // Reload the cooldown data, remove the user, and save it back
                const updatedCooldowns = loadCooldowns();
                delete updatedCooldowns[message.author.id];
                saveCooldowns(updatedCooldowns);
            }, cooldownAmount);
        }
    },
};
