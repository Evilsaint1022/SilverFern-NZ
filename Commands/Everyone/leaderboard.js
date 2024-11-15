const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription("Displays The Leaderboard"),
    
    async execute(interaction) {
        const bankFolder = path.resolve(__dirname, '../../Economy/Bank');

        if (!fs.existsSync(bankFolder)) {
            return await interaction.reply("The Bank folder does not exist. Please set up the economy system first.");
        }

        const balanceFiles = fs.readdirSync(bankFolder).filter(file => file.endsWith('.txt'));
        const balances = [];

        for (const file of balanceFiles) {
            const username = path.basename(file, '.txt');
            const balanceFilePath = path.join(bankFolder, file);
            const balance = parseInt(fs.readFileSync(balanceFilePath, 'utf8'), 10) || 0;
            balances.push({ username, balance });
        }

        balances.sort((a, b) => b.balance - a.balance);
        const username = interaction.user.username;
        const userBalanceEntry = balances.find(entry => entry.username === username);
        const userRank = userBalanceEntry ? balances.indexOf(userBalanceEntry) + 1 : 'Unranked';

        // Pagination setup
        const itemsPerPage = 10;
        const totalPages = Math.ceil(balances.length / itemsPerPage);
        let currentPage = 0;

        const generateLeaderboardEmbed = (page) => {
            const start = page * itemsPerPage;
            const end = start + itemsPerPage;
            const pageBalances = balances.slice(start, end);

            const leaderboard = pageBalances.map((entry, index) => 
                `**    \n__${start + index + 1}.__  ${entry.username}\n♢  🌿${entry.balance}**`
            ).join('\n');

            return new EmbedBuilder()
                .setTitle("**╭─── 🌿│Leaderboard ───╮**")
                .setDescription(
                    (leaderboard || "No users found.") +
                    "\n\n" +
                    `**╰─────[ Your Rank: #${userRank} ]─────╯**`
                )
                .setColor(0xFFFFFF)
                .setThumbnail(interaction.guild.iconURL())
                .setFooter({ text: `Page ${page + 1} of ${totalPages}`, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();
        };

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === 0),
                new ButtonBuilder()
                    .setCustomId('stop')
                    .setLabel('Stop')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === totalPages - 1)
            );

        const message = await interaction.reply({ embeds: [generateLeaderboardEmbed(currentPage)], components: [row], fetchReply: true });

        // Create a collector with a 10-second timeout
        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 10000 // 10 seconds
        });

        collector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.user.id !== interaction.user.id) {
                return buttonInteraction.reply({ content: "You're not allowed to use these buttons.", ephemeral: true });
            }

            if (buttonInteraction.customId === 'previous' && currentPage > 0) {
                currentPage--;
            } else if (buttonInteraction.customId === 'next' && currentPage < totalPages - 1) {
                currentPage++;
            } else if (buttonInteraction.customId === 'stop') {
                await buttonInteraction.update({ components: [] });
                collector.stop();
                return;
            }

            await buttonInteraction.update({
                embeds: [generateLeaderboardEmbed(currentPage)],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('previous')
                                .setLabel('Previous')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === 0),
                            new ButtonBuilder()
                                .setCustomId('stop')
                                .setLabel('Stop')
                                .setStyle(ButtonStyle.Danger),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('Next')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === totalPages - 1)
                        )
                ]
            });
        });

        // Remove buttons when the collector ends after 10 seconds
        collector.on('end', () => {
            if (message.editable) {
                message.edit({ components: [] });
            }
        });
    }
};
