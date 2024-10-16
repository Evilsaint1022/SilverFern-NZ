require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const commands = [

// ------------------------------------------------- @Everyone Application Commands ---------------------------------------------------------------------
    {
        name: 'ping',
        description: 'Checks the bot latency!',
    },
    {
        name: 'invite',
        description: 'The Invite Link',
    },
    {
        name: 'youtube',
        description: 'The Youtube Link',
    },
    {
        name: 'spotify',
        description: 'The Spotify Link',
    },
    {
        name: 'dog',
        description: 'Get a random dog image from The Dog API',
    },
    {
        name: 'cat',
        description: 'Get a random cat image from The Cat API',
    },
    {
        name: 'github',
        description: 'The GitHub Repository Link',
    },
// ------------------------------------------------- @Staff Application Commands -----------------------------------------------------------------------

    {
        name: 'echo',
        description: 'Staff only command',
        options: [
            {
                name: 'message',
                description: 'The message you want to echo',
                type: 3,
                required: true,
            },
        ],
    },
    {
        name: 'stop',
        description: 'Staff only command!',
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const registerCommands = async (client) => {
    try {
     await rest.put(
        Routes.applicationGuildCommands (process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
     )

    } catch (error) {
        console.log(`there was an error: ${error}`);
    }
};
module.exports = { registerCommands };