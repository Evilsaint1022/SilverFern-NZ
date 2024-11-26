const { Events } = require('discord.js');
const { EventEmitter } = require('events');

// EventEmitter instance to manage fern drop events
const fernDropEvent = new EventEmitter();

// Channel ID where ferns will be dropped
const dropChannelId = '1155691009792028779';
const cooldownDuration = 5 * 60 * 1000; // Fixed cooldown: 5 minutes

let lastMessageDropTime = 0; // Tracks the time of the last fern drop

module.exports = {
    name: Events.MessageCreate, // Trigger on new message creation

    async execute(message) {
        // Ignore messages from bots or in channels other than the drop channel
        if (message.author.bot || message.channel.id !== dropChannelId) return;

        const currentTime = Date.now();

        // Check if the cooldown period for dropping ferns has passed
        if (currentTime - lastMessageDropTime < cooldownDuration) return;

        try {
            // Send the fern drop message
            const channel = await message.client.channels.fetch(dropChannelId);
            if (channel) {
                const fernMessage = await channel.send(
                    '**🌿 SilverFern Has Dropped Some Ferns!**\n*use the **`/pick`** Command to pick them up!*'
                );

                // Emit the fern drop event with the fern message
                fernDropEvent.triggerNewDrop(fernMessage);

                // Delete the fern message after 40 seconds
                setTimeout(() => {
                    if (fernMessage.deletable) {
                        fernMessage.delete().catch(console.error);
                        fernDropEvent.clearFernDrop(); // Clear the current fern data
                    }
                }, 40000); // 40 seconds
            }

            // Update the last drop time
            lastMessageDropTime = currentTime;
        } catch (error) {
            console.error('Error sending fern drop message:', error);
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
