import { AutocodeHelpers } from "../../Database/Schemas/AutocodeHelpers";
import { AutocodeMatchPlayer, AutocodeMatchTeamDetails } from "../../Database/Schemas/AutocodeMatch";
import { ServiceRecord } from "../Model/ServiceRecord";
import { MatchPlayer } from "./MatchPlayer";
import { TeamDetails } from "./TeamDetails";

export class Team
{
    public details: TeamDetails;
    public statistics: ServiceRecord;
    public players: MatchPlayer[] = [];
    public mmr: number;

    constructor(teamData?: AutocodeMatchTeamDetails | undefined, playersData?: AutocodeMatchPlayer[] | undefined, players?: MatchPlayer[])
    {
        this.details = new TeamDetails(teamData?.team);
        this.statistics = new ServiceRecord(AutocodeHelpers.CreateServiceRecordFromTeam(teamData, true, 0));
        this.mmr = teamData?.stats?.mmr ?? 0;

        if (playersData)
        {
            const filtered = playersData.filter((playerData: any) => playerData.team?.id === this.details.id);
            if (filtered.length > 0)
            {
                this.players = filtered.map((playerData: any) => new MatchPlayer(playerData));
            }
        }
        else if (players)
        {
            this.players = players;
        }
    }
}