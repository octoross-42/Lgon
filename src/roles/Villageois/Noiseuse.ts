import { LgonRole } from "../../classes/LgonRole/LgonRole.js";
import { Player, getPlayer } from "../../classes/Game/Player.js";
import { CONSTANTES } from "../../config/constantes.js";
import { AwaitingInteraction } from "../../classes/Embed/AwaitingInteraction.js"

import { LgonRoleHelp, Client, Message, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageReaction, User, TextChannel, DMChannel, StringSelectMenuInteraction, ButtonInteraction } from "discord.js";

class NoiseuseActionEmbed extends AwaitingInteraction
{
	actionRow: ActionRowBuilder<StringSelectMenuBuilder>;
	player: Player;
	role: LgonRole;
	// followUpEmbed: ; TODO faire un follow up message sur le premier choix pour confimer choix du joueur, puis ajouter des reactions quand tour si confir pour joueur

	constructor(player: Player)
	{
		super();
		this.player = player;
		this.role = player.role!;
		this.embed.setTitle("Action")
			.setDescription(`You can preshot your action as a ${player.role!.printName}\nYour action will only be done on your turn`)
			.addFields({name: "Change 2 players cards", value: "The 2 players have to be different, and you can select yourself\nYou also can't see the cards of the players you exchange cards of 🫶"});
	
		const selectPlayer1Menu = new StringSelectMenuBuilder()
			.setCustomId("select_player1")
			.setPlaceholder("Select two players")
			.setMinValues(2)
			.setMaxValues(2)
			.addOptions(player.game!.players.map((player: Player) =>
				new StringSelectMenuOptionBuilder()
					.setLabel(player.name)
					.setValue(player.name)
		));
		this.actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectPlayer1Menu);

	}
	async send(bot: Client, channel: TextChannel | DMChannel)
	{
		await channel.send({
			embeds: [this.embed],
			components: [this.actionRow],
			flags: CONSTANTES.FLAGS
		}).then(msg =>
			bot.awaitingInteractions.set(msg.id, this));
	}

	public async select(bot: Client, selected: StringSelectMenuInteraction,user: User): Promise<void>
	{
		// TODO link select modify (la je crois cest que create)
		// TODO : interdire jeu ou les roles peuvent pas se faire exemple noiseuse a 1 joueur
		// const chosenPlayerName: string = selected;
		console.log("lala : ", selected.values);
		this.player.role!.register_action(bot, selected.values);
		// if (selected.customId)
		selected.deferUpdate();
	}
}


class Noiseuse extends LgonRole
{
	player1: Player | null;
	player2: Player | null;
	
	constructor(help: LgonRoleHelp, printName: string, owner: Player | string, id: number)
	{
		super(help, printName, owner, id);
		this.player1 = null;
		this.player2 = null;
	}

	// TODO faire plusieurs types de classes -> Action et tout

	async preshot_action(bot: Client)
	{
		let actionEmbed = new NoiseuseActionEmbed(this.owner as Player);
		let dm = await (this.owner as Player).user.createDM();
		await actionEmbed.send(bot, dm);
	}

	register_action(bot: Client, actions: string[]): void
	{
		this.player1 = bot.players.get(actions[0])!;
		this.player2 = bot.players.get(actions[1])!;
	}
}

function roleGenerator(help: LgonRoleHelp, printName: string, owner: Player | string, id: number): Noiseuse
{
	return (new Noiseuse(help, printName, owner, id));
}

// TODO CHECK double de roels
const help = CONSTANTES.ROLES.VILLAGEOIS.NOISEUSE;

export
{
	roleGenerator,
	help
}