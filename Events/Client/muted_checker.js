// guildMemberAdd.js
const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const mutedRoleId = '1155722773704998963'; // Muted role ID
        const unverifiedRoleId = '1155729094999277649'; // Unverified role ID
        const delayTime = 5000; // 5 seconds in milliseconds

        // Delay the role check by 5 seconds
        setTimeout(async () => {
            if (member.roles.cache.has(mutedRoleId)) {
                try {
                    // If they have the muted role, remove the unverified role
                    await member.roles.remove(unverifiedRoleId);
                } catch (error) {
                    console.error(`Failed to remove unverified role from ${member.user.tag}:`, error);
                }
            }
        }, delayTime);
    },
};
