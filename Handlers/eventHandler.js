function loadEvents(client) {
    const ascii = require('ascii-table');
    const fs = require('fs');
    const table = new ascii().setHeading("Events", "Status");

    const folders = fs.readdirSync('./Events'); // Get all the folders in the Events directory
    for (const folder of folders) {
        table.addRow(folder, ""); // Add the folder name as a title row

        const files = fs.readdirSync(`./Events/${folder}`).filter((file) => file.endsWith(".js"));
        for (const file of files) {
            const event = require(`../Events/${folder}/${file}`); // Load the event file

            // Register event based on whether it uses REST or not
            if (event.rest) {
                if (event.once)
                    client.rest.once(event.name, (...args) => event.execute(...args, client));
                else
                    client.rest.on(event.name, (...args) => event.execute(...args, client));
            } else {
                if (event.once)
                    client.once(event.name, (...args) => event.execute(...args, client));
                else
                    client.on(event.name, (...args) => event.execute(...args, client));
            }

            // Add the event file under the respective folder title
            table.addRow(`  ${file}`, "Loaded"); // Indent the file name for better readability
        }
    }

    // Print the table of events and a success message
    console.log(table.toString());
    console.log("(✅│Successfully Loaded Events)".bold.white);
}

module.exports = { loadEvents };
