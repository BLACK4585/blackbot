const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Sagt etwas')
		.addStringOption(option =>
			option
				.setName('nachricht')
				.setDescription('Die Nachricht, die gesagt werden soll')
				.setRequired(true)),

	async execute(interaction) {
		interaction.reply({
			content: interaction.options.getString('nachricht'),
		});
	},
};