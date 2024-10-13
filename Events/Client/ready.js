const { Client, ModalBuilder } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client){
        console.log(`${client.user.username} is now Online.`);
    },
};