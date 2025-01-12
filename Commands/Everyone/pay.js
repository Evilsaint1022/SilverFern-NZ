const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Balance directory
const BALANCE_DIR = path.resolve(__dirname, '../../Utilities/Economy/Currency/Balance');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Transfer points to another member.')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The member to whom you want to transfer points.')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('The number of points to transfer.')
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.channel;
    const guild = interaction.guild;
    const guildIconUrl = guild.iconURL({ dynamic: true }) || '';
    const timestamp = new Date().toLocaleTimeString();

    // Get sender, target user, and transfer amount
    const sender = interaction.user; // Interaction User
    const user = interaction.options.getUser('user'); // Target User
    const amount = interaction.options.getInteger('amount'); // Transfer amount

    // Prevent self-payment
    if (sender.id === user.id) {
      return interaction.reply({ content: 'You cannot pay yourself!', ephemeral: true });
    }

    // Prevent payment to bots
    if (user.bot) {
      return interaction.reply({ content: `You cannot transfer 🌿's to bots!`, ephemeral: true });
    }

    // Validate amount
    if (amount <= 0) {
      return interaction.reply({ content: 'The transfer amount must be greater than 0.', ephemeral: true });
    }

    // File paths for sender and user
    const senderFile = path.join(BALANCE_DIR, `${sender.username}.txt`);
    const userFile = path.join(BALANCE_DIR, `${user.username}.txt`);

    try {
      // Read sender balance
      const senderBalance = fs.existsSync(senderFile)
        ? parseInt(fs.readFileSync(senderFile, 'utf-8'), 10)
        : 0;

      // Check if sender has enough balance
      if (senderBalance < amount) {
        return interaction.reply({ content: `You do not have enough points to transfer ${amount}.`, ephemeral: true });
      }

      // Read user balance
      const userBalance = fs.existsSync(userFile)
        ? parseInt(fs.readFileSync(userFile, 'utf-8'), 10)
        : 0;

      // Update balances
      const newSenderBalance = senderBalance - amount;
      const newUserBalance = userBalance + amount;

      // Write updated balances to files
      fs.writeFileSync(senderFile, newSenderBalance.toString());
      fs.writeFileSync(userFile, newUserBalance.toString());

      const messageContent = `✅ **Payment Successful!**\n**${sender.username}** Paid **${amount} 🌿** to **${user.username}**.`;

      // Reply with success message
      await interaction.reply(messageContent);

      // Logging to the defined channel
      const logChannel = guild.channels.cache.get(process.env.Logs_ID);
      if (logChannel) {
        logChannel.send({
          embeds: [
            {
              color: 0x020202,
              title: `**__Pay Application Command__ - 【${timestamp}】**`,
              thumbnail: { url: guildIconUrl },
              description: `**User: ${sender.tag}\nReceiver: ${user.username}\nAmount: ${amount} 🌿\nChannel: ${channel.name}**`,
            },
          ],
        });
      }
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: 'An error occurred while processing the transaction. Please try again later.',
        ephemeral: true,
      });
    }
  },
};