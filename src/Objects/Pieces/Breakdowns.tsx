export class Breakdowns
{
    /** Breakdowns on kills */
    public kills: BreakdownKills;
    /** Breakdowns on assists */
    public assists: BreakdownAssists;
    /** Breakdowns on matches */
    public matches: BreakdownMatches;

    constructor()
    {
        this.kills = new BreakdownKills();
        this.assists = new BreakdownAssists();
        this.matches = new BreakdownMatches();
    }
}

class BreakdownKills
{
    /** Melee kills */
    public melee: number;
    /** Kills with frag, plasma, spike, and shock grenades */
    public grenades: number;
    /** Kills on the head */
    public headshots: number;
    /** Big boy weapon kills */
    public powerWeapons: number;

    constructor()
    {
        this.melee = 0;
        this.grenades = 0;
        this.headshots = 0;
        this.powerWeapons = 0;
    }
}

class BreakdownAssists
{
    /** EMP assists (plasma pistol, etc) */
    public emp: number;
    /** Driving assists, you go Forza player */
    public driver: number;
    /** Callout assists */
    public callouts: number;

    constructor()
    {
        this.emp = 0;
        this.driver = 0;
        this.callouts = 0;
    }
}

class BreakdownMatches
{
    /** Total wins */
    public wins: number;
    /** Total losses */
    public losses: number;
    /** Total matches left */
    public left: number;
    /** Total ties */
    public draws: number;

    constructor()
    {
        this.wins = 0;
        this.losses = 0;
        this.left = 0;
        this.draws = 0;
    }
}