const { loadCommands } = require("../../handlers/commandHandler");

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log("All the things have been loaded!")
        loadCommands(client);
    }
}