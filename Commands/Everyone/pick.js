const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
const { fernDropEvent } = require('../../Events/Client/fern_drop'); // Import the fern_drop.js event

// Path to the balance files
const balanceFolder = path.resolve(__dirname, '../../Utilities/Economy/Currency/Balance');

// Track users who have picked the fern for the current drop
const pickedUsers = new Set();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pick')
        .setDescription('Pick up the dropped ferns for points!'),

    async execute(interaction) {
        try {
            // Access the current fern drop data
            const fernDropData = fernDropEvent.fernDropData;
            const fernMessage = fernDropData?.message;

            // Validate fern message
            if (!fernMessage || fernMessage.channel.id !== interaction.channel.id) {
                return interaction.reply({
                    content: '**🌿 No ferns to pick up right now!**',
                    ephemeral: true,
                });
            }

            // Ensure the fern message is still valid
            if (!fernMessage.deletable) {
                return interaction.reply({
                    content: '**🌿 You are too late! The ferns have disappeared.**',
                    ephemeral: true,
                });
            }

            const member = interaction.member;

            // Check if the user has already picked the fern
            if (pickedUsers.has(member.id)) {
                return interaction.reply({
                    content: '**🌿 You have already picked this fern!**',
                    ephemeral: true,
                });
            }

            // Add the user to the picked set
            pickedUsers.add(member.id);

            // Update the user's balance
            const balanceFilePath = path.join(balanceFolder, `${member.user.username}.txt`);

            let balance = 0;

            if (fs.existsSync(balanceFilePath)) {
                const balanceData = fs.readFileSync(balanceFilePath, 'utf-8');
                balance = parseInt(balanceData, 10) || 0;
            }

            const pointsEarned = Math.floor(Math.random() * 41) + 10; // Random points between 10 and 50
            balance += pointsEarned;

            fs.writeFileSync(balanceFilePath, balance.toString(), 'utf-8');

            // Respond to the user with an embed
            await interaction.reply({
                embeds: [
                    {
                        title: '**🌿 Ferns Picked!**',
                        description: `*You picked **${pointsEarned}** Ferns!*`,
                        color: 0xFFFFFF,
                    },
                ],
                ephemeral: false,
            });

            // Delete the reply after 20 seconds
            setTimeout(async () => {
                try {
                    const message = await interaction.fetchReply();
                    await message.delete();
                } catch (error) {
                    console.error('Error deleting the pick message:', error);
                }
            }, 20000); // 20 seconds
        } catch (error) {
            console.error('Error in pick command execution:', error);
            await interaction.reply({
                content: '**🌿 Something went wrong while picking up the ferns.**',
                ephemeral: true,
            });
        }
    },
};

// Reset the picked users when a new fern drop occurs
fernDropEvent.on('newDrop', () => {
    pickedUsers.clear();
});
