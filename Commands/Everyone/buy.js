const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Purchase an item from the shop.'),

  async execute(interaction) {
    const member = interaction.member;
    const shopDirectory = path.resolve(__dirname, '../../Utilities/Economy/Shop');
    const balanceDirectory = path.resolve(__dirname, '../../Utilities/Economy/Currency/Balance');

    // Load all shop items
    const shopItems = loadShopItems(shopDirectory);

    if (!shopItems.length) {
      return interaction.reply("No items available in the shop.");
    }

    // Get user's balance
    const userBalanceFilePath = path.join(balanceDirectory, `${member.user.username}.txt`);
    const balance = await getUserBalance(userBalanceFilePath);

    if (!balance) {
      return interaction.reply("Sorry, we couldn't retrieve your balance.");
    }

    // Create a selection menu for the user to pick an item
    const itemOptions = shopItems.map(item => {
      // Validate each item before adding to the options
      if (!item.title || !item.role || !item.price) {
        console.warn(`Missing required data in item: ${JSON.stringify(item)}`);
        return null; // Skip invalid items
      }

      // Parse price as a number (it's a string in the JSON)
      const price = parseFloat(item.price);
      if (isNaN(price)) {
        console.warn(`Invalid price for item: ${item.title}`);
        return null; // Skip invalid items
      }

      // Include the price in the label of the selection menu
      return {
        label: `${price} - ${item.title}`, // Price included in the label
        value: item.title,
        description: item.description,
        price: price,
        stock: item.stock, // Adding stock information
      };
    }).filter(Boolean); // Remove any null/undefined items

    if (itemOptions.length === 0) {
      return interaction.reply("There are no valid items available for purchase.");
    }

    // Create select menu (dynamic with item options)
    const selectMenu = {
      type: 1,
      components: [
        {
          type: 3,
          custom_id: 'buy_item_select',
          placeholder: 'Select an item to buy',
          options: itemOptions.map(option => ({
            label: option.label,
            value: option.value,
            description: option.description,
            emoji: '🌿',
          })),
        },
      ],
    };

    await interaction.reply({
      content: `**Please select an item to buy:**\n*Your balance is ${balance} 🌿*`,
      components: [selectMenu],
    });

    // Handle the selection
    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 }); // 30 seconds timeout

    collector.on('collect', async (i) => {
      const selectedItem = shopItems.find(item => item.title === i.values[0]);

      if (selectedItem) {
        const price = parseFloat(selectedItem.price);
        const stock = selectedItem.stock;

        if (stock !== '∞' && stock <= 0) {
          await i.reply({ content: `Sorry, ${selectedItem.title} is out of stock.`, ephemeral: true });
          return;
        }

        if (balance >= price) {
          // Check if user already has the role
          if (member.roles.cache.has(selectedItem.role)) {
            await i.reply({ content: `You already own the ${selectedItem.title}.`, ephemeral: true });
          } else {
            // Deduct balance and assign role
            await updateUserBalance(userBalanceFilePath, balance - price);
            await member.roles.add(selectedItem.role);

            // Decrease stock if it's a number
            if (stock !== '∞') {
              selectedItem.stock -= 1;
              await updateShopItem(shopDirectory, selectedItem);
            }

            // Disable the select menu and update the reply
            await interaction.editReply({
              content: `You have successfully bought the ${selectedItem.title} for ${price} Ferns🌿`,
              components: [],
            });

            // Stop the collector after purchase
            collector.stop();
          }
        } else {
          await i.reply({ content: `You don't have enough balance to buy ${selectedItem.title}.`, ephemeral: true });
        }
      }
    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'time') {
        // Disable the selection menu after timeout and send timeout message
        await interaction.editReply({
          content: 'You took too long to select an item. Please try again.',
          components: [
            {
              type: 1,
              components: [
                {
                  type: 3,
                  custom_id: 'buy_item_select',
                  placeholder: 'Selection expired',
                  disabled: true, // Disable the select menu
                  options: [
                    {
                      label: 'Selection expired',
                      value: 'expired',
                      description: 'You took too long to select an item.',
                    },
                  ], // Ensure there's at least one option
                },
              ],
            },
          ],
        });
      }
    });
  },
};

// Function to load shop items from JSON files
function loadShopItems(shopDirectory) {
  const shopItems = [];

  const files = fs.readdirSync(shopDirectory);
  files.forEach(file => {
    if (file.endsWith('.json')) {
      const items = JSON.parse(fs.readFileSync(path.join(shopDirectory, file), 'utf-8'));
      shopItems.push(...items); // Assuming your files are arrays, we flatten them into one array
    }
  });

  return shopItems;
}

// Function to update the stock in the shop's JSON files
async function updateShopItem(shopDirectory, updatedItem) {
  const files = fs.readdirSync(shopDirectory);
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(shopDirectory, file);
      const items = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const itemIndex = items.findIndex(item => item.title === updatedItem.title);
      if (itemIndex !== -1) {
        items[itemIndex] = updatedItem; // Update the item
        fs.writeFileSync(filePath, JSON.stringify(items, null, 2)); // Save back to the file
        break;
      }
    }
  }
}

// Function to get the user's balance
async function getUserBalance(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const balance = parseFloat(fs.readFileSync(filePath, 'utf-8').trim());
      return balance;
    }
  } catch (error) {
    console.error('Error reading balance file:', error);
  }
  return null;
}

// Function to update the user's balance
async function updateUserBalance(filePath, newBalance) {
  try {
    fs.writeFileSync(filePath, newBalance.toString());
  } catch (error) {
    console.error('Error updating balance file:', error);
  }
}
