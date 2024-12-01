const { Events, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    // Channel ID where the welcome message will be sent
    const channelId = '1155693849453264947';
    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return console.error(`Channel with ID ${channelId} not found.`);

    try {
      // Load the welcome template and member avatar
      const templatePath = path.join(__dirname, '../../Utilities/Banners/Welcome.png');
      const template = await loadImage(templatePath);
      const avatar = await loadImage(member.user.displayAvatarURL({ format: 'png' }));

      // Create canvas based on template size
      const canvas = createCanvas(template.width, template.height);
      const ctx = canvas.getContext('2d');

      // Draw the template image onto the canvas
      ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

      // Draw the member's avatar as a circle onto the canvas
      const avatarSize = 1560; // Set avatar size
      const avatarX = canvas.width / 2; // Center of the canvas width
      const avatarY = 203 + avatarSize / 2; // Adjust as needed and center the avatar

      // Draw circular avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      // Draw the avatar within the circular clipping area
      ctx.drawImage(avatar, avatarX - avatarSize / 2, avatarY - avatarSize / 2, avatarSize, avatarSize);
      ctx.restore();

      // Convert the canvas to a buffer and send as an attachment
      const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'welcome.png' });

      // Send the customized welcome message with the image attachment
      await channel.send({
        content: `**🌿Kia ora <@${member.id}>, Welcome to the New Zealand family!**\n` +
                 `*Welcome to the 🌿│SilverFern NZ Server.*\n` +
                 `# **__Getting started__**\n` +
                 `**• Verify in <#1257457821298196566>**\n` +
                 `**• Get some roles in ⁠<id:customize>**\n` +
                 `**• Chat with us in ⁠<#1155691009792028779>**\n\n` +
                 `**🌿Member #${member.guild.memberCount}**`,
        files: [attachment],
      });
    } catch (error) {
      console.error('Error generating welcome image:', error);
    }
  },
};
