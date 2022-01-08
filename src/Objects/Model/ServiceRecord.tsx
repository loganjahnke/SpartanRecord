import { AllMedals } from "../Helpers/AllMedals";
import { Breakdowns } from "../Pieces/Breakdowns";
import { Damage } from "../Pieces/Damage";
import { Medal, MedalRarity, MedalType } from "../Pieces/Medal";
import { Shots } from "../Pieces/Shots";
import { Summary } from "../Pieces/Summary";
import { TimePlayed } from "../Pieces/TimePlayed";

export class ServiceRecord
{
    /** Contains summary information */
    public summary: Summary;
    /** Contains information about the damage taken and dealt */
    public damage: Damage;
    /** Accuracy statistics */
    public shots: Shots;
    /** More specific statistics */
    public breakdowns: Breakdowns;
    /** Time played statistics */
    public timePlayed: TimePlayed;
    /** Contains all medals */
    public medals: Medal[];

    /** KDA */
    public kda: number = 0;
    /** K/D */
    public kdr: number = 0;
    /** Total score */
    public totalScore: number = 0;
    /** Total matches played */
    public matchesPlayed: number = 0;
    /** Win rate */
    public winRate: number = 0;
    /** The gamertag */
    public gamertag: string = "";

    /**
     * Creates a Service Record object from the JSON response
     * @param cryptum the JSON response from cryptum
     */
    constructor(cryptum?: any)
    {
        this.gamertag = cryptum?.additional?.gamertag;
        const data = cryptum?.data;
        const core = data?.core ?? cryptum?.core ?? data;

        this.summary = 
        {
            kills: core?.summary?.kills ?? 0,
            deaths: core?.summary?.deaths ?? 0,
            assists: core?.summary?.assists ?? 0,
            betrayals: core?.summary?.betrayals ?? 0,
            suicides: core?.summary?.suicides ?? 0,
            vehicles:
            {
                destroys: core?.summary?.vehicles?.destroys ?? 0,
                hijacks: core?.summary?.vehicles?.hijacks ?? 0
            },
            medals: core?.summary?.medals ?? 0
        };

        this.damage =
        {
            taken: core?.damage?.taken ?? 0,
            dealt: core?.damage?.dealt ?? 0,
            average: core?.damage?.average ?? 0,
        };

        this.shots = 
        {
            fired: core?.shots?.fired ?? 0,
            landed: core?.shots?.landed ?? 0,
            missed: core?.shots?.missed ?? 0,
            accuracy: core?.shots?.accuracy ?? 0,
        };

        this.breakdowns =
        {
            kills: 
            {
                melee: core?.breakdowns?.kills?.melee ?? 0,
                grenades: core?.breakdowns?.kills?.grenades ?? 0,
                headshots: core?.breakdowns?.kills?.headshots ?? 0,
                powerWeapons: core?.breakdowns?.kills?.power_weapons ?? 0
            },
            assists:
            {
                emp: core?.breakdowns?.assists?.emp ?? 0,
                driver: core?.breakdowns?.assists?.driver ?? 0,
                callouts: core?.breakdowns?.assists?.callouts ?? 0
            },
            matches:
            {
                wins: core?.breakdowns?.matches?.wins ?? 0,
                losses: core?.breakdowns?.matches?.losses ?? 0,
                left: core?.breakdowns?.matches?.left ?? 0,
                draws: core?.breakdowns?.matches?.draws ?? 0
            }
        };

        this.timePlayed =
        {
            seconds: data?.time_played?.seconds ?? 0,
            human: data?.time_played?.human ?? ""
        };

        this.medals = [];
        if (core?.breakdowns?.medals && core.breakdowns?.medals.length > 0)
        {
            this.medals = core.breakdowns.medals.map((data: any) => 
            {
                const medal = new Medal(data);
                const parent = (AllMedals as any)[(medal.id)];
                medal.rarity = parent.type ?? MedalRarity.Normal;
                medal.type = parent.category ?? MedalType.Unknown;
                medal.sort = parent.sort ?? -1;
                medal.description = parent.description ?? "N/A";
                return medal;
            });
        }

        this.kda = core?.kda ?? 0;
        this.kdr = core?.kdr ?? 0;
        this.totalScore = core?.total_score ?? 0;
        this.matchesPlayed = data?.matches_played ?? 0;
        this.winRate = data?.win_rate ?? 0;
    }

    /**
     * Returns the human readable time
     * @returns human readable time from seconds
     */
    public ReadableTime(): string
    {
        const numdays = Math.floor((this.timePlayed.seconds % 31536000) / 86400); 
        const numhours = Math.floor(((this.timePlayed.seconds % 31536000) % 86400) / 3600);
        const numminutes = Math.floor((((this.timePlayed.seconds % 31536000) % 86400) % 3600) / 60);
        const numseconds = (((this.timePlayed.seconds % 31536000) % 86400) % 3600) % 60;

        let daysStr = "";
        const timeStr = numhours > 0 
            ? numhours + "h " + numminutes + "m " + numseconds + "s"
            : numminutes + "m " + numseconds + "s";

        if (numdays > 0)
        {
            daysStr = numdays + "d ";
        }

        return daysStr + timeStr;
    }

    /**
     * Adds a service record to this and returns a new one
     * @param sr The service record to add
     */
    public AddServiceRecord(sr: ServiceRecord): ServiceRecord
    {
        const newSR = new ServiceRecord();

        newSR.summary = 
        {
            kills: sr.summary.kills + this.summary.kills,
            deaths: sr.summary.deaths + this.summary.deaths,
            assists: sr.summary.assists + this.summary.assists,
            betrayals: sr.summary.betrayals + this.summary.betrayals,
            suicides: sr.summary.suicides + this.summary.suicides,
            vehicles:
            {
                destroys: sr.summary.vehicles.destroys + this.summary.vehicles.destroys,
                hijacks: sr.summary.vehicles.hijacks + this.summary.vehicles.hijacks
            },
            medals: sr.summary.medals + this.summary.medals
        };

        newSR.damage =
        {
            taken: sr.damage.taken + this.damage.taken,
            dealt: sr.damage.dealt + this.damage.dealt,
            average: 0
        };

        newSR.shots = 
        {
            fired: sr.shots.fired + this.shots.fired,
            landed: sr.shots.landed + this.shots.landed,
            missed: sr.shots.missed + this.shots.missed,
            accuracy: 0
        };

        if (newSR.shots.fired !== 0)
        {
            newSR.shots.accuracy = (newSR.shots.landed / newSR.shots.fired) * 100;
        }

        newSR.breakdowns =
        {
            kills: 
            {
                melee: sr.breakdowns.kills.melee + this.breakdowns.kills.melee,
                grenades: sr.breakdowns.kills.grenades + this.breakdowns.kills.grenades,
                headshots: sr.breakdowns.kills.headshots + this.breakdowns.kills.headshots,
                powerWeapons: sr.breakdowns.kills.powerWeapons + this.breakdowns.kills.powerWeapons
            },
            assists:
            {
                emp: sr.breakdowns.assists.emp + this.breakdowns.assists.emp,
                driver: sr.breakdowns.assists.driver + this.breakdowns.assists.driver,
                callouts: sr.breakdowns.assists.callouts + this.breakdowns.assists.callouts
            },
            matches:
            {
                wins: sr.breakdowns.matches.wins + this.breakdowns.matches.wins,
                losses: sr.breakdowns.matches.losses + this.breakdowns.matches.losses,
                left: sr.breakdowns.matches.left + this.breakdowns.matches.left,
                draws: sr.breakdowns.matches.draws + this.breakdowns.matches.draws
            }
        };

        newSR.timePlayed =
        {
            seconds: sr.timePlayed.seconds + this.timePlayed.seconds,
            human: ""
        };

        const medals1 = new Map<number, Medal>();
        sr.medals.forEach(m => medals1.set(m.id, m));
        this.medals.forEach(m => 
        {
            const medal = medals1.get(m.id) ?? new Medal({ id: m.id });
            const count = medal.count + m.count;
            medals1.set(m.id, Medal.FromCount(m.id, count));
        });

        newSR.medals = Array.from(medals1.values());

        newSR.totalScore = sr.totalScore + this.totalScore;
        newSR.matchesPlayed = (sr.matchesPlayed === 0 ? 1 : sr.matchesPlayed) + this.matchesPlayed;
        
        if (newSR.summary.deaths !== 0)
        {
            newSR.kdr = newSR.summary.kills / newSR.summary.deaths;
        }
        
        if (newSR.matchesPlayed !== 0)
        {
            newSR.winRate = (newSR.breakdowns.matches.wins / newSR.matchesPlayed) * 100;
            newSR.kda = (newSR.summary.kills + (newSR.summary.assists / 3) - newSR.summary.deaths) / newSR.matchesPlayed;
            newSR.damage.average = (newSR.damage.dealt / newSR.matchesPlayed) * 100;
        }

        return newSR;
    }
    
    /**
     * Gets the entire group of medals that match the medal type
     * @param type the medal type
     * @returns array of medals sorted by rarity
     */
    public GetMedalType(type: MedalType)
    {
        const filtered = this.medals.filter(medal => medal.type === type);
        return filtered.sort((a, b) => a.sort > b.sort ? 1 : -1);
    }
}