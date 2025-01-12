const { Events } = require('discord.js');

// Cooldown map to store the last sent time for the channel
const cooldowns = new Map();

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    // Ignore messages from bots
    if (message.author.bot) return;

    const targetChannelId = '1155691009792028779';
    const cooldownTime = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    const now = Date.now();

    // Check if the message is in the target channel
    if (message.channel.id !== targetChannelId) return;

    // Check if the channel is on cooldown
    if (cooldowns.has(targetChannelId)) {
      const lastSent = cooldowns.get(targetChannelId);
      if (now - lastSent < cooldownTime) {
        return; // Still on cooldown, do nothing
      }
    }

    // Send the review message
    try {
      await message.channel.send("Give us an anonymous review:\nhttps://dyno.gg/form/fb130c8d");

      // Update the cooldown for this channel
      cooldowns.set(targetChannelId, now);
    } catch (error) {
      console.error(`Failed to send review message in channel ${targetChannelId}:`, error);
    }
  },
};
