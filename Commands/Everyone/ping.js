const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        const timestamp = new Date().toLocaleTimeString(); // Get current timestamp
        const pingTimestamp = Date.now();
        await interaction.reply('Pinging...');

        const latency = Date.now() - pingTimestamp;
        const pingEmbed = {
            color: 0x020202,
            title: '**Pong!**',
            description: `**Latency: ${latency}ms.**`,
        };

        // Check if the guild has an icon
        if (interaction.guild && interaction.guild.iconURL()) {
            pingEmbed.thumbnail = {
                url: interaction.guild.iconURL({ dynamic: true, size: 128 }),
            };
        }

        await interaction.editReply({ embeds: [pingEmbed] });

        // Ping Channel Logs
        const logChannel = interaction.guild.channels.cache.get(process.env.Logs_ID);
        if (logChannel) {
            const guildIconUrl = interaction.guild.iconURL({ dynamic: true, format: 'png' }); // Get the guild's icon URL

            logChannel.send({
                embeds: [{
                    color: 0x020202,
                    title: `**__Ping Application Command__ -【${timestamp}】**`,
                    thumbnail: { url: guildIconUrl }, // Display user's avatar as thumbnail
                    description: `**User: ${interaction.user.tag}\nCommand: /Ping\nChannel: ${interaction.channel.name}**`,
                }],
            }).catch(error => {
                console.error("Error sending message:", error);
            });
        } else {
            console.error("Log channel not found.");
        }
    },
};
