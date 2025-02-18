// level.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Check your current level or another user\'s level.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to check the level of')
                .setRequired(false)
        ),

    async execute(interaction) {
        const xpFilePath = path.resolve(__dirname, '../../Utilities/Economy/Levels/xp.json');

        try {
            const xpData = JSON.parse(fs.readFileSync(xpFilePath, 'utf8'));
            const targetUser = interaction.options.getUser('user') || interaction.user;
            const { id: targetUserId, username } = targetUser;
            const userData = xpData[targetUserId];

            if (!userData) {
                return interaction.reply(`${username} hasn't gained any XP yet. They need to participate to earn XP!`);
            }

            const { level: userLevel, xp: userXp } = userData;
            const nextLevelXp = userLevel * 350 + 350;

            const embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle(`**__${username}'s Level__**`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Level', value: `${userLevel}`, inline: true },
                    { name: 'XP', value: `${userXp} / ${nextLevelXp}`, inline: true }
                )
                .setFooter({ text: 'Keep earning XP to level up!' });

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error reading xp.json file:', error);
            return interaction.reply('There was an error accessing level data. Please try again later.');
        }
    },
};

