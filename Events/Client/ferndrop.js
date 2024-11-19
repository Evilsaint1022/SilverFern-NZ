const { Events } = require('discord.js');

// Channel ID where ferns will be dropped
const dropChannelId = '1155711970985660446';
const activityCooldown = 1 * 1000; // 1 seconds in milliseconds for activity tracking
const messageCooldown = 2 * 60 * 1000; // 2 minutes cooldown for dropping messages
let lastActivityTime = Date.now();
let lastMessageDropTime = 0; // Tracks the time of the last fern drop
let fernDropTimeout; // To store the timeout ID and clear it if necessary
let isFernDropScheduled = false; // Flag to check if a fern drop is scheduled

// Shared storage for the fern message
let fernDropData = { message: null }; // Use an object to store the message reference

// Track last message time to check activity
const trackActivity = () => {
    lastActivityTime = Date.now(); // Update activity time whenever a message is received
};

module.exports = {
    name: Events.MessageCreate, // Trigger on new message creation

    async execute(message) {
        // Track chat activity in the specified channel
        if (message.channel.id === dropChannelId) {
            trackActivity(); // Update last activity time when there's a message in the correct channel
        }

        // If fern drop is already scheduled, prevent scheduling again
        if (isFernDropScheduled) {
            return;
        }

        // Enforce a 30-second cooldown between fern drops
        const currentTime = Date.now();
        if (currentTime - lastMessageDropTime < messageCooldown) {
            return;
        }

        // Set a timeout to drop ferns after the defined period of activity
        fernDropTimeout = setTimeout(async () => {
            const timeSinceLastActivity = Date.now() - lastActivityTime;

            // Only drop ferns if there has been activity for the defined period
            if (timeSinceLastActivity >= activityCooldown) {

                // Random chance to drop ferns (adjust the probability as needed)
                const chance = Math.random();
                if (chance < 0.8) { // 80% chance of dropping ferns
                    try {
                        const channel = await message.client.channels.fetch(dropChannelId);
                        if (channel) {
                            const fernMessage = await channel.send(`**🌿SilverFern Has Dropped Some Ferns!**`);

                            // Store the fern message for /pick command to access
                            fernDropData.message = fernMessage;

                            // Delete the message after 40 seconds
                            setTimeout(() => {
                                if (fernMessage.deletable) {
                                    fernMessage.delete().catch(console.error);
                                    fernDropData.message = null; // Clear the reference once deleted
                                }
                            }, 40000); // 40 seconds delay

                            // Update the time of the last fern drop
                            lastMessageDropTime = Date.now();
                        }
                    } catch (error) {
                        console.error('Error sending fern drop message:', error);
                    }
                }
            }

            // Reset flag after the timeout is executed
            isFernDropScheduled = false;
        }, activityCooldown); // Cooldown is now 5 seconds for activity

        // Set the flag to indicate a fern drop is scheduled
        isFernDropScheduled = true;
    },

    // Expose the fern drop data for /pick command
    getFernDropData: () => fernDropData,
};
