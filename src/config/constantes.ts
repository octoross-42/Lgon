export const PREFIX  = "lgon"
import { MessageFlags } from "discord.js";

export const CONSTANTES =
{
	FLAGS: MessageFlags.Ephemeral | MessageFlags.SuppressNotifications,
	PREFIX  : PREFIX, 
	MIN_NBR_PLAYERS : 1,
	TURN_TIME_MS: 30000,
	GAME_CHANNEL_NAME : "lgon-deroulement",
	ROLES_CHANNEL_NAME : "lgon-roles",
	ERRORS_CHANNEL_NAME : "lgon-erreurs",

	ROLES_ORDER : ["Doppleganger",
		"Cupipute", 
		"Assassin", 
		"Lapin Des Montagnes",
		"Loup-garou", 
		"Loup-alpha", 
		"Loup-chaman", 
		"Loup-dormeur", 
		"Sbire", 
		"Apprentie-tanneur",
		"Franc-maçon",
		"La Chose",
		"Voyante",
		"Apprentie-voyante",
		"Voleur",
		"Sorcière",
		"Noiseuse",
		"Soulard",
		"Insomniaque",
		"Blob",
		"Tanneur",
		"Prince",
		"Garde du corps",
		"Chasseur",
		"Villageois"],

    COMMANDS :
	{
        BOT :
		{
			MISC:
			{
				CLEAR_CHANNEL:
				{
					name : "clear_channel",		
					description : "Efface les 100 derniers messages du channel ciblé",
					nbrArgsRequired : 1,
					cooldown: 1,
					where: "guild",
					usage : `\`${PREFIX}\` \`clear_channel\` \`nom_channel\``,
				},
				COEURS:
				{
					name : "🧡",		
					description : "Du Love en masse",
					nbrArgsRequired : 0,
					cooldown: 0,
					where: "guild",
					aliases: ["gnah", "🤍", "🤎", "♥️", "🧡", "❣️", "🖤", "💝", "💜", "💚", "💙", "💘", "💗", "💖", "💓", "💟", "💛", "❤️", "💕", "💞"], 
					usage : `\`${PREFIX} \` et un petit coeur`,
				}
			},
			SETUP:
			{
				GET_READY:
				{
					name : "get_ready",		
					description : "Définir les channels jeu du serveur",
					nbrArgsRequired : 0,
					cooldown: 1,
					where: "guild",
				},
				SET_CHANNEL:
				{
					name : "set_channel",		
					description : "Configure le channel sur lequel le bot fait dérouler la partie",
					nbrArgsRequired : 0,
					cooldown: 1,
					where: "guild",
					usage : `\`${PREFIX}\` \`set_channel\` seul pour chercher automatiquement ou \`type_channel\` (jeu, ROLES_DATA ou erreurs) puis \`id_channel\``,
				},
			}
		},

		GAME:
		{
			CONTROLS:
			{
				CREATE_PARTIE:
				{
					name : "create_partie",		
					description : "Crée une partie dans un serveur",
					nbrArgsRequired : 0,
					cooldown: 1,
					where: "guild",
					aliases: ["partie"], 
					usage : `\`${PREFIX} create_partie\``,
					
					
				},
				STOP:
				{
					name : "stop",		
					description : "Arrête la partie",
					nbrArgsRequired : 0,
					cooldown: 10,
					where: "guild",
					aliases: ["stop"], 
					usage : `\`${PREFIX} stop\``,
					
				},
				REINIT:
				{
					name : "reset",
					description : "Reset la partie, on supprime tout",
					nbrArgsRequired : 0,
					cooldown: 10,
					where: "guild",
					
				},
				
			},
			DATA:
			{	
			    RECAP:
				{
					name : "recap",		
					description : "Recap pour la fin de partie",
					nbrArgsRequired : 0,
					cooldown: 1,
					where: "guild",
					aliases: ["recapitulatif"], 
					usage : `\`${PREFIX} recap\``,
				},
	
				PLAYERS_DATA:
				{
					name : "joueurs",		
					description : "Afficher les joueurs",
					nbrArgsRequired : 0,
					cooldown: 1,
					where: "guild",
					aliases: ["joueurs"], 
					usage : `\`${PREFIX} joueurs\``,
				},
				ROLES_DATA:
				{
					name : "ROLES_DATA",		
					description : "Afficher les ROLES_DATA",
					nbrArgsRequired : 0,
					cooldown: 1,
					where: "guild",
					aliases: ["ROLES_DATA"], 
					usage : `\`${PREFIX} ROLES_DATA\``,
				},
				
				
			},
			SETUP:
			{
				ROLES:
				{
					SET_ROLES:
					{
						name : "set_roles",
						description : "fixe un nombre de rôles à la composition",
						nbrArgsRequired : 2,
						cooldown: 0,
						where: "guild",
						aliases: ["set_roles", "set"], 
						usage : `\`${PREFIX} set_roles\` \`quantité du rôle fixé\` \`role_name\``,
					},
					REMOVE_ROLES:
					{
						name : "remove_roles",
						description : "enlève des rôles à la composition",
						nbrArgsRequired : 1,
						cooldown: 0,
						where: "guild",
						aliases: ["remove_roles", "remove", "enleve"], 
						usage : `\`${PREFIX} remove_roles\` \`quantité du rôle ajouté\` \`role_name\``,
					},
				}
       		},
        },
    },

    ROLES :
	{
        INDEPENDANTS:
		{
            ASSASSIN:
			{
                name: "assassin",
				category: "Independant",
                description : "L'assassin désigne sa cible la nuit qui est autre que lui",
                cdv : "Il doit tuer sa cible pour gagner",
                usage : `\`${PREFIX} action nom ou tag d'un joueur\` (dans liste des joueurs de début de partie)` ,
                action: true,
				information: false,
				vote: false,
            },
            APPRENTIE_TANNEUR:
			{
                name: "apprentie-tanneur",
				category: "Independant",
                description : "L'Apprentie-tanneur reçoit s'il existe le nom du joueur étant tanneur et sinon devient Tanneur",
                cdv : "Le Tanneur doit mourir",
                usage : `L'Apprentie-tanneur n'a pas d'action'` ,
                aliases: ["app-tanneur"],
                action: false,
				information: true,
				vote: false,
            },
            TANNEUR:
			{
                name: "tanneur",
				category: "Independant",
                description : "Il veut mourir",
                cdv : "Le Tanneur doit mourir, le Tanneur gagne seul avec les Apprenties-tanneur",
                usage : "Il n'a pas d'action",
                action: true,
				information: false,
				vote: false,
            },
            BLOB:
			{
                name: "blob",
				category: "Independant",
                description : `Le Blob s'expand dans la nuit selon ce qu'on lui indique dans son entourage`,
                cdv : "Aucun des membres faisant parti du Blob ne doit mourir",
                usage : "Il n'a pas d'action" ,
                action: false,
				information: false,
				vote: false,
            },
            LAPIN:
			{
                name: "lapin des montagnes",
				category: "Independant",
                description : `Le lapin va manger les carottes de quelqu'un qui s'en aperçoit et veut le tuer, ce qui devient son but`,
                cdv : "Il doit survivre",
                usage : `\`${PREFIX} action\` nom ou tag d'un joueur ` ,
                aliases: ["lapin"],
                action: true,
				information: false,
				vote: false,
            },
        },

        
        LOUPS :
		{
           
            LOUP_ALPHA :
			{
                name: "loup-alpha",
				category: "Loup",
                description: "Un Loup-garou qui contamine une personne dans la nuit",
                cdv: "Aucun Loup ne doit mourir",
                usage: `S'il est seul : \`${PREFIX} action\` \`droite\` ou \`milieu\` ou \`gauche\` et pour contaminer : \`${PREFIX} action\` nom ou tag d'un joueur`,
                aliases: ["lga"],
                action: true,
				information: false,
				vote: false,
            },
            LOUP_CHAMAN :
			{
                name: "loup-chaman",
				category: "Loup",
                description: "Un Loup-garou qui regarde le rôle d'une personne dans la nuit",
                cdv: "Aucun Loup ne doit mourir",
                usage: `S'il est seul : \`${PREFIX} action\` \`droite\` ou \`milieu\` ou \`gauche\` et pour voir une carte : \`${PREFIX} action\` nom ou tag d'un joueur`,
                aliases: ["lgc"],
                action: true,
				information: false,
				vote: false,
            },
            LOUP_DORMEUR :
			{
                name: "loup-dormeur",
				category: "Loup",
                description: "Le Loup-dormeur ne se réveille pas dans la nuit mais les autres loups ont connaissance de son identité de Loup",
                cdv: "Aucun Loup ne doit mourir",
                usage: `Il dort`,
                aliases: ["lgd"],
                action: false,
				information: false,
				vote: false,
            },
           
        },

        VILLAGEOIS :
		{
            APPRENTIE_VOYANTE :
			{
                name: "apprentie-voyante",
				category: "Villageois",
                desscription: "L'Apprentie-voyante regarde le rôle de quelqu'un ou une carte au centre",
                cdv: "L'Apprentie-voyante est une villageoise, elle doit tuer un Loup pour gagner",
                usage: `\`${PREFIX} action nom ou tag d'un joueur\` (dans liste des joueurs de début de partie)`,
                aliases: ["app-voyante"],
                action: true,
				information: false,
				vote: false,
            },
            CHASSEUR :
			{
                name: "chasseur",
				category: "Villageois",
                desscription: "A sa mort, le chasseur désigne une personne qui meurt avec lui",
                cdv: "Le Chasseur est un villageois, il doit tuer un Loup pour gagner",
                usage: `Il n'a pas d'action`,
                action: false,
				information: false,
				vote: true,
            },
            CUPIPUTE :
			{
                name: "cupipute",
				category: "Villageois",
                desscription: "Cupipute visite quelqu'un dans la nuit qui ne peut plus jouer et qui n'en est informé que s'il a un rôle à informations",
                cdv: "Cupipute est une villageoise, elle doit tuer un Loup pour gagner",
                usage: `\`${PREFIX} action nom ou tag d'un joueur\` (dans liste des joueurs de début de partie)`,
                aliases: ["pute"],
                action: true,
				information: false,
				vote: false,
            },
            DOPPLEGANGER :
			{
                name: "doppleganger",
				category: "Villageois",
                desscription: "Le Doppleganger copie le rôle de quelqu'un qu'il joue juste après",
                cdv: "Le Doppleganger est un villageois, il doit tuer un Loup pour gagner",
                usage: `\`${PREFIX} \` action nom ou tag d'un joueur (dans liste des joueurs de début de partie)`,
                aliases: ["dopple"],
                action: true,
				information: false,
				vote: false,

            },
            FRANC_MACON :
			{
                name: "franc-maçon",
				category: "Villageois",
                desscription: "Le Franc-maçon prend connaissance de l'identité de l'autre Franc-maçon en jeu",
                cdv: "Le Franc-maçon est un villageois, il doit tuer un Loup pour gagner",
                usage: `\`${PREFIX} action nom ou tag d'un joueur\` (dans liste des joueurs de début de partie)`,
                aliases: ["fm"],
                action: false,
				information: true,
				vote: false,
            },
            GARDE :
			{
                name: "garde du corps",
				category: "Villageois",
                desscription: "Le vote du Garde rend invulnérable",
                cdv: "Le Garde du corps est un villageois, il doit tuer un Loup pour gagner",
                usage: `Il n'a pas d'action`,
                aliases: ["garde"],
                action: false,
				information: false,
				vote: true,

            },
            INSOMNIAQUE :
			{
                name: "insomniaque",
				category: "Villageois",
                desscription: "L'Insomniaque prend connaissance de son rôle en fin de nuit",
                cdv: "L'Insomniaque est un villageois, il doit tuer un Loup pour gagner",
                usage: `Il n'a pas d'action`,
                action: false,
				information: true,
				vote: false,
            },
            LA_CHOSE :
			{
                name: "la chose",
				category: "Villageois",
                description: "La Chose tapote l'épaule d'une personne à sa droite ou à sa gauche qui est notifiée du tapotement",
                cdv: "La Chose est une villageoise, il doit tuer un Loup pour gagner",
                usage: `\`${PREFIX} action\` \`gauche\` ou \`droite\``,
                aliases: ["chose"],
                action: true,
				information: false,
				vote: false,

            },
            
            PRINCE :
			{
                name: "prince",
				category: "viillageois",
                description: "Le Prince ne peut pas mourir",
                cdv: "Le Prince est une villageoise, il doit tuer un Loup pour gagner",
                usage: `Il se contente d'exister`,
                action: false,
				information: false,
				vote: true,
            },
            SORCIERE :
			{
                name: "sorciere",
				category: "Villageois",
                description: "La Sorcière regarde une carte au centre et décide de ne rien faire ou de l'attribuer à un joueur (elle y-compris)",
                cdv: "La Sorcière est une villageoise, il doit tuer un Loup pour gagner",
                usage: `\`${PREFIX} action \`gauche\`, \`milieu\` \`droite\` puis \`${PREFIX} action\` et le nom ou tag d'un joueur`,
                aliases: ["sorciere"],
                action: true,
				information: false,
				vote: false,
            },
            
          
            VOLEUR :
			{
                name: "voleur",
				category: "Villageois",
                description: "Le Voleur échange sa carte avec un joueur et prend connaissance de son nouveau rôle",
                cdv: "Le Voleur est une villageoise, il doit tuer un Loup pour gagner",
                usage: `\`${PREFIX} action\` nom ou tag d'une personne`,
                aliases: ["voleur"],
                action: true,
				information: false,
				vote: false,
            },
            VOYANTE :
			{
                name: "voyante",
				category: "Villageois",
                description: "La Voyante regarde le rôle d'une personne ou de 2 cartes au centre",
                cdv: "La Voyante est une villageoise, elle doit tuer un Loup pour gagner",
                usage: `\`${PREFIX} action\` nom ou tag d'une personne ou 2 centres différents (\`gauche\` \`milieu\` ou \`droite\`)`,
                aliases: ["voyante"],
                action: true,
				information: false,
				vote: false,
            },
        },
    }
}


//https://www.youtube.com/watch?v=EvlzXO8DDl0&list=PLuWyq_EO5_ALOnpxptlqQA5FR75Nza2PQ&index=26