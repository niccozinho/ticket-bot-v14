const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Sends the ticket message to a channel."),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const channel = await interaction.guild.channels.cache.find((x) => x.id === "");
    interaction.reply({ content: "Ticket message sent successfully!", ephemeral: true });

    const rowButton = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder().setCustomId('ticket').setLabel('Request Support').setStyle(ButtonStyle.Primary).setEmoji("🧾"),
        new ButtonBuilder().setLabel('GitHub').setURL("https://github.com/niclw").setStyle(ButtonStyle.Link).setEmoji("🔗"));

    const ticketImage = new AttachmentBuilder("ticketimage.png");
    channel.send({ files: [ticketImage], components: [rowButton] }).then((ticketConfig) => {
    client.settings.set(`ticketMessageID-${interaction.guild.id}`, ticketConfig.id)});
  },
};
