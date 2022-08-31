const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
} = require("discord.js");
const { loadCommands } = require("../../handlers/commandHandler");
const { loadEvents } = require("../../handlers/eventHandler");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload all the things (commands/events) of the bot.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) => options
    .setName("events")
    .setDescription("Reload all the events that I have."))
    .addSubcommand((options) => options
    .setName("commands")
    .setDescription("Reload all the commands that I have.")),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        const subCommand = interaction.options.getSubcommand();
        switch(subCommand) {
            case "events" : {
                for( const [key, value] of client.events )
                client.removeListener(`${key}`, value, true);
                loadEvents(client);
                interaction.reply({ content: `:thumbsup: Successfully reloaded all events.`, ephemeral: true });
            }
            break;
            case "commands" : {
                loadCommands(client);
                interaction.reply({ content: `:thumbsup: Successfully reloaded all commands.`, ephemeral: true });
            }
            break;
        }
    }
}