const { Events } = require('discord.js');
const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');

// EventEmitter instance to manage fern drop events
const fernDropEvent = new EventEmitter();

// Filepath for storing the cooldown timer
const timerFilePath = path.resolve(__dirname, '../../Utilities/Timers/FernDrop_cooldown.json');
const cooldownDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
const dropChannelId = '1155691009792028779';

let isProcessing = false; // Lock to prevent concurrent execution

// Load the last drop time from the JSON file
function getLastDropTime() {
    try {
        if (!fs.existsSync(timerFilePath)) return 0; // If file doesn't exist, return 0
        const data = JSON.parse(fs.readFileSync(timerFilePath, 'utf-8'));
        return data.lastMessageDropTime || 0; // Return timestamp or 0 if undefined
    } catch (error) {
        console.error('Error reading timer file:', error);
        return 0; // Fallback to 0 in case of errors
    }
}

// Save the last drop time to the JSON file
function saveLastDropTime(timestamp) {
    try {
        const data = { lastMessageDropTime: timestamp };
        fs.writeFileSync(timerFilePath, JSON.stringify(data, null, 4));
    } catch (error) {
        console.error('Error writing to timer file:', error);
    }
}

module.exports = {
    name: Events.MessageCreate, // Trigger on new message creation

    async execute(message) {
        // Ignore messages from bots or in channels other than the drop channel
        if (message.author.bot || message.channel.id !== dropChannelId) return;

        const currentTime = Date.now();
        const lastMessageDropTime = getLastDropTime();

        // Check if the cooldown period for dropping ferns has passed
        if (currentTime - lastMessageDropTime < cooldownDuration || isProcessing) return;

        // Set the lock to prevent concurrent execution
        isProcessing = true;

        try {
            // Send the fern drop message
            const channel = await message.client.channels.fetch(dropChannelId);
            if (channel) {
                const fernMessage = await channel.send(
                    '**🌿 SilverFern Has Dropped Some Ferns!**\n*Use the **/pick** Command to pick them up!*'
                );

                // Emit the fern drop event with the fern message
                fernDropEvent.triggerNewDrop(fernMessage);

                // Schedule deletion of the fern message after 40 seconds
                setTimeout(() => {
                    if (fernMessage.deletable) {
                        fernMessage.delete().catch(console.error);
                        fernDropEvent.clearFernDrop(); // Clear the current fern data
                    }
                }, 40000); // 40 seconds
            }

            // Update the last drop time in the JSON file
            saveLastDropTime(currentTime);
        } catch (error) {
            console.error('Error sending fern drop message:', error);
        } finally {
            // Release the lock
            isProcessing = false;
        }
    },
};

// Add methods to the EventEmitter for easier usage
fernDropEvent.triggerNewDrop = function (message) {
    this.fernDropData = { message }; // Store the fern message
    this.emit('newDrop', this.fernDropData); // Emit the event
};

fernDropEvent.clearFernDrop = function () {
    this.fernDropData = null; // Clear the fern drop data
    this.emit('clearDrop'); // Emit an event indicating the fern drop is cleared
};

// Export the EventEmitter for use in other parts of the bot
module.exports.fernDropEvent = fernDropEvent;
