export class TeamDetails
{
    /** Team ID */
    public id: number;
    /** Name of the Team */
    public name: string;
    /** Team emblem */
    public emblem: string = "";

    constructor(data?: any)
    {
        this.id = data?.id ?? -1; 
        this.name = data?.name ?? ""; 
            
        if (this.name === "Eagle")
        {
            this.emblem = "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/eagle.png";
        }
        else if (this.name === "Cobra")
        {
            this.emblem = "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/cobra.png";
        }
        else if (this.name === "Hades")
        {
            this.emblem = "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/hades.png";
        }
        else if (this.name === "Valkyrie")
        {
            this.emblem = "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/valkyrie.png";
        }
        else if (this.name === "Rampart")
        {
            this.emblem = "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/rampart.png";
        }
        else if (this.name === "Cutlass")
        {
            this.emblem = "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/cutlass.png";
        }
        else if (this.name === "Valor")
        {
            this.emblem = "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/valor.png";
        }
        else if (this.name === "Hazard")
        {
            this.emblem = "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/hazard.png";
        }
        else if (this.name === "Observer")
        {
            this.emblem = "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/observer.png";
        }
    }
}