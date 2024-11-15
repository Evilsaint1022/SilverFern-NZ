// level.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Check your current level'),

    async execute(interaction) {
        const xpFilePath = path.resolve(__dirname, '../../Economy/Levels/xp.json');

        // Load user XP data
        let xpData;
        try {
            xpData = JSON.parse(fs.readFileSync(xpFilePath, 'utf8'));
        } catch (error) {
            console.error('Error reading xp.json file:', error);
            return interaction.reply('There was an error accessing level data. Please try again later.');
        }

        const userId = interaction.user.id;

        // Check if user data exists
        if (!xpData[userId]) {
            return interaction.reply("You haven't gained any XP yet. Start participating to earn XP!");
        }

        const userLevel = xpData[userId].level;
        const userXp = xpData[userId].xp;

        // Respond with the user's current level and XP
        return interaction.reply(`**${interaction.user}, you are currently at level ${userLevel} with ${userXp} XP.**`);
    },
};

