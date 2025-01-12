const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Play a game of blackjack and bet your balance!')
        .addIntegerOption(option =>
            option.setName('bet')
                .setDescription('The amount to bet')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { user } = interaction;
        const bet = interaction.options.getInteger('bet');
        const username = interaction.user.username;
        const balancePath = path.join(__dirname, '../../Utilities/Economy/Currency/Balance', `${username}.txt`);

        // Check if balance file exists
        if (!fs.existsSync(balancePath)) {
            return interaction.reply({ content: `You don't have a balance file. Please contact an admin.`, ephemeral: true });
        }

        // Retrieve balance
        let balance;
        try {
            const balanceData = fs.readFileSync(balancePath, 'utf8').trim();
            balance = parseInt(balanceData, 10);

            if (isNaN(balance)) {
                throw new Error('Balance is not a valid number');
            }
        } catch (err) {
            console.error(`Error reading balance for user ${username}:`, err.message);
            return interaction.reply({ content: `Unable to read your balance file. Please contact an admin.`, ephemeral: true });
        }

        // Validate bet
        if (bet > balance) {
            return interaction.reply({ content: `You don't have enough balance to place this bet.`, ephemeral: true });
        } else if (bet <= 0) {
            return interaction.reply({ content: `Bet amount must be greater than zero.`, ephemeral: true });
        }

        // Initialize game
        const drawCard = () => Math.floor(Math.random() * 10) + 1; // Simplified card draw (1-10)

        let playerCards = [drawCard(), drawCard()];
        let dealerCards = [drawCard(), drawCard()];
        let playerTotal = playerCards.reduce((acc, card) => acc + card, 0);
        let dealerTotal = dealerCards.reduce((acc, card) => acc + card, 0);

        // Helper function to check if game is over
        const checkGameResult = () => {
            if (playerTotal > 21) return 'lose'; // Player busted
            if (dealerTotal > 21) return 'win'; // Dealer busted
            if (dealerTotal >= 17 && playerTotal > dealerTotal) return 'win';
            if (dealerTotal >= 17 && playerTotal < dealerTotal) return 'lose';
            if (dealerTotal >= 17 && playerTotal === dealerTotal) return 'tie';
            return null; // Game continues
        };

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('hit')
                    .setLabel('Hit')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('stand')
                    .setLabel('Stand')
                    .setStyle(ButtonStyle.Secondary)
            );

        // Send initial game state
        const embed = {
            color: 0xFFFF00,
            title: `**__♦️ Blackjack ♦️__**`,
            description: `Placed Bet: ${bet} Ferns 🌿` + '\n`Your move: Hit or Stand?`',
            thumbnail: { url: user.displayAvatarURL() },
            fields: [
                { name: 'Your Cards', value: playerCards.join(', '), inline: true },
                { name: 'Your Total', value: playerTotal.toString(), inline: true },
                { name: `Dealer's Cards`, value: dealerCards[0] + ', ?', inline: false }
            ]
        };

        const message = await interaction.reply({ embeds: [embed], components: [buttons], fetchReply: true });

        const filter = (i) => i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.customId === 'hit') {
                playerCards.push(drawCard());
                playerTotal = playerCards.reduce((acc, card) => acc + card, 0);
            } else if (buttonInteraction.customId === 'stand') {
                while (dealerTotal < 17) {
                    dealerCards.push(drawCard());
                    dealerTotal = dealerCards.reduce((acc, card) => acc + card, 0);
                }
            }

            const result = checkGameResult();
            if (result) {
                // Update balance
                if (result === 'win') {
                    balance += bet;
                } else if (result === 'lose') {
                    balance -= bet;
                }

                // Save updated balance
                fs.writeFileSync(balancePath, balance.toString(), 'utf8');

                const resultEmbed = {
                    color: result === 'win' ? 0x00FF00 : result === 'lose' ? 0xFF0000 : 0xFFFF00,
                    title: `**__♠️ Blackjack Results ♠️__**`,
                    description: `You ${result === 'win' ? 'won' : result === 'lose' ? 'lost' : 'tied'} your bet of ${bet} Ferns 🌿!`,
                    thumbnail: { url: user.displayAvatarURL() },
                    fields: [
                        { name: 'Your Cards', value: playerCards.join(', '), inline: true },
                        { name: 'Your Total', value: playerTotal.toString(), inline: true },
                        { name: `Dealer's Cards`, value: dealerCards.join(', '), inline: false, },
                        { name: `Dealer's Total`, value: dealerTotal.toString(), inline: true },
                        { name: '**__Your Balance__**', value: balance.toString(), inline: false }
                    ]
                };                

                await buttonInteraction.update({ embeds: [resultEmbed], components: [] });
                collector.stop();
            } else {
                const updatedEmbed = {
                    color: 0xFFFF00,
                    title: `**__♣️ Blackjack ♣️__**`,
                    description: `Bet Placed: ${bet} Ferns 🌿` + '\n`Your move: Hit or Stand?`',
                    thumbnail: { url: user.displayAvatarURL() },
                    fields: [
                        { name: 'Your Cards', value: playerCards.join(', '), inline: true },
                        { name: 'Your Total', value: playerTotal.toString(), inline: true },
                        { name: `Dealer's Cards`, value: dealerCards[0] + ', ?', inline: false } // Still hidden
                    ]
                };

                await buttonInteraction.update({ embeds: [updatedEmbed], components: [buttons] });
            }
        });

        collector.on('end', () => {
            if (!message.editable) return;
            message.edit({ components: [] });
        });
    }
};
