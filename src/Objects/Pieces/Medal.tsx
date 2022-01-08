import { AllMedals } from "../Helpers/AllMedals";

export enum MedalRarity
{
	Normal = "normal",
	Heoric = "heroic",
	Legendary = "lengendary",
	Mythic = "mythic"
}

export enum MedalType
{
	// Classics
	Spree = "Spree",
	MultiKill = "Multikill",

	// Game
	Assists = "Assists",
	Boom = "Boom",
	Equipment = "Equipment",
	GameEnd = "Game End",
	Melee = "Melee",
	Skill = "Skill",
	Sniper = "Sniper",
	Weapons = "Weapons",
	Vehicles = "Vehicles",

	// Game mode specific
	Assault = "Assault",
	CTF = "CTF",
	Infection = "Infection",
	Elimination = "Elimination",
	Extraction = "Extraction",
	Juggernaut = "Juggernaut",
	KingOfTheHill = "King of the Hill",
	Oddball = "Oddball",
	Stockpile = "Stockpile",
	Strongholds = "Strongholds",
	VIP = "VIP",

	// Unknown
	Unknown = "Unknown"
}

export class Medal
{
    /** The medal ID */
    public id: number;
    /** The name of the medal */
    public name: string;
    /** The rarity of the medal */
    public rarity: MedalRarity;
    /** The rarity of the medal */
    public type: MedalType;
    /** The description of the medal */
    public description: string;
    /** The total number of this medal achieved by the player */
    public count: number;
    /** Sort order */
    public sort: number;
    /** Medal images */
    public images: { small: string, medium: string, large: string };

    constructor(data?: any)
    {
        this.id = data?.id ?? -1;
        this.name = data?.name ?? "";
        this.rarity = data?.type ?? MedalRarity.Normal;
        this.type = data?.category ?? MedalType.Unknown;
        this.description = data?.description ?? "";
        this.count = data?.count ?? -1;
        this.sort = data?.sort ?? -1;
        this.images = { 
            small: data?.image_urls?.small ?? "", 
            medium: data?.image_urls?.medium ?? "",
            large: data?.image_urls?.large ?? ""
        };
    }

    /**
     * Creates a Medal from the ID and count
     * @param id the medal ID
     * @param count the total medal count
     */
    public static FromCount(id: number, count: number): Medal
    {
        const template = new Medal((AllMedals as any)[(id)]);
        return new Medal({ 
            id: id, 
            name: template.name, 
            type: template.rarity, 
            category: template.type,
            description: template.description, 
            sort: template.sort ?? -1,
            image_urls: {
                small: template.images.small,
                medium: template.images.medium,
                large: template.images.large 
            },
            count: count 
        });
    }

    /** Gets the rarity value */
    public RarityValue(): number
    {
        return this.rarity === MedalRarity.Normal ? 1
            : this.rarity === MedalRarity.Heoric ? 2
            : this.rarity === MedalRarity.Legendary ? 3
            : 4; // MedalRarity.Mythic
    }
}