const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute a member by adding and removing specific roles')
        .addUserOption(option => 
            option
                .setName('member')
                .setDescription('The member to unmute')
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName('reason')
                .setDescription('The reason for the unmute')
                .setRequired(false)
        ),
    async execute(interaction) {
        const requiredRole = '1155726483080347688';

        // Check if the user has the required role
        if (!interaction.member.roles.cache.has(requiredRole)) {
            return interaction.reply({ 
                content: `You do not have permission to use this command. Required role: <@&${requiredRole}>`, 
                ephemeral: true 
            });
        }

        const target = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const roleToAdd = '1155729094999277649';
        const rolesToRemove = ['1155722773704998963'];

        try {
            await target.roles.add(roleToAdd);
            await target.roles.remove(rolesToRemove);

            await interaction.reply({ 
                content: `${target.user.tag} has been unmuted by ${interaction.user.tag}. Reason: ${reason}` 
            });

            // Log unmute action
            const logChannel = interaction.guild.channels.cache.get(process.env.Logs_ID);
            if (logChannel) {
                const guildIconUrl = interaction.guild.iconURL({ dynamic: true, format: 'png' }); // Get the guild's icon URL
                const timestamp = new Date().toLocaleTimeString(); // Get current timestamp

                logChannel.send({
                    embeds: [{
                        color: 0x020202,
                        title: `**__Unmute Application Command__ - 【${timestamp}】**`,
                        thumbnail: { url: guildIconUrl }, // Display guild's icon as thumbnail
                        description: `**User: ${interaction.user.tag}**\n**Unmuted: ${target.user.tag}**\n**Reason: ${reason}**\n**Channel: ${interaction.channel.name}**`,
                    }],
                }).catch(error => {
                    console.error("Error sending log message:", error);
                });
            } else {
                console.error("Log channel not found.");
            }

        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: 'There was an error while executing this command!', 
                ephemeral: true 
            });
        }
    },
};
