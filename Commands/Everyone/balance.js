const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Command registration data
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription("Check your current balance."),
    
    // Command execution
    async execute(interaction) {
        const { user } = interaction;

        // Define the absolute path to the Bank folder inside ../Economy
        const bankFolder = path.resolve(__dirname, '../../Economy/Bank');
        const balanceFilePath = path.join(bankFolder, `${user.username}.txt`);

        // Ensure the Bank folder exists
        if (!fs.existsSync(bankFolder)) {
            fs.mkdirSync(bankFolder, { recursive: true });
        }

        let balance;

        // Check if the balance file exists; if not, initialize with 0
        if (fs.existsSync(balanceFilePath)) {
            // Read the existing balance
            balance = parseInt(fs.readFileSync(balanceFilePath, 'utf8'), 10);
        } else {
            // Set initial balance to 0 and create the file
            balance = 0;
            fs.writeFileSync(balanceFilePath, balance.toString());
        }

        // Reply with the user's balance
        await interaction.reply(`${user.username}, your current balance is: ${balance} Ferns. 🌿`);
    }
};
