// withdraw.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Withdraw points from your Bank to your Wallet.')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('The amount of points to withdraw.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const { user } = interaction;
        const walletFolder = path.resolve(__dirname, '../../Utilities/Economy/Currency/Balance');
        const bankFolder = path.resolve(__dirname, '../../Utilities/Economy/Currency/Bank');
        const walletFilePath = path.join(walletFolder, `${user.username}.txt`);
        const bankFilePath = path.join(bankFolder, `${user.username}.txt`);
        
        // Get the withdrawal amount from the command options
        let withdrawAmount = interaction.options.getInteger('amount');

        // Ensure folders exist
        if (!fs.existsSync(walletFolder)) {
            fs.mkdirSync(walletFolder, { recursive: true });
        }
        if (!fs.existsSync(bankFolder)) {
            fs.mkdirSync(bankFolder, { recursive: true });
        }

        // Read the user's Bank balance
        let bankBalance = 0;
        try {
            if (fs.existsSync(bankFilePath)) {
                bankBalance = parseInt(fs.readFileSync(bankFilePath, 'utf8'), 10);
            }
        } catch (error) {
            console.error('Error reading bank balance:', error);
        }

        // If withdrawAmount is 0, withdraw all bank points
        if (withdrawAmount === 0) {
            withdrawAmount = bankBalance;
        }

        // Check if the user has enough balance in the Bank or if the withdrawal amount is valid
        if (bankBalance < withdrawAmount || withdrawAmount <= 0) {
            return interaction.reply('You do not have enough points in your Bank to withdraw or you entered an invalid amount.');
        }

        // Read the user's Wallet balance
        let walletBalance = 0;
        try {
            if (fs.existsSync(walletFilePath)) {
                walletBalance = parseInt(fs.readFileSync(walletFilePath, 'utf8'), 10);
            }
        } catch (error) {
            console.error('Error reading wallet balance:', error);
        }

        // Deduct the withdrawal amount from the Bank and add to the Wallet
        bankBalance -= withdrawAmount;
        walletBalance += withdrawAmount;

        // Save the updated balances
        fs.writeFileSync(bankFilePath, bankBalance.toString());
        fs.writeFileSync(walletFilePath, walletBalance.toString());

        // Create an embed message
        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF) // White color
            .setTitle(`**__${user.username}'s Withdrawal__**`)
            .setDescription(`Successfully withdrew **${withdrawAmount} Ferns🌿** from your Bank to your Wallet.`)
            .addFields(
                { name: '🌿Wallet Balance', value: `${walletBalance} Ferns`, inline: true },
                { name: '🏦Bank Balance', value: `${bankBalance} Ferns`, inline: true }
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: 'Your Wallet is growing!' });

        // Respond with the embed
        return interaction.reply({ embeds: [embed] });
    },
};
