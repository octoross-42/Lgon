// TODO CHECK double de roels
import { NightRole } from "../../../entities/LgonRole/NightRole.js";
import { RoleGenerator } from "../../../entities/LgonRole/RoleGenerator.js";
import { PREFIX } from "../../../../../constants.js";
import { makeLgonId } from "../../../../../types/LgonId.js";
// class SoulardActionEmbed extends AwaitingInteraction
// {
// 	actionRow: ActionRowBuilder<StringSelectMenuBuilder>;
// 	player: Player;
// 	role: NightRole;
// 	// followUpEmbed: ; TODO faire un follow up message sur le premier choix pour confimer choix du joueur, puis ajouter des reactions quand tour si confir pour joueur
// 	constructor(player: Player)
// 	{
// 		super();
// 		this.player = player;
// 		this.role = player.role!;
// 		this.embed.setTitle("Action")
// 			.setDescription(`You can preshot your action as a ${player.role!.generator.name}\nYour action will only be done on your turn`)
// 			.addFields({name: "Select one center card", value: "As you're drunk, you mistakly exchange your card at the bar, one of the center, choose one, not optional, and you won't know which card it is"});
// 		const selectPlayer1Menu = new StringSelectMenuBuilder()
// 			.setCustomId("select_center")
// 			.setPlaceholder("Select center")
// 			.setMinValues(1)
// 			.setMaxValues(1)
// 			.addOptions(["left", "middle", "right"].map(center =>
// 				new StringSelectMenuOptionBuilder()
// 					.setLabel(center)
// 					.setValue(center)
// 		));
// 		this.actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectPlayer1Menu);
// 	}
// 	async send(bot: Client, channel: TextChannel | DMChannel)
// 	{
// 		await channel.send({
// 			embeds: [this.embed],
// 			components: [this.actionRow],
// 			flags: CONSTANTES.FLAGS
// 		}).then(msg =>
// 			bot.awaitingInteractions.set(msg.id, this));
// 	}
// 	public async select(bot: Client, selected: StringSelectMenuInteraction, user: User): Promise<void>
// 	{
// 		this.player.role!.register_action(bot, selected.values);
// 		selected.deferUpdate();
// 	}
// }
class Soulard extends NightRole {
    center;
    constructor(meta, owner) {
        super(meta, owner);
        this.center = null;
    }
}
export const roleGenerator = new RoleGenerator({
    id: makeLgonId("role", "soulard"),
    name: "Soulard",
    category: "Villageois",
    description: "La Soulard échange son rôle avec un rôle au centre mais n'en prend pas connaissance",
    cdv: "La Soulard est une villageoise, il doit tuer un Loup pour gagner",
    usage: `\`${PREFIX} action \`gauche\` \`milieu\` ou \`droite\``,
    aliases: ["soulard"],
    action: false,
    information: false,
    vote: false,
}, Soulard);
