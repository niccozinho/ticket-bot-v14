const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const { QuickDB } = require("quick.db");

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./handlers/eventHandler");

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.settings = new QuickDB();
loadEvents(client);

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(client.config.token);