const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Echo a message to the channel.')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message to echo')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { channel, user, guild, member } = interaction;
        const messageContent = interaction.options.getString('message');
        const Staff_Role_ID = '1155726483080347688'; // Replace with the ID of the required role

        // Check if the member has the required role
        if (!member.roles.cache.has(Staff_Role_ID)) {
            return interaction.reply({ content: "You don't have the permission to use that command.", ephemeral: true });
        }

        await interaction.reply({ content: `Your Echo Has Been Sent!`, ephemeral: true });
        await channel.send({ content: messageContent });

        // Echo Channel Logs
        const logChannel = guild.channels.cache.get(process.env.Logs_ID);
        if (logChannel) {
            const guildIconUrl = interaction.guild.iconURL({ dynamic: true, format: 'png' }); // Get the guild's icon URL
            const timestamp = new Date().toLocaleTimeString(); // Get current timestamp

            logChannel.send({
                embeds: [{
                    color: 0x020202,
                    title: `**__Echo Application Command__ -【${timestamp}】**`,
                    thumbnail: { url: guildIconUrl }, // Display user's avatar as thumbnail
                    description: `**User: ${user.tag}\nMessage: ${messageContent}\nChannel: ${channel.name}**`,
                }],
            }).catch(error => {
                console.error("Error sending message:", error);
            });
        } else {
            console.error("Log channel not found.");
        }
    },
};
