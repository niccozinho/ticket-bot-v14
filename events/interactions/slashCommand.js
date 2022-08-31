const { ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

      if(!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if(!command) return interaction.reply({
            content: "Command is outdated.",
            ephemeral: true
        });

        if(command.developer && interaction.user.id !== "")
        return interaction.reply({
            content: "Command available only for the developer.",
            ephemeral: true
        });

        command.execute(interaction, client);
    }
}
