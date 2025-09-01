// messageCreate.js
const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        const mutedRoleId = '1155722773704998963';
        const permissionsRoleId = '1156311233025290311'; // Level 3 permissions role ID
        const xpFilePath = path.resolve(__dirname, '../../Utilities/Economy/Levels/xp.json');

        // Check if user has the muted role
        if (message.member.roles.cache.has(mutedRoleId)) return;

        // Load user XP data
        const xpData = JSON.parse(fs.readFileSync(xpFilePath, 'utf8'));

        const userId = message.author.id;

        // Initialize user data if not present
        if (!xpData[userId]) {
            xpData[userId] = { xp: 0, level: 1 };
        }

        // Define milestone levels and corresponding role IDs
        const levelRoles = {
            3: permissionsRoleId, // Keep permissions role as a milestone for level 3
            5: '1275056698494554246',
            10: '1275058457615274097',
            20: '1275059611623489600',
            30: '1275060273098526742',
            40: '1275060437691666432',
            50: '1275060523242622977',
            60: '1275060588732612640',
            70: '1275060648547582055',
            80: '1275060738615939072',
            90: '1275060804764569611',
            100: '1277501451832397895'
        };

        // Generate random XP between 5 and 15
        const xpGain = Math.floor(Math.random() * 11) + 5;
        xpData[userId].xp += xpGain;

        // Calculate XP required for the next level (increments of 350 per level)
        const xpForNextLevel = xpData[userId].level * 350;

        // Level up if XP threshold is reached
        if (xpData[userId].xp >= xpForNextLevel) {
            xpData[userId].xp -= xpForNextLevel;
            xpData[userId].level += 1;

            message.channel.send(
                `🎉**Congratulations ${message.author}!🎉**\n**You've leveled up to level ${xpData[userId].level}!**`
            );
        }

        // Check and update roles for the member
        const currentLevel = xpData[userId].level;

        try {
            // Find the latest role for the current level
            const milestoneRoleId = Object.entries(levelRoles)
                .filter(([level]) => currentLevel >= level)
                .map(([, roleId]) => roleId)
                .pop();

            // Remove unrelated milestone roles except the permissions role
            const userRoles = message.member.roles.cache;
            for (const [, roleId] of Object.entries(levelRoles)) {
                if (roleId !== milestoneRoleId && roleId !== permissionsRoleId && userRoles.has(roleId)) {
                    await message.member.roles.remove(roleId);
                }
            }

            // Add the correct milestone role if not already assigned
            if (milestoneRoleId && !userRoles.has(milestoneRoleId)) {
                const milestoneRole = message.guild.roles.cache.get(milestoneRoleId);
                if (milestoneRole) {
                    await message.member.roles.add(milestoneRole);
                }
            }

            // Ensure the permissions role (level 3 role) is added and kept for levels 3 or higher
            if (currentLevel >= 3) {
                const hasPermissionsRole = userRoles.has(permissionsRoleId);
                const permissionsRole = message.guild.roles.cache.get(permissionsRoleId);

            // Add the permissions role if the member doesn't have it
            if (!hasPermissionsRole && permissionsRole) {
                await message.member.roles.add(permissionsRole);
                }
            } else {

            // Remove the permissions role if the user is below level 3
             if (userRoles.has(permissionsRoleId)) {
            const permissionsRole = message.guild.roles.cache.get(permissionsRoleId);
            if (permissionsRole) {
                await message.member.roles.remove(permissionsRole);
        }
                }
            }

        } catch (error) {
            console.error(`Failed to update roles for ${message.author.tag}:`, error);
        }

        // Save updated XP data
        fs.writeFileSync(xpFilePath, JSON.stringify(xpData, null, 2));
    },
};
