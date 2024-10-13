const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Invite your friends!'),
    async execute(interaction) {
        const { channel, user, guild } = interaction;

        // Reply to the interaction
        await interaction.reply({ content: 'https://discord.com/invite/WMkgNavWQe' });

        // Invite Channel Logs
        const logChannel = guild.channels.cache.get(process.env.Logs_ID);
        if (logChannel) {
            const guildIconUrl = interaction.guild.iconURL({ dynamic: true, format: 'png' }); // Get the guild's icon URL
            const timestamp = new Date().toLocaleTimeString(); // Get current timestamp

            logChannel.send({
                embeds: [{
                    color: 0x020202,
                    title: `**__Invite Application Command__ -【${timestamp}】**`,
                    thumbnail: { url: guildIconUrl }, // Display user's avatar as thumbnail
                    description: `**User: ${user.tag}\nCommand: Invite\nChannel: ${channel.name}**`,
                }],
            }).catch(error => {
                console.error("Error sending message:", error);
            });
        } else {
            console.error("Log channel not found.");
        }
    },
};
