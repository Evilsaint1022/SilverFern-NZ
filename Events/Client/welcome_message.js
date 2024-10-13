// events/welcome_message.js

module.exports = {
    name: 'guildMemberAdd', // Event name to listen for new members
    once: false, // Change to false as this event can happen multiple times
        execute(member) {
        // The ID of the channel where you want to send the message
        const Chat_Id = '1155691009792028779';

        // List of GIF URLs (replace these with actual GIF URLs you want to use)
        const NZList = [
            'https://giphy.com/gifs/new-zealand-flag-nz-Qa4cAGMr5NfUuINAXd', // GIF 1
            'https://giphy.com/gifs/worldrugby-rugby-new-zealand-all-blacks-dTzxyGfsXph9jUwQDz', // GIF 2
            'https://giphy.com/gifs/hunt-for-the-wilderpeople-taikia-waititi-l0K4dELlG3hXA38m4', // GIF 3
            'https://giphy.com/clips/storyful-nye-new-zealand-auckland-k6upzlDw6EXhdcWiEU', // GIF 4
            'https://giphy.com/gifs/headlikeanorange-landscape-new-zealand-ebusuVHxUlZp6', // GIF 5
            'https://giphy.com/gifs/BoxOfficetr-lotr-lord-of-the-rings-frodo-69iB0zVgoKkatcVDrA', // GIF 6
        ];
        
        // Fetch the channel by ID
        const channel = member.guild.channels.cache.get(Chat_Id);

        // If the channel exists, send a message after a delay
        if (channel) {
            // Set a 5-second (5000 milliseconds) delay
            setTimeout(() => {
                channel.send(`🌿│Welcome to the SilverFern NZ, ${member.displayName}!`)
                const randomGif = NZList[Math.floor(Math.random() * NZList.length)];
                // Send the random GIF in the channel
                channel.send(randomGif)
                    .catch(error => console.error('Error sending message:', error));
            }, 5000); // 5000 milliseconds delay
        } else {
            console.error('Channel not found!');
        }
    },
};
