//
//⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀
//⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⣸⣷
//⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⢰⡄⣾⣿⢿⠃
//⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡄⢠⣆⠀⣴⣼⣷⣾⣷⣜⣛⡟⠋
//⠀⠀⠀⣤⣄⠀⠀⢀⡄⠀⣾⣗⣀⣿⡏⣼⣿⣿⣿⡓⣿⣧⠿⠿⠿⠟⠀
//⠀⠀⢰⣿⡇⠀⢀⣿⡧⠔⣿⣯⣮⣿⡥⣿⣿⢶⣿⣧⠞⢷⣿⣾⣷⡶⠀
//⠀⠀⢸⡿⡀⠀⢿⣿⡃⣺⣿⡿⢻⣿⣔⣺⣿⡿⠟⣿⣿⣷⣶⣶⡷⠀⠀
//⠀⠀⢹⣿⡂⠀⢵⣿⠁⢬⣿⣏⢚⣿⣿⡾⣿⣿⣶⣤⣭⣈⡁⠁⠀⠀⠀
//⠀⠀⠀⣿⢅⠀⢹⣿⢅⣼⣿⣿⣏⠙⣿⣷⣷⣏⠟⠟⠻⠛⠿⠿⠖⠀⠀
//⠀⠀⠀⠘⣿⣠⠾⢿⣿⣶⡾⠿⣿⣿⣦⣯⣛⠿⣿⣷⣶⣦⣀⠀⠀⠀⠀
//⢠⣤⠴⠞⢿⣷⣄⠹⠿⢿⣿⣦⣌⠈⠛⠿⣷⣷⣦⣌⠉⠙⠙⠀⠀⠀⠀
//⠀⠀⠀⠀⠈⠿⣿⣷⣦⣀⠈⠛⢿⣷⣦⣀⠀⠀⠉⠉⠀⠀⠀⠀⠀⠀⠀
//⠀⠀⠀⠀⠀⠀⠀⠙⠻⢿⣷⣶⣦⣌⡙⠻⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
//⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠈⠙⠛⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
// 🌿ㅣSilverFern NZ
// https://dsc.gg/silverfern
// https://disboard.org/server/1155691009792028773
// https://www.unfocused.org/server/1155691009792028773
//
// Created by Evilsaint1022
// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

// ------------------------------------------------- @Index.js ----------------------------------------------------------------------

require('dotenv').config();
const { loadEvents } = require('../Handlers/eventHandler');
const commandHandler = require('../Handlers/commandHandler');
const { registerCommands } = require('./register-commands');
const { Client, Collection, Partials, GatewayIntentBits, ActivityType, bold } = require('discord.js');
const { user, Message, GuildMember, ThreadMember } = Partials;

// Load Console Colors --------------------------------------------------------------------------------------------------------------

const colors = require('colors'); // For console colors

// loads colors globally for console use.

// ----------------------------------------------------------------------------------------------------------------------------------

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [user, Message, GuildMember, ThreadMember]
});

// Collections for commands and events ---------------------------------------------------------------------------------------------

client.events = new Collection();
client.commands = new Map();

// Ready Event ---------------------------------------------------------------------------------------------------------------------

client.once("ready", () => {
    console.log(`[🌿│${client.user.tag} Is Online!]`.bold.green);

    // Registers Application Commands
    registerCommands(client);

    // Loading the Handlers
    loadEvents(client);
    commandHandler(client);

// Set bot activity ----------------------------------------------------------------------------------------------------------------

    setInterval(() => {
        const activities = [
            "𝗪𝗻𝗱 𝗯𝗲𝘀𝘁 𝗺𝗼𝗱 🔥",
            "𝗣𝗮𝗰𝗸𝗶𝗻𝗴 𝗻 𝗦𝗮𝘃𝗶𝗻𝗴",
            "🦐𝙎𝙝𝙧𝙞𝙢𝙥",
            "🌿𝗦𝗶𝗹𝘃𝗲𝗿𝗙𝗲𝗿𝗻 𝗡𝗭",
            "𝗕𝘂𝗶𝗹𝘁 𝗹𝗶𝗸𝗲 𝗔 𝗠𝗶𝘁𝗿𝗲 𝟭𝟬",
            "𝗦𝗵𝗼𝗽𝗽𝗶𝗻𝗴 𝗮𝘁 𝗣𝗮𝗸𝗻𝗦𝗹𝗮𝘃𝗲",
            "𝙞 𝙨𝙚𝙚 𝙮𝙤𝙪 👀",
        ];
        const activity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity(activity, { type: ActivityType.Custom });
    }, 5000); // Update activity every 5 seconds
});

// Interaction Command Handler -----------------------------------------------------------------------------------------------------

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Client Login ---------------------------------------------------------------------------------------------------------------------

client.login(process.env.TOKEN);
