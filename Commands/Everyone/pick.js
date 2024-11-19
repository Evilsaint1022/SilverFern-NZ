const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
const fernDropEvent = require('../../Events/Client/ferndrop'); // Import the fern drop event to access the fern message

// Path to the balance files
const balanceFolder = path.resolve(__dirname, '../../Economy/Currency/Balance');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pick')
        .setDescription('Pick up the dropped ferns for points!'),

    async execute(interaction) {
        const fernDropData = fernDropEvent.getFernDropData(); // Access the current fern drop data
        const fernMessage = fernDropData.message;

        // Check if a fern drop message exists
        if (!fernMessage || fernMessage.channel.id !== interaction.channel.id) {
            return interaction.reply({
                content: '**No ferns to pick up right now!**',
                ephemeral: true,
            });
        }

        // Ensure the interaction happens before the message is deleted
        if (!fernMessage.deletable) {
            return interaction.reply({
                content: '**🌿 You are too late!**',
                ephemeral: true,
            });
        }

        // Update the user's balance
        const targetUser = interaction.user;
        const balanceFilePath = path.join(balanceFolder, `${targetUser.username}.txt`);

        try {
            let balance = 0;

            // Read the existing balance if the file exists
            if (fs.existsSync(balanceFilePath)) {
                const balanceData = fs.readFileSync(balanceFilePath, 'utf-8');
                balance = parseInt(balanceData, 10) || 0;
            }

            // Generate a random amount between 100 and 500
            const randomAmount = Math.floor(Math.random() * (500 - 100 + 1)) + 100;

            // Increment the balance
            balance += randomAmount;

            // Save the new balance
            fs.writeFileSync(balanceFilePath, balance.toString(), 'utf-8');

            // Reply to the user
            await interaction.reply({
                content: `** 🌿 You picked up ${balance} Ferns! **`,
                ephemeral: false,
            });

            // Clear the fern message to prevent further picking
            fernDropData.message = null;
        } catch (error) {
            console.error('Error updating balance:', error);
            return interaction.reply({
                content: 'Something went wrong while picking up the ferns.',
                ephemeral: true,
            });
        }
    },
};
