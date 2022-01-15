import { ServiceRecord } from "../Model/ServiceRecord";
import { MatchPlayer } from "./MatchPlayer";
import { TeamDetails } from "./TeamDetails";

export class Team
{
    public details: TeamDetails;
    public statistics: ServiceRecord;
    public players: MatchPlayer[] = [];

    constructor(teamData?: any, playersData?: any)
    {
        this.details = new TeamDetails(teamData?.team);
        this.statistics = new ServiceRecord(teamData?.stats);

        if (playersData)
        {
            const filtered = playersData.filter((playerData: any) => playerData.team?.id === this.details.id);
            if (filtered.length > 0)
            {
                this.players = filtered.map((playerData: any) => new MatchPlayer(playerData));
            }
        }
    }
}