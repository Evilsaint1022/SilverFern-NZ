const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Check the current status of Discord services.'),
    async execute(interaction) {
        await interaction.deferReply(); // Defer to account for API call delay

        try {
            // Fetch the Discord status from the API
            const response = await axios.get('https://discordstatus.com/api/v2/summary.json');
            const data = response.data;

            // Main status description
            const overallStatus = data.status.description;

            // Incident reports
            const incidents = data.incidents.map(incident => {
                return `**Incident:** ${incident.name}\n**Status:** ${incident.status}\n`;
            }).join('\n') || 'No recent incidents.';

            // Determine embed color and emoji based on overall status
            const statusConfig = {
                'All Systems Operational': { color: 0x57f287, emoji: ':green_circle:' }, // Green
                'Partial System Outage': { color: 0xfee75c, emoji: ':orange_circle:' },   // Orange
                'Major System Outage': { color: 0xed4245, emoji: ':red_circle:' },        // Red
            };

            const statusDetails = statusConfig[overallStatus] || { color: 0x5865f2, emoji: ':green_circle:' }; // Default to green if not found

            // Create and send the embed
            const embed = {
                color: statusDetails.color,
                title: `${statusDetails.emoji} Discord Status`,  // Emoji based on status
                description: overallStatus,
                fields: [
                    {
                        name: 'Incident Reports',
                        value: incidents,
                    },
                ],
                url: 'https://discordstatus.com/',
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'Powered by DiscordStatus.com',
                },
            };

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching Discord status:', error);
            await interaction.editReply({
                content: 'Unable to fetch Discord status. Please try again later.',
                ephemeral: true,
            });
        }
    },
};
