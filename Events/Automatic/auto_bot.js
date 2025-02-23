// guildMemberAdd.js
const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const botRoleId = '1155701888981934131'; // Role to assign to bots

        // Check if the member is a bot
        if (member.user.bot) {
            try {
                // Add the bot role to the member
                await member.roles.add(botRoleId);
            } catch (error) {
                console.error(`Failed to assign role to ${member.user.tag}:`, error);
            }
        }
    },
};
