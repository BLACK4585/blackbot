const { Client, Intents, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
require('dotenv').config();

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

for (const file of eventFiles) {
	const eventName = file.split('.')[0];
	const event = require(`./events/${file}`);
	// client.on(eventName, event.bind(null, client));
	client.on(eventName, (...args) => event(client, ...args));
}

const commands = [];
client.commands = new Collection();
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
	const CLIENT_ID = client.user.id;
	const rest = new REST({
		version: '9',
	}).setToken(process.env.TOKEN);

	(async () => {
		try {
			if (process.env.ENV === 'production') {
				await rest.put(Routes.applicationCommands(CLIENT_ID), {
					body: commands,
				});
				console.log('Successfully registered commands globally!');
			}	else {
				await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
					body: commands,
				});
				console.log('Successfully registered commands locally!');
			}
		} catch (error) {
			if (error) {
				console.error(error);
			}
		}
	})();
});

client.login(process.env.TOKEN);
