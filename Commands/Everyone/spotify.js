const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotify')
        .setDescription('Sends the Spotify playlist'),

    async execute(interaction) {
        const logChannel = interaction.guild.channels.cache.get(process.env.Logs_ID);
        const guildIconUrl = interaction.guild.iconURL({ dynamic: true, format: 'png' }) || '';

        const spotifyEmbed = {
            color: 0x020202,
            title: '🌿Ｓｐｏｔｉｆｙ　Ｐｌａｙｌｉｓｔ',
            url: 'https://open.spotify.com/playlist/3QJXHiGlnq8fFDcUEaqkZp?si=M9Lb9flVShSg956665h1Ug&pt=6f141fa52e967de7db79bf360cfc4978&pi=a-8q-ufQMsT8eC',
            description: '*(click on the title to view the spotify playlist.)*',
            image: {
                url: 'https://media.discordapp.net/attachments/1155711970985660446/1312293526020821022/Untitled327_20241130184548.png?ex=674bf815&is=674aa695&hm=e67db0f85d6fa257c0f4c587180225da5d9514d302c2bcb630f15bec80b79b5b&=&format=webp&quality=lossless&width=412&height=137',
                height: 1000,
                width: 1000,
            },
        };

        await interaction.reply({ embeds: [spotifyEmbed] });

        if (logChannel) {
            logChannel.send({
                embeds: [{
                    color: 0x020202,
                    title: `****__Spotify Application Command__ -【${new Date().toLocaleTimeString()}】****`,
                    thumbnail: { url: guildIconUrl },
                    description: `** User: ${interaction.user.tag}\nChannel: ${interaction.channel.name}**`
                }]
            }).catch(console.error);
        }
    }
};

