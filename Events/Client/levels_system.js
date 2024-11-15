// messageCreate.js
const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        const xpFilePath = path.resolve(__dirname, '../../Economy/Levels/xp.json');

        // Load user XP data
        const xpData = JSON.parse(fs.readFileSync(xpFilePath, 'utf8'));

        const userId = message.author.id;

        // Initialize user data if not present
        if (!xpData[userId]) {
            xpData[userId] = { xp: 0, level: 1 };
        }

        // Define milestone levels and corresponding role IDs
        const levelRoles = {
            3: '1156311233025290311',
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

        // Level up if XP threshold is reached
        const xpForNextLevel = xpData[userId].level * 100;
        if (xpData[userId].xp >= xpForNextLevel) {
            xpData[userId].xp -= xpForNextLevel;
            xpData[userId].level += 1;

            message.channel.send(
                `🎉**Congratulations ${message.author}!🎉**\n**You've leveled up to level ${xpData[userId].level}!**`
            );

            // Remove the previous milestone role if above level 3
            if (xpData[userId].level > 3) {
                const previousRoleId = levelRoles[xpData[userId].level - 1];
                if (previousRoleId && previousRoleId !== levelRoles[3]) {
                    const previousRole = message.guild.roles.cache.get(previousRoleId);
                    if (previousRole && message.member.roles.cache.has(previousRoleId)) {
                        await message.member.roles.remove(previousRole);
                    }
                }
            }

            // Check if the new level has a role associated and add it if so
            const newRoleId = levelRoles[xpData[userId].level];
            if (newRoleId) {
                try {
                    const newRole = message.guild.roles.cache.get(newRoleId);
                    if (newRole) {
                        await message.member.roles.add(newRole);
                    }
                } catch (error) {
                    console.error(`Failed to assign role for level ${xpData[userId].level} to ${message.author.tag}:`, error);
                }
            }
        }

        // Save updated XP data
        fs.writeFileSync(xpFilePath, JSON.stringify(xpData, null, 2));
    },
};
