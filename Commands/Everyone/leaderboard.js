const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription("Displays The Leaderboard"),

    async execute(interaction) {
        const bankFolder = path.resolve(__dirname, '../../Utilities/Economy/Currency/Balance');

        if (!fs.existsSync(bankFolder)) {
            return await interaction.reply("The Bank folder does not exist. Please set up the economy system first.");
        }

        const balances = fs.readdirSync(bankFolder)
            .filter(file => file.endsWith('.txt'))
            .map(file => {
                const username = path.basename(file, '.txt');
                const balance = parseInt(fs.readFileSync(path.join(bankFolder, file), 'utf8'), 10) || 0;
                return { username, balance };
            })
            .sort((a, b) => b.balance - a.balance);

        const username = interaction.user.username;
        const userBalanceEntry = balances.find(entry => entry.username === username);
        const userRank = userBalanceEntry ? balances.indexOf(userBalanceEntry) + 1 : 'Unranked';

        const itemsPerPage = 10;
        const totalPages = Math.ceil(balances.length / itemsPerPage);
        let currentPage = 0;

        const generateLeaderboardEmbed = (page) => {
            const start = page * itemsPerPage;
            const leaderboard = balances.slice(start, start + itemsPerPage)
                .map((entry, index) => {

                    // Fetch member by username, without including IDs
                    return `**    \n__${start + index + 1}.__  ${entry.username} \n♢  🌿${entry.balance}**`;
                })
                .join('\n');

            return new EmbedBuilder()
                .setTitle("**╭─── The Leaderboard ───╮**")
                .setDescription((leaderboard || "No users found.") + `\n\n**╰─────[ Your Rank: #${userRank} ]─────╯**`)
                .setColor(0xFFFFFF)
                .setThumbnail(interaction.guild.iconURL())
                .setFooter({ text: `Page ${page + 1} of ${totalPages}`, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();
        };

        const row = () => new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('previous').setLabel('Previous').setStyle(ButtonStyle.Primary).setDisabled(currentPage === 0),
                new ButtonBuilder().setCustomId('stop').setLabel('Stop').setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Primary).setDisabled(currentPage === totalPages - 1)
            );

        const message = await interaction.reply({ embeds: [generateLeaderboardEmbed(currentPage)], components: [row()], fetchReply: true });

        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

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

            await buttonInteraction.update({ embeds: [generateLeaderboardEmbed(currentPage)], components: [row()] });
        });

        collector.on('end', () => {
            if (message.editable) {
                message.edit({ components: [] });
            }
        });
    }
};
