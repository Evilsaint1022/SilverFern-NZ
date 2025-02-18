const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Sends the YouTube playlist'),
    
    async execute(interaction) {
        const { user, channel } = interaction;
        const { guild } = interaction;
        const timestamp = new Date().toLocaleTimeString();
        const channelName = channel.name;
        const guildIconUrl = guild.iconURL({ dynamic: true, format: 'png' });

        const youtubeEmbed = {
            color: 0x020202,
            title: '🌿Ｙｏｕｔｕｂｅ　Ｐｌａｙｌｉｓｔ',
            url: 'https://www.youtube.com/playlist?list=PL320QKrhNcoSF-OWezlJWxr7bcYGp6De4&jct=sJJ7DkiJIphHURH2u6Pogtx7Hk0V0w',
            description: '*(click on the title to view the youtube playlist.)*',
            image: { 
                url: 'https://cdn.discordapp.com/attachments/1155691009792028779/1312279473139351623/youtube_banner.png?ex=674beaff&is=674a997f&hm=8750379220ed9b7faf52c0beed21229bddbf6ec280239bc8b6e3143d85d20833&',
                height: 1000,
                width: 1000,
            },
        };

        await interaction.reply({ embeds: [youtubeEmbed] });

        // ** YouTube Channel Logs **
        const logChannel = guild.channels.cache.get(process.env.Logs_ID);
        if (logChannel) {
            logChannel.send({
                embeds: [{
                    color: 0x020202,
                    title: `**__Youtube Application Command__ -【${timestamp}】**`,
                    thumbnail: { url: guildIconUrl },
                    description: `** User: ${user.tag}\nChannel: ${channelName}**`
                }]
            }).catch(console.error);
        } else {
            console.error("Log channel not found.");
        }
    }
};

