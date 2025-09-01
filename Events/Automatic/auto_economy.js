const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: Events.GuildMemberAdd,
  execute(member) {
    // Directories for balance and bank files
    const balanceDir = path.resolve(__dirname, '../../Utilities/Economy/Currency/Balance');
    const bankDir = path.resolve(__dirname, '../../Utilities/Economy/Currency/Bank');

    // File paths for balance and bank files
    const balanceFilePath = path.join(balanceDir, `${member.user.username}.txt`);
    const bankFilePath = path.join(bankDir, `${member.user.username}.txt`);

    // Ensure the directories exist
    if (!fs.existsSync(balanceDir)) {
      fs.mkdirSync(balanceDir, { recursive: true });
    }

    if (!fs.existsSync(bankDir)) {
      fs.mkdirSync(bankDir, { recursive: true });
    }

    // Create balance file if it doesn't exist
    if (!fs.existsSync(balanceFilePath)) {
      fs.writeFileSync(balanceFilePath, '0', 'utf8');
    }

    // Create bank file if it doesn't exist
    if (!fs.existsSync(bankFilePath)) {
      fs.writeFileSync(bankFilePath, '0', 'utf8');
    }
  },
};
