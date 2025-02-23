const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// File path for the XP JSON file
const xpFilePath = path.resolve(__dirname, '../../Utilities/Economy/Levels/xp.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('editlevel')
        .setDescription('Edit the level of a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose level you want to edit.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('The new level value.')
                .setRequired(true)),
    async execute(interaction) {

        const requiredRole = '1155726483080347688';

        // Check if the user has the required role
        if (!interaction.member.roles.cache.has(requiredRole)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const newLevel = interaction.options.getInteger('level');

        // Validate the level
        if (newLevel < 0) {
            return interaction.reply({ content: 'Level must be a positive integer.', ephemeral: true });
        }

        // Read and update the XP file
        try {
            const xpData = JSON.parse(fs.readFileSync(xpFilePath, 'utf8'));

            // Update or initialize the user's level
            if (!xpData[user.id]) {
                xpData[user.id] = { level: newLevel, xp: 0 };
            } else {
                xpData[user.id].level = newLevel;
            }

            // Write the changes back to the file
            fs.writeFileSync(xpFilePath, JSON.stringify(xpData, null, 2));

            // Reply with success
            await interaction.reply({
                content: `**Successfully updated ${user.tag}'s level to ${newLevel}.**`,
                ephemeral: false
            });
        } catch (err) {
            console.error('Error updating level:', err);
            await interaction.reply({
                content: 'An error occurred while updating the level. Please try again later.',
                ephemeral: true
            });
        }
    }
};
