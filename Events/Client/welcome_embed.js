const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    // Fetch the guild to get the total member count
    const guild = member.guild;

    // Create the embed message
    const welcomeEmbed = new EmbedBuilder()
      .setTitle(`**Welcome ${member.user.tag} to SilverFern NZ**`)
      .setDescription(
        `**Check Out**\n` +
        `**🌿 <#1155693849453264947>**\n` +  // Mentions the welcome channel
        `**🌿 ⁠<#1257457821298196566>**\n` +
        `**🌿 <id:customize>**\n\n` +
        `**Server Invite: https://dsc.gg/silverfern**\n\n` +
        `**Hope you enjoy your stay in the server! ❤️**\n\n`
      )
      .setImage("https://media.discordapp.net/attachments/1155711970985660446/1189166135246082119/Untitled327_20231227002127.png?ex=672d4b84&is=672bfa04&hm=e4592454409ea0869627ac8edf37d2e1028865d7d7f12c6fc4817149ec0e645e&=&format=webp&quality=lossless&width=1125&height=375")
      .setThumbnail(member.client.user.displayAvatarURL()) // Bot icon as thumbnail
      .setFooter({ text: `SilverFern NZ!`, iconURL: guild.iconURL() })
      .setTimestamp()
      .setColor(0xFFFFFF); // Optional: set a color for the embed

    // Send the role mention and embed message to the specified channel by ID
    const welcomeChannel = guild.channels.cache.get('1155691009792028779');
    if (welcomeChannel) {
      await welcomeChannel.send({ content: `<@&1155880568463036476>`, embeds: [welcomeEmbed] });
    } else {
      console.error("Welcome channel not found. Please check the channel ID.");
    }
  },
};
