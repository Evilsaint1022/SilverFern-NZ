// guildMemberAdd.js
const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const verifiedRoleId = '1155729291158491137'; // Verified role ID
        const checkTime = 10 * 60 * 1000; // 10 minutes in milliseconds

        // Ignore bots
        if (member.user.bot) return;

        // Set a timeout to check the member's role after 10 minutes
        setTimeout(async () => {
            try {
                // If the member still doesn't have the verified role, kick them
                if (!member.roles.cache.has(verifiedRoleId)) {
                    await member.kick('Didn\'t Verify Quick Enough!');
                }
            } catch (error) {
                console.error(`Failed to kick ${member.user.tag}:`, error);
            }
        }, checkTime);
    },
};
