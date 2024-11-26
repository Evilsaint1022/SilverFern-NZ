const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Balance directory
const BALANCE_DIR = path.resolve(__dirname, '../../Economy/Currency/Balance');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Transfer points to another member.')
    .addUserOption(option =>
      option
        .setName('target')
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
    const sender = interaction.user; // Command user
    const target = interaction.options.getUser('target'); // Target user
    const amount = interaction.options.getInteger('amount'); // Transfer amount

    // Prevent self-payment
    if (sender.id === target.id) {
      return interaction.reply({ content: 'You cannot pay yourself!', ephemeral: true });
    }

    // Validate amount
    if (amount <= 0) {
      return interaction.reply({ content: 'The transfer amount must be greater than 0.', ephemeral: true });
    }

    // File paths for sender and target
    const senderFile = path.join(BALANCE_DIR, `${sender.username}.txt`);
    const targetFile = path.join(BALANCE_DIR, `${target.username}.txt`);

    try {
      // Read sender balance
      const senderBalance = fs.existsSync(senderFile)
        ? parseInt(fs.readFileSync(senderFile, 'utf-8'), 10)
        : 0;

      // Check if sender has enough balance
      if (senderBalance < amount) {
        return interaction.reply({ content: `You do not have enough points to transfer ${amount}.`, ephemeral: true });
      }

      // Read target balance
      const targetBalance = fs.existsSync(targetFile)
        ? parseInt(fs.readFileSync(targetFile, 'utf-8'), 10)
        : 0;

      // Update balances
      const newSenderBalance = senderBalance - amount;
      const newTargetBalance = targetBalance + amount;

      // Write updated balances to files
      fs.writeFileSync(senderFile, newSenderBalance.toString());
      fs.writeFileSync(targetFile, newTargetBalance.toString());

      // Reply with success message
      return interaction.reply(
        `✅ **Payment Successful!**\n* **${sender.username}** Paid **${amount} 🌿** to **${target.username}**.`
      );
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: 'An error occurred while processing the transaction. Please try again later.',
        ephemeral: true,
      });
    }
  },
};
