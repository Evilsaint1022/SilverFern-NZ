// daily.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dailyCooldown = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const rewardAmount = 100; // Points to give

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily points!'),

    async execute(interaction) {
        const { user, guild, channel } = interaction;
        const folder = path.resolve(__dirname, '../../Economy/Currency/Balance');
        const claimDataFilePath = path.resolve(__dirname, '../../Economy/Points/claims.json');

        const timestamp = new Date().toLocaleTimeString();
        const guildIconUrl = guild.iconURL({ dynamic: true, format: 'png' }) || '';

        // Ensure the balance folder exists
        try {
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }
        } catch (error) {
            console.error('Error ensuring balance folder exists:', error);
            return interaction.reply('There was an error ensuring the balance folder exists. Please try again later.');
        }

        // Check if claims.json exists, if not create it
        let claimData;
        try {
            if (!fs.existsSync(claimDataFilePath)) {
                claimData = {}; // Initialize claimData as an empty object
                fs.writeFileSync(claimDataFilePath, JSON.stringify(claimData, null, 2)); // Create the file with the empty object
            } else {
                claimData = JSON.parse(fs.readFileSync(claimDataFilePath, 'utf8'));
            }
        } catch (error) {
            console.error('Error reading or creating claims file:', error);
            return interaction.reply('There was an error accessing daily claim data. Please try again later.');
        }

        const userId = user.id;
        const currentTime = Date.now();

        // Check if the user has claimed today
        if (claimData[userId]) {
            const lastClaimTime = claimData[userId].lastClaimTime;
            const timeSinceLastClaim = currentTime - lastClaimTime;

            if (timeSinceLastClaim < dailyCooldown) {
                // Calculate the remaining time
                const timeRemaining = dailyCooldown - timeSinceLastClaim;
                const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
                const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

                return interaction.reply(`**You have already claimed your daily points!**\n*(Please wait **${hours} hours ${minutes} minutes** before claiming again.)*`);
            }
        }

        // Read user's balance file
        const balanceFilePath = path.join(folder, `${user.username}.txt`);
        let balance = 0;

        try {
            if (fs.existsSync(balanceFilePath)) {
                balance = parseInt(fs.readFileSync(balanceFilePath, 'utf8'), 10);
            }
        } catch (error) {
            console.error('Error reading balance file:', error);
            return interaction.reply('There was an error reading your balance file. Please try again later.');
        }

        // Add the reward points to the balance
        balance += rewardAmount;

        // Save the updated balance
        try {
            fs.writeFileSync(balanceFilePath, balance.toString());
        } catch (error) {
            console.error('Error saving balance file:', error);
            return interaction.reply('There was an error updating your balance. Please try again later.');
        }

        // Update the claim data
        try {
            if (!claimData[userId]) {
                claimData[userId] = { points: 0, lastClaimTime: 0 };
            }
            claimData[userId].lastClaimTime = currentTime;

            // Save the updated claim data
            fs.writeFileSync(claimDataFilePath, JSON.stringify(claimData, null, 2));
        } catch (error) {
            console.error('Error updating claim data:', error);
            return interaction.reply('There was an error updating your daily claim data. Please try again later.');
        }

        // Create an embed message
        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF) // Green color
            .setTitle(`${user.username}'s Daily Points`)
            .setDescription(`You have claimed your daily reward of **${rewardAmount} Ferns**!`)
            .addFields(
                { name: 'Total Balance', value: `${balance} Ferns`, inline: true }
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: 'Come back tomorrow for more!' })
            .setTimestamp();

        // Reply with the embed
        await interaction.reply({ embeds: [embed] });
    }
};