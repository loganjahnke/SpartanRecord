export class Shots
{
    /** Total shots fired */
    public fired: number;
    /** Total shots landed */
    public landed: number;
    /** Total shots missed */
    public missed: number;
    /** Total accuracy */
    public accuracy: number;

    constructor()
    {
        this.fired = 0;
        this.landed = 0;
        this.missed = 0;
        this.accuracy = 0;
    }
}