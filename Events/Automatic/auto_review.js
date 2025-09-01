const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Path to the JSON file for storing cooldown data
const cooldownFilePath = path.resolve(__dirname, '../../Utilities/Timers/auto_review_cooldown.json');

function readCooldowns() {
  try {
    if (!fs.existsSync(cooldownFilePath)) {
      fs.writeFileSync(cooldownFilePath, JSON.stringify({}));
    }
    const data = fs.readFileSync(cooldownFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Failed to read cooldown file: ${error}`);
    return {};
  }
}

function writeCooldowns(cooldowns) {
  try {
    fs.writeFileSync(cooldownFilePath, JSON.stringify(cooldowns, null, 2));
  } catch (error) {
    console.error(`Failed to write to cooldown file: ${error}`);
  }
}

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    // Ignore messages from bots
    if (message.author.bot) return;

    const targetChannelId = '1155691009792028779';
    const cooldownTime = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    const now = Date.now();

    // Read cooldowns from the JSON file
    const cooldowns = readCooldowns();

    // Check if the message is in the target channel
    if (message.channel.id !== targetChannelId) return;

    // Check if the channel is on cooldown
    if (cooldowns[targetChannelId] && now - cooldowns[targetChannelId] < cooldownTime) {
      return; // Still on cooldown, do nothing
    }

    // Send the review message
    try {
      await message.channel.send("Give us an anonymous review:\nhttps://dyno.gg/form/fb130c8d");

      // Update the cooldown for this channel
      cooldowns[targetChannelId] = now;
      writeCooldowns(cooldowns);
    } catch (error) {
      console.error(`Failed to send review message in channel ${targetChannelId}:`, error);
    }
  },
};
