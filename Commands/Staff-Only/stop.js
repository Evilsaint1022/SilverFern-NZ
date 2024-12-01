const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the current discussion and change the topic.'),
    async execute(interaction) {
        const { channel, user, guild, member } = interaction;
        const Staff_Role_ID = '1155726483080347688'; // Replace with the ID of the required role

        // Check if the member has the required role
        if (!member.roles.cache.has(Staff_Role_ID)) {
            return interaction.reply({ content: "You don't have the permission to use that command.", ephemeral: true });
        }

        const stopEmbed = {
            color: 0x020202,
            title: '__【🔴】𝘾𝙝𝙖𝙣𝙜𝙚 𝙏𝙝𝙚 𝙏𝙤𝙥𝙞𝙘__',
            description: ' **This discussion has gotten too heated and has run its course. The Topic must now be changed. Cancel any replies you are in the middle of and do not start any new replies. Continuing on with this topic will result in a timeout.** ',
            image: {
                url: 'https://images-ext-2.discordapp.net/external/tt-s11SUBbBxQlRsQpmHrcfgk5BJror2zd2-2tUkoww/https/i.imgur.com/B5HkQWg.jpg',
            },
        };

        await interaction.reply({ embeds: [stopEmbed] });

        // Stop Channel Logs
        const logChannel = guild.channels.cache.get(process.env.Logs_ID);
        if (logChannel) {
            const guildIconUrl = interaction.guild.iconURL({ dynamic: true, format: 'png' }); // Get the guild's icon URL
            const timestamp = new Date().toLocaleTimeString(); // Get current timestamp

            logChannel.send({
                embeds: [{
                    color: 0x020202,
                    title: `**__Stop Application Command__ -【${timestamp}】**`,
                    thumbnail: { url: guildIconUrl }, // Display user's avatar as thumbnail
                    description: `**User: ${user.tag}\nChannel: ${channel.name}**`,
                }],
            }).catch(error => {
                console.error("Error sending message:", error);
            });
        } else {
            console.error("Log channel not found.");
        }
    },
};
