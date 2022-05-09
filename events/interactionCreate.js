module.exports = async (client, interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (err) {
		if (err) {
			console.error(err);
			await interaction.reply({
				content: 'An error occurred while executing that command!',
				ephemeral: true,
			});
		}
	}
};