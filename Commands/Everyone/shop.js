const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('View the items available in the shop.'),

  async execute(interaction) {
    const shopDirPath = path.resolve(__dirname, '../../Utilities/Economy/Shop');

    // Load all JSON files from the Shop directory
    let shopItems = [];
    try {
      const files = fs.readdirSync(shopDirPath).filter(file => file.endsWith('.json'));
      for (const file of files) {
        const filePath = path.join(shopDirPath, file);
        const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(fileContent)) {
          shopItems = shopItems.concat(fileContent);
        } else {
          console.warn(`File ${file} does not contain an array and will be skipped.`);
        }
      }
    } catch (error) {
      console.error('Error reading shop directory:', error);
      return interaction.reply({ content: 'Failed to load shop items. Please contact the bot administrator.', ephemeral: true });
    }

    // Sort items by price (ascending order)
    shopItems.sort((a, b) => a.price - b.price);

    if (shopItems.length === 0) {
      return interaction.reply({ content: 'The shop is currently empty!', ephemeral: true });
    }

    const itemsPerPage = 5;
    const totalPages = Math.ceil(shopItems.length / itemsPerPage);
    let currentPage = 0;

    // Function to generate an embed for a specific page
    const generateEmbed = (page) => {
      const start = page * itemsPerPage;
      const end = start + itemsPerPage;
      const items = shopItems.slice(start, end);

      const embed = new EmbedBuilder()
        .setTitle('**╭─── 🌿The SilverFern Shop ───╮**')
        .setDescription('*You can buy things using the **`/buy`** command.*\n· · - ┈┈━━ ˚ . 🌿 . ˚ ━━┈┈ - · ·')
        .setColor('#ffffff') // White color for embed
        .setFooter({ text: `Page ${page + 1} of ${totalPages}`, iconURL: interaction.client.user.displayAvatarURL() })
        .setThumbnail(interaction.guild.iconURL()) // Set the bot icon as the thumbnail
        .setTimestamp(); // Set timestamp for when the embed is created

      items.forEach((item, index) => {
        const globalIndex = start + index + 1; // Calculate global index for numbering
        embed.addFields({ 
          name: `${globalIndex} 🌿**__${item.title}__**`, 
          value: `${item.description}\n> • **Role Reward:** <@&${item.role}>\n> • **Stock:** ${item.stock}\n> • **Price:** 🌿${item.price}\n` 
        });
      });

      // Add bottom part to the embed message (extra information)
      embed.addFields({
        name: '\n', // Invisible character (zero-width space) for spacing
        value: `*🌿Thanks for using The SilverFern Shop!*`
      });
      embed.addFields({
        name: '\n', // Invisible character (zero-width space) for spacing
        value: `**╰────────────────────────────╯**`
      });

      return embed;
    };

    // Generate buttons for pagination with the stop button centered
    const generateButtons = () => {
      return new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('prev')
            .setLabel('Previous')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === 0),
          new ButtonBuilder()
            .setCustomId('stop')
            .setLabel('Stop')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Next')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === totalPages - 1),
        );
    };

    const embedMessage = await interaction.reply({
      embeds: [generateEmbed(currentPage)],
      components: [generateButtons()],
      fetchReply: true,
    });

    // Collector for button interactions
    const collector = embedMessage.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.user.id !== interaction.user.id) {
        return buttonInteraction.reply({ content: 'You cannot interact with this menu.', ephemeral: true });
      }

      if (buttonInteraction.customId === 'prev') {
        currentPage--;
      } else if (buttonInteraction.customId === 'next') {
        currentPage++;
      } else if (buttonInteraction.customId === 'stop') {
        collector.stop();
        return buttonInteraction.update({
          components: [], // Remove all buttons after stop
        });
      }

      await buttonInteraction.update({
        embeds: [generateEmbed(currentPage)],
        components: [generateButtons()],
      });
    });

    // End of the collector (after 60 seconds)
    collector.on('end', () => {
      // Remove all buttons after timeout
      interaction.editReply({ components: [] });
    });
  },
};
