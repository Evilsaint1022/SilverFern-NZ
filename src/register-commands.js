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
    {
        name: 'balance',
        description: 'Check your current balance.',
    },
    {
    name: 'leaderboard',
    description: 'Displays the Leaderboard.',
    },
    {
        name: 'avatar',
        description: 'Displays the avatar of a specified user or your own.',
        options: [
            {
                name: 'user',
                description: "The user whose avatar you want to see",
                type: 6,
                required: true,
            },
        ],
    },
    {
        name: 'level',
        description: 'Check your current level',
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
    {
        name: 'mute',
        description: 'Mute a member by adding and removing specific roles',
        options: [
            {
                name: 'member',
                description: 'The member to mute',
                type: 6,
                required: true,
            },
        ],
    },
    {
        name: 'unmute',
        description: 'Mute a member by adding and removing specific roles',
        options: [
            {
                name: 'member',
                description: 'The member to mute',
                type: 6,
                required: true,
            },
        ],
    },
    {
        name: 'editlevel',
        description: 'Edit the level of a user.',
        options: [
            {
                name: 'user',
                description: 'The user whose level you want to edit.',
                type: 6,
                required: true,
            },
            {
                name: 'level',
                description: 'The new level value.',
                type: 4,
                required: true,
            },
        ]
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const registerCommands = async (client) => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
    } catch (err) {
        console.error('Error registering commands:', err);
    }
};
module.exports = { registerCommands };