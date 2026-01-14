// TODO CHECK double de roels
import { LgonRole } from "../../classes/LgonRole/LgonRole.js";
import { Player } from "../../classes/Game/Player.js";
import { AwaitingInteraction } from "../../classes/Embed/AwaitingInteraction.js"
import { CONSTANTES } from "../../config/constantes.js";

import { LgonRoleMeta, Client, User, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, StringSelectMenuInteraction, TextChannel, DMChannel } from "discord.js";
import { LgonRoleGenerator } from "src/classes/LgonRole/LgonRoleGenerator.js";

class SoulardActionEmbed extends AwaitingInteraction
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
			.setDescription(`You can preshot your action as a ${player.role!.generator.printName}\nYour action will only be done on your turn`)
			.addFields({name: "Select one center card", value: "As you're drunk, you mistakly exchange your card at the bar, one of the center, choose one, not optional, and you won't know which card it is"});
	
		const selectPlayer1Menu = new StringSelectMenuBuilder()
			.setCustomId("select_center")
			.setPlaceholder("Select center")
			.setMinValues(1)
			.setMaxValues(1)
			.addOptions(["left", "middle", "right"].map(center =>
				new StringSelectMenuOptionBuilder()
					.setLabel(center)
					.setValue(center)
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

	public async select(bot: Client, selected: StringSelectMenuInteraction, user: User): Promise<void>
	{
		this.player.role!.register_action(bot, selected.values);
		selected.deferUpdate();
	}
}

class Soulard extends LgonRole
{
	center: "left" | "middle" | "right" | null;
	
	constructor(generator: LgonRoleGenerator, owner: Player | string, id: number)
	{
		super(generator, owner, id);
		this.center = null;
	}

	// TODO faire plusieurs types de classes -> Action et tout

	async preshot_action(bot: Client)
	{
		let actionEmbed = new SoulardActionEmbed(this.owner as Player);
		let dm = await (this.owner as Player).user.createDM();
		await actionEmbed.send(bot, dm);
	}

	register_action(bot: Client, actions: string[]): void
	{
		this.center = actions[0] as "left" | "middle" | "right";
	}
}

const roleGenerator: LgonRoleGenerator = new LgonRoleGenerator(
	{
		name: "soulard",
		category: "Villageois",
		description: "La Soulard échange son rôle avec un rôle au centre mais n'en prend pas connaissance",
		cdv: "La Soulard est une villageoise, il doit tuer un Loup pour gagner",
		usage: `\`${CONSTANTES.PREFIX} action \`gauche\` \`milieu\` ou \`droite\``,
		aliases: ["soulard"],
		action: false,
		information: false,
		vote: false,
	},
	Soulard
)

export default {
	roleGenerator
}