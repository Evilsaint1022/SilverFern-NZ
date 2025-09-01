const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Invite your friends!'),
    async execute(interaction) {
        const { channel, user, guild } = interaction;
        const logChannel = guild.channels.cache.get(process.env.Logs_ID);

        await interaction.reply({ content: 'https://discord.com/invite/WMkgNavWQe' });

        if (logChannel) {
            logChannel.send({
                embeds: [{
                    color: 0x020202,
                    title: `**__Invite Application Command__ -【${new Date().toLocaleTimeString()}】**`,
                    thumbnail: { url: guild.iconURL({ dynamic: true, format: 'png' }) },
                    description: `**User: ${user.tag}\nChannel: ${channel.name}**`,
                }],
            }).catch(console.error);
        } else {
            console.error("Log channel not found.");
        }
    },
};

