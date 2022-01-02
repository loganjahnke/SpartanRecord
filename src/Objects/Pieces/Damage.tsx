export class Damage
{
    /** Total damage taken */
    public taken: number;
    /** Total damage dealt */
    public dealt: number;
    /** Average total damage dealt */
    public average: number;

    constructor()
    {
        this.taken = 0;
        this.dealt = 0;
        this.average = 0;
    }
}