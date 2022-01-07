import { AllMedals } from "../Helpers/AllMedals";

export class Medal
{
    /** The medal ID */
    public id: number;
    /** The name of the medal */
    public name: string;
    /** The rarity of the medal */
    public rarity: string;
    /** The description of the medal */
    public description: string;
    /** The total number of this medal achieved by the player */
    public count: number;
    /** Medal images */
    public images: { small: string, medium: string, large: string };

    constructor(data?: any)
    {
        this.id = data?.id ?? -1;
        this.name = data?.name ?? "";
        this.rarity = data?.rarity ?? "normal";
        this.description = data?.description ?? "";
        this.count = data?.count ?? -1;
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
            rarity: template.rarity, 
            description: template.description, 
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
        return this.rarity === "normal" ? 1
            : this.rarity === "heroic" ? 2
            : this.rarity === "lengendary" ? 3
            : 4; // mythic
    }
}