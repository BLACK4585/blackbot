exports.run = (message) => {
	message.channel.send('pong!').catch(console.error);
};

exports.name = 'ping';