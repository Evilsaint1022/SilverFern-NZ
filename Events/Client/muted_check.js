const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const mutedRoleId = '1155722773704998963'; // Muted role ID
        const unverifiedRoleId = '1155729094999277649'; // Unverified role ID
        const delayTime = 5000; // 5 seconds in milliseconds

        setTimeout(async () => {
            // Fetch the member from the guild again to confirm they are still in the server
            try {
                const fetchedMember = await member.guild.members.fetch(member.id);

                // If they have the muted role, remove the unverified role
                if (fetchedMember.roles.cache.has(mutedRoleId)) {
                    await fetchedMember.roles.remove(unverifiedRoleId);
                }
            } catch (error) {
                if (error.code === 10007) {
                    // Member is no longer in the guild
                } else {
                    console.error(`Failed to update roles for ${member.user.tag}:`, error);
                }
            }
        }, delayTime);
    },
};
