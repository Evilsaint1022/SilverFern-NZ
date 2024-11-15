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
            title: '【🌿】Ｓｐｏｔｉｆｙ　Ｐｌａｙｌｉｓｔ',
            url: 'https://open.spotify.com/playlist/3QJXHiGlnq8fFDcUEaqkZp?si=M9Lb9flVShSg956665h1Ug&pt=6f141fa52e967de7db79bf360cfc4978&pi=a-8q-ufQMsT8eC',
            description: '*(click on the title to view the spotify playlist.)*',
            image: {
                url: 'https://cdn.discordapp.com/attachments/1155711970985660446/1288389342779146292/Untitled327.png?ex=66f50194&is=66f3b014&hm=e5683f0cb074d0c1baeb394d4d5740063436b239f46d573b92178e09ef9a274a&',
            },
        };

        await interaction.reply({ embeds: [spotifyEmbed] });

        if (logChannel) {
            logChannel.send({
                embeds: [{
                    color: 0x020202,
                    title: `****__Spotify Application Command__ -【${new Date().toLocaleTimeString()}】****`,
                    thumbnail: { url: guildIconUrl },
                    description: `** User: ${interaction.user.tag} \nCommand: /Spotify\nChannel: ${interaction.channel.name}**`
                }]
            }).catch(console.error);
        }
    }
};

