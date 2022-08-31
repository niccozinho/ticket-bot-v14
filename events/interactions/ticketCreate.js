const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType
} = require("discord.js");
const hastebin = require("hastebin");

module.exports = {
  name: "interactionCreate",
  execute(interaction, client) {
    if (!interaction.isButton()) return;
    const { guild, customId, user, guildId } = interaction;

    if (customId === "ticket") {
      if (guild.channels.cache.find((c) => c.topic == user.id)) {
        return interaction.reply({
          content: "Well, I think you already have an open ticket.",
          ephemeral: true,
        });
      } else {
        guild.channels
          .create({
            name: `ticket-${user.username}`,
            type: ChannelType.GuildText,
            parent: client.config.parentTicket,
            topic: interaction.user.id,
            permissionOverwrites: [
              {
                deny: ["ViewChannel"],
                id: guildId,
              },
              {
                allow: ["ViewChannel", "SendMessages"],
                id: interaction.user.id,
              },
              {
                allow: ["ViewChannel", "SendMessages"],
                id: client.user.id,
              },
            ],
          })
          .then((ticketNew) => {
            interaction.reply({
              content: `:thumbsup: Ticket successfully created | <#${ticketNew.id}>`,
              ephemeral: true,
            });
            ticketNew.send({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.color)
                  .setAuthor({ name: "Welcome to your ticket!" })
                  .setDescription(
                    "Now that your ticket has been created, let our Support Team know what's your doubt or what issue you are having. After that, our team will answer you as soon as possible."
                  ),
              ],
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("closeTicket")
                    .setLabel("Close")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("❌"),
                  new ButtonBuilder()
                    .setCustomId("transcriptTicket")
                    .setLabel("Transcript")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("🧾")
                ),
              ],
            });
          });
      }
    } else if (customId === "closeTicket") {
      interaction
        .reply({
          embeds: [
            new EmbedBuilder().setColor(client.config.color).setAuthor({
              name: "This ticket channel will be deleted in 10 seconds, please wait.",
            }),
          ],
        })
        .then(() => {
          setTimeout(() => {
            guild.channels.cache.get(interaction.channelId).delete();
          }, 10000);
        });
    } else if (customId === "transcriptTicket") {
      guild.channels.cache
        .get(interaction.channelId)
        .messages.fetch()
        .then(async (messages) => {
          let a = messages
            .filter((m) => m.author.bot !== true)
            .map(
              (m) =>
                `${new Date(m.createdTimestamp).toLocaleString("en-US")} - ${
                  m.author.username
                }#${m.author.discriminator}: ${
                  m.attachments.size > 0
                    ? m.attachments.first().proxyURL
                    : m.content
                }`
            )
            .reverse()
            .join("\n");
          if (a.length < 1)
            a = "It looks like there was nothing written on the ticket.";
          hastebin
            .createPaste(
              a,
              {
                contentType: "text/plain",
                server: "https://hastebin.com",
              },
              {}
            )
            .then(function (urlToPaste) {
              interaction.reply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setLabel("Sucessfully transcripted!")
                      .setURL(urlToPaste)
                      .setStyle(ButtonStyle.Link)
                      .setEmoji("🔗")
                  ),
                ],
                ephemeral: true,
              });
            });
        });
    }
  },
};
