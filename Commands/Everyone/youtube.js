const { SlashCommandBuilder } = require('@discordjs/builders');
const { Channel } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Sends the YouTube playlist'),
    
    async execute(interaction) {
        const user = interaction.user;
        const channel = interaction.channel;
        const timestamp = new Date().toLocaleTimeString(); // Get current timestamp
        const channelName = channel.name;
        
        const youtubeEmbed = {
            color: 0x020202,
            title: '【🌿】Ｙｏｕｔｕｂｅ　Ｐｌａｙｌｉｓｔ',
            url: 'https://www.youtube.com/playlist?list=PL320QKrhNcoSF-OWezlJWxr7bcYGp6De4&jct=sJJ7DkiJIphHURH2u6Pogtx7Hk0V0w',
            description: '*(click on the title to view the youtube playlist.)*',
            image: { 
                url: 'https://media.discordapp.net/attachments/1155711970985660446/1288377697860452404/Untitled347.png?ex=66f4f6bc&is=66f3a53c&hm=a7113f83a5aed81bb74189b3d3d2b223546e8a2e526c26458bd2481c1d3c903f&=&format=webp&quality=lossless&width=1440&height=480',
                height: 1000,
                width: 1000,
            },
        };

        await interaction.reply({ embeds: [youtubeEmbed] });

        // ** YouTube Channel Logs **
        const logChannel = interaction.guild.channels.cache.get(process.env.Logs_ID);
        if (logChannel) {
            const guildIconUrl = interaction.guild.iconURL({ dynamic: true, format: 'png' }); // Get the guild's icon URL

            logChannel.send({
                embeds: [{
                    color: 0x020202,
                    title: `**__Youtube Application Command__ -【${timestamp}】**`,
                    thumbnail: { url: guildIconUrl },
                    description: `** User: ${user.tag} \nCommand: Youtube\nChannel: ${channelName}**`
                }]
            }).catch(error => {
                console.error("Error sending message:", error);
            });
        } else {
            console.error("Log channel not found.");
        }
    }
};
