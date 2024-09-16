require('dotenv').config();
const fs = require('fs');
const { registerCommands } = require('./register-commands');
const { loadEvents } = require('../Handlers/eventHandler');
const schedule = require('node-schedule');
const { Client, Collection, Partials, GatewayIntentBits, Events, MessageCollector, ActivityType, MessageEmbed, } = require(`discord.js`);
const { user, Message, GuildMember, ThreadMember } = Partials;
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [ user, Message, GuildMember, ThreadMember]
});

client.events = new Collection();

// Listen for the Ready Event ------------------------------------------------------------------------------------------------------------

    client.once("ready", () => {
    console.log(`${client.user.tag} just logged in!`);

    // Registers/CommandHandler
    registerCommands(client);

    // Set the bot's activity
    setInterval(() => {
    const activities = [
        "𝗜 𝗦𝗲𝗲 𝗬𝗼𝘂 👀",
        "🌿𝗦𝗶𝗹𝘃𝗲𝗿𝗙𝗲𝗿𝗻 𝗡𝗭",
        "𝗕𝘂𝗶𝗹𝘁 𝗹𝗶𝗸𝗲 𝗔 𝗠𝗶𝘁𝗿𝗲 𝟭𝟬",
        "𝗦𝗵𝗼𝗽𝗽𝗶𝗻𝗴 𝗮𝘁 𝗣𝗮𝗸𝗻𝗦𝗹𝗮𝘃𝗲",
    ];
    const activity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(activity, { type: ActivityType.Custom });
}, 5000); // 5000 milliseconds = 5 seconds
})

// Welcome Message Event ------------------------------------------------------------------------------------------------------------------

client.on('guildMemberAdd', member => {
    // The ID of the channel where you want to send the message
    const Chat_Id = '1155691009792028779';
    
    // Fetch the channel by ID
    const channel = member.guild.channels.cache.get(Chat_Id);
  
    // If the channel exists, send a message after a delay
  if (channel) {
    // Set a 5-second (5000 milliseconds) delay
    setTimeout(() => {
      channel.send(`Welcome to the server, ${member.displayName}!`)
        .catch(error => console.error('Error sending message:', error));
    }, 5000); // 5000 milliseconds delay
  } else {
    console.error('Channel not found!');
  }
});

// Welcome Reaction Event -----------------------------------------------------------------------------------------------------------------

// Replace 'YOUR_CHANNEL_ID' with the actual ID of the channel you want to monitor
const Chat_Id = '1155691009792028779';

// Replace 'YOUR_EMOJI_ID' with the actual ID of the emoji
const WelcomeEmojiId = '1163199160791613544';

client.on('messageCreate', async (message) => {

    // Check if the message is from the specific channel
    if (message.channel.id === Chat_Id) {
    // Convert message content to lowercase and check if it contains the word "welcome"
    if (message.content.toLowerCase().includes('welcome')) {
        try {
            // React with the custom emoji :rainbowheart:
            await message.react(WelcomeEmojiId);
        } catch (error) {
            console.error('Failed to add reaction:', error);
        }
    }
    }
});

// Chat Revive Event -----------------------------------------------------------------------------------------------------------------------

const ChatRevive_ID = '1155880860931858573';

const ReviveEmbed = {
    color: 0x008000,
    title: '🌿 ┊ Good morning SilverFern members!',
    description:'',
    image: { 
        url: 'https://media.discordapp.net/attachments/1281336814749089865/1282381552839430275/20240909_044602.gif?ex=66df2663&is=66ddd4e3&hm=7ef067a5c9dc0b919e3230572161bb6c5bd78d799c6dea5f88e711f895520f32&=&width=337&height=201',
        height: 1000, // Adjust the height of the image (in pixels)
        width: 1000,   // Adjust the width of the image (in pixels)
    }
}

 // Schedule the job
 schedule.scheduleJob('00 8 * * *', async () => { // Runs every day at 8:00 AM server time
    try {
        const channel = await client.channels.fetch(Chat_Id);
        if (channel) {
            channel.send({ content: `<@&${ChatRevive_ID}>`});
        await channel.send({ embeds: [ReviveEmbed] });
        } else {
            console.error('Channel not found!');
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
});

// Application Commands ------------------------------------------------------------------------------------------------------------------

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;
    
        const { commandName, user, member, options, channelId } = interaction;
    
        const messageContent = options.getString('message') || 'No message content Was provided';

        const channel = await client.channels.fetch(channelId);
        const channelName = channel.name;
        const timestamp = new Date().toLocaleString();
    
// --------------------------------------------------@Everyone Application Commands ------------------------------------------------------



// Ping Application Command --------------------------------------------------------------------------------------------------------------
    
    if (commandName === 'ping') {
        const pingTimestamp = Date.now();
        await interaction.reply('Pinging...');
        const latency = Date.now() - pingTimestamp;
        const pingEmbed = {
            color: 0x020202,
            title: '**Pong!**',
            description: `** Latency: ${latency}ms. **`,
            timestamp: new Date(),
        };

    // Check if guild has an icon
    if (interaction.guild && interaction.guild.iconURL()) {
        pingEmbed.thumbnail = {
            url: interaction.guild.iconURL({ dynamic: true, size: 128 })
        };
    }
        await interaction.editReply({ embeds: [pingEmbed] });

// Ping Channel Logs ---------------------------------------------------------------------------------------------------------------------

    const logChannel = interaction.guild.channels.cache.get(process.env.Logs_ID);
    if (logChannel) {
    const avatarUrl = user.displayAvatarURL({ dynamic: true, format: 'png' }); // Get user's avatar URL

    logChannel.send({
        embeds: [{
            title: `** [ ${timestamp} ] **`,
            thumbnail: { url: avatarUrl }, // Display user's avatar as thumbnail
            description: `** User: ${user.tag} \nCommand: ${commandName}\nChannel: ${channelName} **`
        }]
    }).catch(error => {
        console.error("Error sending message:", error);
    });
} else {
    console.error("Log channel not found.");
}
};

// Invite Application Command ------------------------------------------------------------------------------------------------------------------

if (commandName === 'invite') {
    await interaction.reply({ content: 'Invite Your friends!', ephemeral: true });
    await channel.send({ content: 'https://discord.com/invite/WMkgNavWQe', });

// Invite Channel Logs -------------------------------------------------------------------------------------------------------------------------

    const logChannel = interaction.guild.channels.cache.get(process.env.Logs_ID);
    if (logChannel) {
    const avatarUrl = user.displayAvatarURL({ dynamic: true, format: 'png' }); // Get user's avatar URL

    logChannel.send({
        embeds: [{
            title: `** [ ${timestamp} ] **`,
            thumbnail: { url: avatarUrl }, // Display user's avatar as thumbnail
            description: `** User: ${user.tag} \nCommand: ${commandName}\nChannel: ${channelName}**`
        }]
    }).catch(error => {
        console.error("Error sending message:", error);
    });
    }    else {
    console.error("Log channel not found.");
}};

// --------------------------------------------------@Staff Application Commands ----------------------------------------------------------



// Echo Application Command ---------------------------------------------------------------------------------------------------------------

if (commandName === 'echo') {
    const Staff_Role_ID = '1155726483080347688'; // Replace 'Staff_Role_ID' with the ID of the role required to use the command

// Check if the member has the required role
if (!member.roles.cache.has(Staff_Role_ID)) {
return interaction.reply({ content: "You don't have the permission to use that command.", ephemeral: true });
}

    await interaction.reply({ content: `Your Echo Has Been Sent!`, ephemeral: true });
    await channel.send({ content: `${messageContent}`});

// Echo Channel Logs ----------------------------------------------------------------------------------------------------------------------
   
    const logChannel = interaction.guild.channels.cache.get(process.env.Logs_ID);
    if (logChannel) {
        const avatarUrl = user.displayAvatarURL({ dynamic: true, format: 'png' }); // Get user's avatar URL
    
        logChannel.send({
            embeds: [{
                title: `** [ ${timestamp} ] **`,
                thumbnail: { url: avatarUrl }, // Display user's avatar as thumbnail
                description: `** User: ${user.tag} \nCommand: ${commandName}\nChannel: ${channelName} \nMessage: ${messageContent} **`
            }]
        }).catch(error => {
            console.error("Error sending message:", error);
        });
    } else {
        console.error("Log channel not found.");
    }
};

// Stop Application Command --------------------------------------------------------------------------------------------------------------

if (commandName === 'stop') {
    const Staff_Role_ID = '1155726483080347688'; // Replace 'Staff_Role_ID' with the ID of the role required to use the command

     // Check if the member has the required role
if (!member.roles.cache.has(Staff_Role_ID)) {
    return interaction.reply({ content: "You don't have the permission to use that command.", ephemeral: true });
}
await interaction.reply({ content: 'The Stop Command Has Been Sent!', ephemeral: true });
    const stopEmbed = {
        color: 0x020202,
        title: '# Change the topic',
        description: ' ** This discussion has gotten too heated and has run its course. The Topic must now be changed. Cancel any replies you are in the middle of and do not start any new replies. Continuing on with this topic will result in a timeout. ** ',
        image: { 
            url: 'https://images-ext-2.discordapp.net/external/tt-s11SUBbBxQlRsQpmHrcfgk5BJror2zd2-2tUkoww/https/i.imgur.com/B5HkQWg.jpg',
            height: 1000, // Adjust the height of the image (in pixels)
            width: 1000,   // Adjust the width of the image (in pixels)
          }
    }
    await channel.send({ embeds: [stopEmbed] });

// Stop Channel Logs ------------------------------------------------------------------------------------------------------------------

    const logChannel = interaction.guild.channels.cache.get(process.env.Logs_ID);
    if (logChannel) {
        const avatarUrl = user.displayAvatarURL({ dynamic: true, format: 'png' }); // Get user's avatar URL
    
        logChannel.send({
            embeds: [{
                title: `** [ ${timestamp} ] **`,
                thumbnail: { url: avatarUrl }, // Display user's avatar as thumbnail
                description: `** User: ${user.tag} \nCommand: ${commandName}\nChannel: ${channelName}**`
            }]
        }).catch(error => {
            console.error("Error sending message:", error);
        });
    } else {
        console.error("Log channel not found.");
        }   
    };

});


    // ** Token Client Login **
    client.login(process.env.TOKEN).then(() => {
        loadEvents(client);
})