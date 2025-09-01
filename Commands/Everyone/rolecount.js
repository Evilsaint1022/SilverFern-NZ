const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolecount')
        .setDescription('Get the number of members with a specific role.')
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('The role to check')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            // Defer the reply to handle longer operations
            await interaction.deferReply();

            // Get the role mentioned in the command
            const role = interaction.options.getRole('role');

            // Fetch the guild members (to ensure an accurate count)
            const members = await interaction.guild.members.fetch();

            // Filter members to count those with the role
            const count = members.filter(member => member.roles.cache.has(role.id)).size;

            // Send the response
            await interaction.editReply(`The role **${role.name}** has **${count}** member(s).`);
        } catch (error) {
            console.error('Error executing rolecount command:', error);
            await interaction.editReply('An error occurred while fetching the role count. Please try again later.');
        }
    }
};
