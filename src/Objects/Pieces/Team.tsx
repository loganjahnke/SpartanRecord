import { MatchPlayerSchema, MatchTeamSchema } from "../../Database/Schemas/MatchSchema";
import { GetColorForTeam } from "../Helpers/AllTeams";
import { ServiceRecord } from "../Model/ServiceRecord";
import { MatchPlayer } from "./MatchPlayer";
import { TeamDetails } from "./TeamDetails";

export class Team
{
    public details: TeamDetails;
    public statistics: ServiceRecord;
    public players: MatchPlayer[] = [];
    public mmr: number;
    public oddsToWin: number;

    /** The team color */
    public get color()
    {
        return GetColorForTeam(this.details.name);
    }

    constructor(team?: MatchTeamSchema | undefined, playersData?: MatchPlayerSchema[] | undefined, players?: MatchPlayer[])
    {
        this.details = new TeamDetails(team);
        this.statistics = new ServiceRecord(team?.stats);
        this.mmr = team?.stats?.mmr ?? 0;
        this.oddsToWin = team?.odds?.winning ?? 0;

        if (playersData)
        {
            const filtered = playersData.filter((playerData: any) => playerData.properties?.team?.id === this.details.id);
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