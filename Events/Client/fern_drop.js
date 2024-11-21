const { Events } = require('discord.js');
const { EventEmitter } = require('events');

// EventEmitter instance to manage fern drop events
const fernDropEvent = new EventEmitter();

// Channel ID where ferns will be dropped and activity tracked
const dropChannelId = '1155691009792028779';
const activityCooldown = 1000; // 1 second in milliseconds for activity tracking
const messageCooldown = 90 * 1000; // 1.5 minutes cooldown for dropping messages

let lastActivityTime = Date.now();
let lastMessageDropTime = 0; // Tracks the time of the last fern drop
let isFernDropScheduled = false; // Flag to check if a fern drop is scheduled

// Function to track activity in the drop channel
const trackActivity = (message) => {
    if (message.channel.id === dropChannelId) {
        lastActivityTime = Date.now();
    }
};

module.exports = {
    name: Events.MessageCreate, // Trigger on new message creation

    async execute(message) {
        // Ignore messages from bots or in channels other than the drop channel
        if (message.author.bot || message.channel.id !== dropChannelId) return;

        // Track activity in the specified channel
        trackActivity(message);

        // Prevent scheduling another fern drop if one is already scheduled
        if (isFernDropScheduled) return;

        // Check if the cooldown period for dropping ferns has passed
        const currentTime = Date.now();
        if (currentTime - lastMessageDropTime < messageCooldown) return;

        // Schedule a fern drop after the activity cooldown
        isFernDropScheduled = true;
        setTimeout(async () => {
            const timeSinceLastActivity = Date.now() - lastActivityTime;

            // Drop ferns only if the activity cooldown has been met
            if (timeSinceLastActivity >= activityCooldown) {
                // Random chance to drop ferns (100% probability)
                if (Math.random() < 1.0) {
                    try {
                        const channel = await message.client.channels.fetch(dropChannelId);
                        if (channel) {
                            const fernMessage = await channel.send('**🌿 SilverFern Has Dropped Some Ferns!**\n*use the **`/pick`** Command to pick them up!*');
                            
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

                        // Update the last fern drop time
                        lastMessageDropTime = Date.now();
                    } catch (error) {
                        console.error('Error sending fern drop message:', error);
                    }
                }
            }

            // Reset the scheduling flag
            isFernDropScheduled = true; // Allow another drop to be scheduled
        }, activityCooldown);
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
