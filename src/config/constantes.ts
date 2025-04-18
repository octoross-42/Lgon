const PREFIX = "lgon"

export const CONSTANTES =
{
	PREFIX : PREFIX,
	MIN_NBR_PLAYERS : 1,
	GAME_CHANNEL_NAME : "lgon-deroulement",
	ROLES_CHANNEL_NAME : "lgon-ROLES_DATA",
	ERRORS_CHANNEL_NAME : "lgon-erreurs",

	ROLES_DATA : ["Doppleganger",
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
		"Blob",       //pour l'instant le blob n'a pas d'influence sur son expansion
		"Tanneur",
		"Prince",
		"Garde du corps",
		"Chasseur",
		"Villageois"],

    COMMANDS :
	{
        BOT :
		{
            GET_READY:
			{
                name : "get_ready",
                category: "bot",
                description : "Définir les channels jeu du serveur",
                nbrArgsRequired : 0,
                cooldown: 1,
                usage : `\`${PREFIX}get_ready\``,
                prive : false,
                serveur : true,
                channelsJeu : false,
            },
            CLEAR_CHANNEL:
			{
                name : "clear_channel",
                category: "bot",
                description : "Efface des messages (100)",
                nbrArgsRequired : 1,
                cooldown: 1,
                usage : `\`${PREFIX}clear_channel\` puis \`nom_channel\``,
                prive : false,
                serveur : true,
                channelsJeu : false,
            },
            SET_CHANNEL:
			{
                name : "set_channel",
                category: "bot",
                description : "Configure le channel sur lequel le bot fait dérouler la partie",
                nbrArgsRequired : 0,
                cooldown: 1,
                usage : `\`${PREFIX}set_channel\` seul pour chercher automatiquement ou \`type_channel\` (jeu, ROLES_DATA ou erreurs) puis \`id_channel\``,
                prive : false,
                serveur : true,
                channelsJeu : false,
            },
            INFOS:
			{
                name : "infos_bot_guild",
                category: "bot",
                description : "Envoie en privé toutes les infos du bot sur ce serveur",
                nbrArgsRequired : 0,
                cooldown: 5,
                aliases: ["infos_bot_guild"], 
                usage : `\`${PREFIX}infos_bot_guild\``,
                prive : false,
                serveur : true,
                channelsJeu : false,
            },
            COEURS:
			{
                name : "🧡",
                category: "bot",
                description : "Du Love en masse",
                nbrArgsRequired : 0,
                cooldown: 0,
                aliases: ["gnah", "🤍", "🤎", "♥️", "🧡", "❣️", "🖤", "💝", "💜", "💚", "💙", "💘", "💗", "💖", "💓", "💟", "💛", "❤️", "💕", "💞"], 
                usage : `\`${PREFIX}\` et un petit coeur`,
                prive : false,
                serveur : false,
                channelsJeu : false,
            },
        },

        BOT_DATA :
		{
            RECAP:
			{
                name : "recap",
                category: "infos",
                description : "Recap pour la fin de partie",
                nbrArgsRequired : 0,
                cooldown: 1,
                aliases: ["recap", "recapitulatif"], 
                usage : `\`${PREFIX}recap\``,
                prive : false,
                serveur : false,
                channelsJeu : false,
            },

            HELP:
			{
                name : "help",
                category: "infos",
                description : "Aide pour utilisation des commandes",
                nbrArgsRequired : 0,
                cooldown: 1,
                aliases: ["help", "aled"], 
                usage : `\`${PREFIX}help\` seul pour la liste des commandes sinon \`<command_name>\` pour l'aide sur la commande`,
                prive : false,
                serveur : false,
                channelsJeu : false,
            },

            PLAYERS_DATA:
			{
                name : "joueurs",
                category: "infos",
                description : "Afficher les joueurs",
                nbrArgsRequired : 0,
                cooldown: 1,
                aliases: ["joueurs"], 
                usage : `\`${PREFIX}joueurs\``,
                prive : false,
                serveur : true,
                channelsJeu : false,
            },
            ROLES_DATA:
			{
                name : "ROLES_DATA",
                category: "infos",
                description : "Afficher les ROLES_DATA",
                nbrArgsRequired : 0,
                cooldown: 1,
                aliases: ["ROLES_DATA"], 
                usage : `\`${PREFIX}ROLES_DATA\``,
                prive : false,
                serveur : true,
                channelsJeu : false,
            },
        },

        PLAYERS_DATA :
		{
            ACTION:
			{
                name : "action",
                category: "joueurs",
                description : "Exécute l'action d'un joueur",
                nbrArgsRequired : 0,
                cooldown: 1,
                aliases: ["action"], 
                usage : `\`${PREFIX}action\` seul pour la liste des rôles sinon \`<role_name>\` pour l'aide sur le rôle`,
                prive : false,
                serveur : false,
                channelsJeu : false,
            },
            
            PLAY:
			{
                name : "joue",
                category: "joueurs",
                description : "Ajouter un joueur",
                nbrArgsRequired : 0,
                cooldown: 1,
                aliases: ["joue"], 
                usage : `\`${PREFIX}joue\`` ,
                prive : false,
                serveur : true,
                channelsJeu : true,
            },
            DEJOUE:
			{
                name : "dejoue",
                category: "joueurs",
                description : "Enlever un joueur",
                nbrArgsRequired : 0,
                cooldown: 1,
                aliases: ["dejoue"], 
                usage : `\`${PREFIX}dejoue\``,
                
                prive : false,
                serveur : true,
                channelsJeu : false,
            },
        },

        ROLES_DATA:
		{
            ADD_ROLES:
			{
                name : "add_roles",
                category: "ROLES_DATA",
                description : "ajoute des rôles à la composition",
                nbrArgsRequired : 1,
                cooldown: 0,
                aliases: ["add_roles", "add"], 
                usage : `\`${PREFIX}add_roles\` \`quantité du rôle ajouté\` \`role_name\``,
                prive : false,
                serveur : true,
                channelsJeu : true,
            },
            SET_ROLES:
			{
                name : "set_roles",
                category: "ROLES_DATA",
                description : "fixe un nombre de rôles à la composition",
                nbrArgsRequired : 2,
                cooldown: 0,
                aliases: ["set_roles", "set"], 
                usage : `\`${PREFIX}set_roles\` \`quantité du rôle fixé\` \`role_name\``,
                prive : false,
                serveur : true,
                channelsJeu : true,
            },
            REMOVE_ROLES:
			{
                name : "remove_roles",
                category: "ROLES_DATA",
                description : "enlève des rôles à la composition",
                nbrArgsRequired : 1,
                cooldown: 0,
                aliases: ["remove_roles", "remove", "enleve"], 
                usage : `\`${PREFIX}remove_roles\` \`quantité du rôle ajouté\` \`role_name\``,
                prive : false,
                serveur : true,
                channelsJeu : true,
            },
        },

        GAME :
		{
            CREATE_PARTIE:
			{
                name : "create_partie",
                category: "partie",
                description : "Crée une partie dans un serveur",
                nbrArgsRequired : 0,
                cooldown: 1,
                aliases: ["partie"], 
                usage : `\`${PREFIX}create_partie\``,
                
                prive : false,
                serveur : true,
                
                channelsJeu : false,
            },
            STOP:
			{
                name : "stop",
                category: "partie",
                description : "Arrête la partie",
                nbrArgsRequired : 0,
                cooldown: 10,
                aliases: ["stop"], 
                usage : `\`${PREFIX}stop\``,
                
                prive : false,
                serveur : true,
                channelsJeu : false,
            },
            REINIT:
			{
                name : "reset",
                category: "partie",
                description : "Reset la partie, on supprime tout",
                nbrArgsRequired : 0,
                cooldown: 10,
                aliases: ["reset"], 
                usage : `\`${PREFIX}reinitialiser\``,
                
                prive : false,
                serveur : true,
                channelsJeu : false,
            },
            START:
			{
                name : "commence",
                category: "partie",
                description : "Essaie de commencer la nuit manuellement",
                nbrArgsRequired : 0,
                cooldown: 1,
                aliases: ["commence"], 
                usage : `\`${PREFIX}commence\``,
                
                prive : false,
                serveur : true,
                channelsJeu : false,
            },
        }
    },

    ROLESCATEGORIES :
	{
        INDEPENDANTS:
		{
            ASSASSIN:
			{
                name: "assassin",
                category: "independants",
                description : "L'assassin désigne sa cible la nuit qui est autre que lui",
                cdv : "Il doit tuer sa cible pour gagner",
                usage : `\`${PREFIX}action nom ou tag d'un joueur\` (dans liste des joueurs de début de partie)` ,
                aliases: ["assassin"],
                typeRole : ["action", "", ""],
            },
            APPRENTIE_TANNEUR:
			{
                name: "apprentie-tanneur",
                category: "independants",
                description : "L'Apprentie-tanneur reçoit s'il existe le nom du joueur étant tanneur et sinon devient Tanneur",
                cdv : "Le Tanneur doit mourir",
                usage : `L'Apprentie-tanneur n'a pas d'action'` ,
                aliases: ["apprentie-tanneur", "app-tanneur"],
                typeRole : ["", "information", ""],
            },
            TANNEUR:
			{
                name: "tanneur",
                category: "independants",
                description : "Il veut mourir",
                cdv : "Le Tanneur doit mourir, le Tanneur gagne seul avec les Apprenties-tanneur",
                usage : "Il n'a pas d'action" ,
                aliases: ["tanneur"],
                typeRole : ["action", "", ""],
            },
            BLOB:
			{
                name: "blob",
                category: "independants",
                description : `Le Blob s'expand dans la nuit selon ce qu'on lui indique dans son entourage`,
                cdv : "Aucun des membres faisant parti du Blob ne doit mourir",
                usage : "Il n'a pas d'action" ,
                aliases: ["blob"],
                typeRole : ["", "", ""],
            },
            LAPIN:
			{
                name: "lapin des montagnes",
                category: "independants",
                description : `Le lapin va manger les carottes de quelqu'un qui s'en aperçoit et veut le tuer, ce qui devient son but`,
                cdv : "Il doit survivre",
                usage : `\`${PREFIX}action\` nom ou tag d'un joueur ` ,
                aliases: ["lapin des montagnes", "lapin"],
                typeRole : ["action", "", ""],
            },
        },

        
        LOUPS :
		{
            LOUP_GAROU :
			{
                name: "loup-garou",
                category: "loups",
                description: "Le Loup-garou se réveille dans la nuit pour prendre connaissance de sa meute ou s'il est seul regarde une carte au centre (et devient un type action)",
                cdv: "Aucun Loup ne doit mourir",
                usage: `S'il est seul : \`${PREFIX}action\` \`droite\` ou \`milieu\` ou \`gauche\``,
                aliases: ["loup-garou", "lg"],
                typeRole : ["", 'information', ""],
            },
            LOUP_ALPHA :
			{
                name: "loup-alpha",
                category: "loups",
                description: "Un Loup-garou qui contamine une personne dans la nuit",
                cdv: "Aucun Loup ne doit mourir",
                usage: `S'il est seul : \`${PREFIX}action\` \`droite\` ou \`milieu\` ou \`gauche\` et pour contaminer : \`${PREFIX}action\` nom ou tag d'un joueur`,
                aliases: ["loup-alpha", "lga"],
                typeRole : ["action", 'information', ""],
            },
            LOUP_CHAMAN :
			{
                name: "loup-chaman",
                category: "loups",
                description: "Un Loup-garou qui regarde le rôle d'une personne dans la nuit",
                cdv: "Aucun Loup ne doit mourir",
                usage: `S'il est seul : \`${PREFIX}action\` \`droite\` ou \`milieu\` ou \`gauche\` et pour voir une carte : \`${PREFIX}action\` nom ou tag d'un joueur`,
                aliases: ["loup-chaman", "lgc"],
                typeRole : ["action", 'information', ""],
            },
            LOUP_DORMEUR :
			{
                name: "loup-dormeur",
                category: "loups",
                description: "Le Loup-dormeur ne se réveille pas dans la nuit mais les autres loups ont connaissance de son identité de Loup",
                cdv: "Aucun Loup ne doit mourir",
                usage: `Il dort`,
                aliases: ["loup-dormeur", "lgd"],
                typeRole : ["", "", ""],
            },
            SBIRE :
			{
                name: "sbire",
                category: "loups",
                description: "Le Sbire n'est pas un Loup, mais les connait et en devient un s'il n'y a aucun Loup parmi les joueurs",
                cdv: "Aucun Loup ne doit mourir (il peut donc par exemple gagner en mourant",
                usage: `Il reçoit les noms des Loups et se rendort (n'a pas d'action)`,
                aliases: ["sbire"],
                typeRole : ["", 'information', ""],
            },
        },

        VILLAGEOIS :
		{
            APPRENTIE_VOYANTE :
			{
                name: "apprentie-voyante",
                category: "villageois",
                desscription: "L'Apprentie-voyante regarde le rôle de quelqu'un ou une carte au centre",
                cdv: "L'Apprentie-voyante est une villageoise, elle doit tuer un Loup pour gagner",
                usage: `\`${PREFIX}action nom ou tag d'un joueur\` (dans liste des joueurs de début de partie)`,
                aliases: ["apprentie-voyante", "app-voyante"],
                typeRole : ["action", 'information', ""],
            },
            CHASSEUR :
			{
                name: "chasseur",
                category: "villageois",
                desscription: "A sa mort, le chasseur désigne une personne qui meurt avec lui",
                cdv: "Le Chasseur est un villageois, il doit tuer un Loup pour gagner",
                usage: `Il n'a pas d'action`,
                aliases: ["chasseur"],
                typeRole : ["", "", "vote"],
            },
            CUPIPUTE :
			{
                name: "cupipute",
                category: "villageois",
                desscription: "Cupipute visite quelqu'un dans la nuit qui ne peut plus jouer et qui n'en est informé que s'il a un rôle à informations",
                cdv: "Cupipute est une villageoise, elle doit tuer un Loup pour gagner",
                usage: `\`${PREFIX}action nom ou tag d'un joueur\` (dans liste des joueurs de début de partie)`,
                aliases: ["cupipute", "pute"],
                typeRole : ["action", "", ""],
            },
            DOPPLEGANGER :
			{
                name: "doppleganger",
                category: "villageois",
                desscription: "Le Doppleganger copie le rôle de quelqu'un qu'il joue juste après",
                cdv: "Le Doppleganger est un villageois, il doit tuer un Loup pour gagner",
                usage: `\`${PREFIX}\` action nom ou tag d'un joueur (dans liste des joueurs de début de partie)`,
                aliases: ["doppleganger", "dopple"],
                typeRole : ["action", 'information', ""],

            },
            FRANC_MACON :
			{
                name: "franc-maçon",
                category: "villageois",
                desscription: "Le Franc-maçon prend connaissance de l'identité de l'autre Franc-maçon en jeu",
                cdv: "Le Franc-maçon est un villageois, il doit tuer un Loup pour gagner",
                usage: `\`${PREFIX}action nom ou tag d'un joueur\` (dans liste des joueurs de début de partie)`,
                aliases: ["franc-maçon", "fm"],
                typeRole : ["", 'information', ""],
            },
            GARDE :
			{
                name: "garde du corps",
                category: "villageois",
                desscription: "Le vote du Garde rend invulnérable",
                cdv: "Le Garde du corps est un villageois, il doit tuer un Loup pour gagner",
                usage: `Il n'a pas d'action`,
                aliases: ["garde du corps", "garde"],
                typeRole : ["", "", "vote",],

            },
            INSOMNIAQUE :
			{
                name: "insomniaque",
                category: "villageois",
                desscription: "L'Insomniaque prend connaissance de son rôle en fin de nuit",
                cdv: "L'Insomniaque est un villageois, il doit tuer un Loup pour gagner",
                usage: `Il n'a pas d'action`,
                aliases: ["insomniaque"],
                typeRole : ["", 'information', ""],
            },
            LA_CHOSE :
			{
                name: "la chose",
                category: "villageois",
                description: "La Chose tapote l'épaule d'une personne à sa droite ou à sa gauche qui est notifiée du tapotement",
                cdv: "La Chose est une villageoise, il doit tuer un Loup pour gagner",
                usage: `\`${PREFIX}action\` \`gauche\` ou \`droite\``,
                aliases: ["la chose", "chose"],
                typeRole : ["action", "", ""],

            },
            NOISEUSE :
			{
                name: "noiseuse",
                category: "villageois",
                description: "La Noiseuse échange les rôles de 2 personnes sans qu'ils n'en prennent connaissance",
                cdv: "La Noiseuse est une villageoise, il doit tuer un Loup pour gagner",
                usage: `\`${PREFIX}action\` noms ou tags de deux personnes`,
                aliases: ["noiseuse"],
                
                typeRole : ["action", "", ""],
            },
            PRINCE :
			{
                name: "prince",
                category: "villageois",
                description: "Le Prince ne peut pas mourir",
                cdv: "Le Prince est une villageoise, il doit tuer un Loup pour gagner",
                usage: `Il se contente d'exister`,
                aliases: ["prince"],
                typeRole : ["", "", "vote"],
            },
            SORCIERE :
			{
                name: "sorciere",
                category: "villageois",
                description: "La Sorcière regarde une carte au centre et décide de ne rien faire ou de l'attribuer à un joueur (elle y-compris)",
                cdv: "La Sorcière est une villageoise, il doit tuer un Loup pour gagner",
                usage: `\`${PREFIX}action \`gauche\`, \`milieu\` \`droite\` puis \`${PREFIX}action\` et le nom ou tag d'un joueur`,
                aliases: ["sorciere"],
                typeRole : ["action", 'information', ""],
            },
            SOULARD :
			{
                name: "soulard",
                category: "villageois",
                description: "La Soulard échange son rôle avec un rôle au centre mais n'en prend pas connaissance",
                cdv: "La Soulard est une villageoise, il doit tuer un Loup pour gagner",
                usage: `\`${PREFIX}action \`gauche\` \`milieu\` ou \`droite\``,
                aliases: ["soulard"],
                typeRole : ["", "", ""],
            },
            VILLAGEOIS :
			{
                name: "villageois",
                category: "villageois",
                description: "La Villageois existe...",
                cdv: "Le Villageois est un villageois (étonnant non ?), il doit tuer un Loup pour gagner",
                usage: `Il n'a pas d'action`,
                aliases: ["villageois"],
                typeRole : ["", "", ""],
            },
            VOLEUR :
			{
                name: "voleur",
                category: "villageois",
                description: "Le Voleur échange sa carte avec un joueur et prend connaissance de son nouveau rôle",
                cdv: "Le Voleur est une villageoise, il doit tuer un Loup pour gagner",
                usage: `\`${PREFIX}action\` nom ou tag d'une personne`,
                aliases: ["voleur"],
                typeRole : ["action", 'information', ""],
            },
            VOYANTE :
			{
                name: "voyante",
                category: "villageois",
                description: "La Voyante regarde le rôle d'une personne ou de 2 cartes au centre",
                cdv: "La Voyante est une villageoise, elle doit tuer un Loup pour gagner",
                usage: `\`${PREFIX}action\` nom ou tag d'une personne ou 2 centres différents (\`gauche\` \`milieu\` ou \`droite\`)`,
                aliases: ["voyante"],
                typeRole : ["action", 'information', ""],
            },
        },
    }
}


//https://www.youtube.com/watch?v=EvlzXO8DDl0&list=PLuWyq_EO5_ALOnpxptlqQA5FR75Nza2PQ&index=26