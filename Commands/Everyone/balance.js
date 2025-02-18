const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { readFile, writeFile } = require('fs/promises');
const { join } = require('path');
const fs = require('fs');

module.exports = {
    // Command registration data
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription("Check your current balance or another user's balance.")
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to check the balance of')
                .setRequired(false)
        ),

    // Command execution
    async execute(interaction) {
        // Get the target user (either the command executor or a mentioned user)
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const folder = join(__dirname, '../../Utilities/Economy/Currency/Balance');
        const bankFolder = join(__dirname, '../../Utilities/Economy/Currency/Bank');
        const { user, channel, guild } = interaction;
        const timestamp = new Date().toLocaleTimeString();
        const guildIconUrl = guild.iconURL({ dynamic: true, format: 'png' }) || '';

        // Ensure folders exist
        await Promise.all([
            fs.promises.mkdir(folder, { recursive: true }),
            fs.promises.mkdir(bankFolder, { recursive: true }),
        ]);

        // Read balance file
        const balancePath = join(folder, `${targetUser.username}.txt`);
        let balance = 0;
        try {
            balance = parseInt(await readFile(balancePath, 'utf8'), 10);
        } catch {
            await writeFile(balancePath, balance.toString());
        }

        // Read bank file
        const bankPath = join(bankFolder, `${targetUser.username}.txt`);
        let bank = 0;
        try {
            bank = parseInt(await readFile(bankPath, 'utf8'), 10);
        } catch {
            await writeFile(bankPath, bank.toString());
        }

        // Create an embed message
        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF) // White color
            .setTitle(`**__${targetUser.username}'s Balance__**`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '🌿 Wallet', value: `${balance} Ferns`, inline: true },
                { name: '🏦 Bank', value: `${bank} Ferns`, inline: true }
            )
            .setFooter({ text: 'Use your resources wisely!' })
            .setTimestamp();

        // Reply with the embed
        await interaction.reply({ embeds: [embed] });
        const logChannel = guild.channels.cache.get(process.env.Logs_ID);
        if (logChannel) {
          logChannel.send({
            embeds: [{
              color: 0x020202,
              title: `**__Balance Application Command__ - 【${timestamp}】**`, // 'Balance'
              thumbnail: { url: guildIconUrl },
              description: `**User: ${user.tag}\nChannel: ${channel.name}**`, // '/Balance'
            }],
          });
        }
    }
}        


