import { NightRole } from "../../../entities/LgonRole/NightRole.js";
import { RoleGenerator } from "../../../entities/LgonRole/RoleGenerator.js";
import { PREFIX } from "../../../../../constants.js";
import { makeLgonId } from "../../../../../types/LgonId.js";
// class NoiseuseActionEmbed extends AwaitingInteraction
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
// 			.addFields({name: "Change 2 players cards", value: "The 2 players have to be different, and you can select yourself\nYou also can't see the cards of the players you exchange cards of 🫶"});
// 		const selectPlayer1Menu = new StringSelectMenuBuilder()
// 			.setCustomId("select_players")
// 			.setPlaceholder("Select two players")
// 			.setMinValues(2)
// 			.setMaxValues(2)
// 			.addOptions(player.game!.players.map((player: Player) =>
// 				new StringSelectMenuOptionBuilder()
// 					.setLabel(player.name)
// 					.setValue(player.name)
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
// 	public async select(bot: Client, selected: StringSelectMenuInteraction,user: User): Promise<void>
// 	{
// 		// TODO link select modify (la je crois cest que create)
// 		// TODO : interdire jeu ou les roles peuvent pas se faire exemple noiseuse a 1 joueur
// 		console.log("lala : ", selected.values);
// 		this.player.role!.register_action(bot, selected.values);
// 		selected.deferUpdate();
// 	}
// }
class Noiseuse extends NightRole {
    constructor(meta, owner) {
        super(meta, owner);
    }
}
export const roleGenerator = new RoleGenerator({
    id: makeLgonId("role", "noiseuse"),
    name: "Noiseuse",
    aliases: [],
    category: "Villageois",
    description: "La Noiseuse échange les rôles de 2 personnes sans qu'ils n'en prennent connaissance",
    cdv: "La Noiseuse est une villageoise, il doit tuer un Loup pour gagner",
    usage: `\`${PREFIX} action\` noms ou tags de deux personnes`,
    action: true,
    information: false,
    vote: false,
}, Noiseuse);
