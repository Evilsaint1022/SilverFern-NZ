const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute a member by adding and removing specific roles')
        .addUserOption(option => option.setName('member').setDescription('The member to unmute').setRequired(true)),
    async execute(interaction) {
        const requiredRole = '1155726483080347688';

        // Check if the user has the required role
        if (!interaction.member.roles.cache.has(requiredRole)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const target = interaction.options.getMember('member');
        const roleToAdd = '1155729094999277649';
        const rolesToRemove = ['1155722773704998963'];

        try {
            await target.roles.add(roleToAdd);
            await target.roles.remove(rolesToRemove);

            await interaction.reply({ content: `${target.user.tag} has been unmuted by ${interaction.user.tag}` });

            // Echo Channel Logs
            const logChannel = interaction.guild.channels.cache.get(process.env.Logs_ID);
            if (logChannel) {
                const guildIconUrl = interaction.guild.iconURL({ dynamic: true, format: 'png' }); // Get the guild's icon URL
                const timestamp = new Date().toLocaleTimeString(); // Get current timestamp

                logChannel.send({
                    embeds: [{
                        color: 0x020202,
                        title: `**__Unmute Application Command__ - 【${timestamp}】**`,
                        thumbnail: { url: guildIconUrl }, // Display guild's icon as thumbnail
                        description: `**User: ${interaction.user.tag}\nCommand: /Unmute\nUnmuted: ${target.user.tag}\nChannel: ${interaction.channel.name}**`,
                    }],
                }).catch(error => {
                    console.error("Error sending message:", error);
                });
            } else {
                console.error("Log channel not found.");
            }

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};