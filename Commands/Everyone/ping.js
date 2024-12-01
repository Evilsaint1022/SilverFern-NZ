const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        const start = Date.now();
        await interaction.reply('Pinging...');

        const latency = Date.now() - start;
        const pingEmbed = {
            color: 0x020202,
            title: '**Pong!**',
            description: `**Latency: ${latency}ms.**`,
        };

        if (interaction.guild?.iconURL()) {
            pingEmbed.thumbnail = { url: interaction.guild.iconURL({ dynamic: true, size: 128 }) };
        }

        await interaction.editReply({ embeds: [pingEmbed] });

        const logChannel = interaction.guild?.channels.cache.get(process.env.Logs_ID);
        if (logChannel) {
            logChannel.send({
                embeds: [{
                    color: 0x020202,
                    title: `**__Ping Application Command__ -【${new Date().toLocaleTimeString()}】**`,
                    thumbnail: { url: interaction.guild.iconURL({ dynamic: true, format: 'png' }) },
                    description: `**User: ${interaction.user.tag}\nChannel: ${interaction.channel.name}**`,
                }],
            }).catch(console.error);
        }
    },
};

