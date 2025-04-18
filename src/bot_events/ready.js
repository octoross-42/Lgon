module.exports = bot =>
{
	console.log(`Bot ${bot.user.tag} is online !`);
	bot.user.setStatus("online");
    bot.user.setActivity("P'tit Lg ? 😎");
}