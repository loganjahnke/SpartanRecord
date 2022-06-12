export class Summary
{
    /** Total kills */
    public kills: number;
    /** Total deaths */
    public deaths: number;
    /** Total assists */
    public assists: number;
    /** Total betrayals */
    public betrayals: number;
    /** Total suicides */
    public suicides: number;
    /** The max killing spree */
    public maxKillingSpree?: number;
    /** Vehicles statistics */
    public vehicles: Vehicles;
    /** Total medals */
    public medals: number;

    constructor()
    {
        this.kills = 0;
        this.deaths = 0;
        this.assists = 0;
        this.betrayals = 0;
        this.suicides = 0;
        this.vehicles = new Vehicles();
        this.medals = 0;
    }
}

class Vehicles
{
    /** Total destroyed vehicles */
    public destroys: number;
    /** Total vehicle hijacks */
    public hijacks: number;

    constructor()
    {
        this.destroys = 0;
        this.hijacks = 0;
    }
}