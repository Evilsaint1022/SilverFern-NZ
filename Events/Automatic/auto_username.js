const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'userUpdate',
  async execute(oldUser, newUser) {
    // Check if the username has changed
    if (oldUser.username === newUser.username) return;

    const balanceDir = path.resolve(__dirname, '../../Utilities/Economy/Currency/Balance');
    const bankDir = path.resolve(__dirname, '../../Utilities/Economy/Currency/Bank');

    try {
      // Define old and new filenames
      const oldBalanceFile = path.join(balanceDir, `${oldUser.username}.txt`);
      const newBalanceFile = path.join(balanceDir, `${newUser.username}.txt`);

      const oldBankFile = path.join(bankDir, `${oldUser.username}.txt`);
      const newBankFile = path.join(bankDir, `${newUser.username}.txt`);

      // Update the Balance file
      if (fs.existsSync(oldBalanceFile)) {
        fs.renameSync(oldBalanceFile, newBalanceFile);
      } else {
        console.warn(`Balance file for ${oldUser.username} not found.`);
      }

      // Update the Bank file
      if (fs.existsSync(oldBankFile)) {
        fs.renameSync(oldBankFile, newBankFile);
      } else {
        console.warn(`Bank file for ${oldUser.username} not found.`);
      }
    } catch (error) {
      console.error('Error updating username files:', error);
    }
  }
};
