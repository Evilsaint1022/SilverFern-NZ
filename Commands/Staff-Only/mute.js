const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a member by adding and removing specific roles')
        .addUserOption(option => 
            option
                .setName('member')
                .setDescription('The member to mute')
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName('reason')
                .setDescription('The reason for the mute')
                .setRequired(true)
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

        const roleToAdd = '1155722773704998963';
        const rolesToRemove = ['1155729291158491137', '1155729094999277649'];

        try {
            await target.roles.add(roleToAdd);
            await target.roles.remove(rolesToRemove);

            await interaction.reply({ 
                content: `${target.user.tag} has been muted by ${interaction.user.tag}. Reason: ${reason}` 
            });

            // Log mute action
            const logChannel = interaction.guild.channels.cache.get(process.env.Logs_ID);
            if (logChannel) {
                const guildIconUrl = interaction.guild.iconURL({ dynamic: true, format: 'png' }); // Get the guild's icon URL
                const timestamp = new Date().toLocaleTimeString(); // Get current timestamp

                logChannel.send({
                    embeds: [{
                        color: 0x020202,
                        title: `**__Mute Application Command__ - 【${timestamp}】**`,
                        thumbnail: { url: guildIconUrl }, // Display guild's icon as thumbnail
                        description: `**User: ${interaction.user.tag}**\n**Muted: ${target.user.tag}**\n**Reason: ${reason}**\n**Channel: ${interaction.channel.name}**`,
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