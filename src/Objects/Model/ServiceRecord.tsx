import { HaloOutcome } from "../../Database/ArrowheadFirebase";
import { TeamStatsSchema } from "../../Database/Schemas/MatchSchema";
import { DurationSchema, PlayerStatsSchema } from "../../Database/Schemas/PlayerMatchSchema";
import { ServiceRecordSchema, ServiceRecordDataSchema, isServiceRecordSchema, ServiceRecordStatsSchema, ServiceRecordMatchesSchema, CTFSchema, EliminationSchema, OddballSchema, StockpileSchema, ZoneServiceRecordSchema, ExtractionSchema, InfectionSchema, ZoneSchema, FirefightSchema, VIPSchema, isServiceRecordSchemaWithoutDataNode } from "../../Database/Schemas/ServiceRecordSchema";
import { AllMedals } from "../Helpers/AllMedals";
import { Breakdowns } from "../Pieces/Breakdowns";
import { CaptureTheFlag } from "../Pieces/Mode/CaptureTheFlag";
import { Damage } from "../Pieces/Damage";
import { Elimination } from "../Pieces/Mode/Elimination";
import { Medal, MedalRarity, MedalType } from "../Pieces/Medal";
import { Oddball } from "../Pieces/Mode/Oddball";
import { Shots } from "../Pieces/Shots";
import { Stockpile } from "../Pieces/Mode/Stockpile";
import { Summary } from "../Pieces/Summary";
import { TimePlayed } from "../Pieces/TimePlayed";
import { Zone } from "../Pieces/Mode/Zone";
import { PlayerMatch } from "./PlayerMatch";
import { Infection } from "../Pieces/Mode/Infection";
import { Extraction } from "../Pieces/Mode/Extraction";
import { Rounds } from "../Pieces/Rounds";
import { Firefight } from "../Pieces/Mode/Firefight";

export class ServiceRecord
{
    /** The damage needed for a perfect kill */
    private readonly PERFECT_KILL_DAMAGE = 225;

    /** The season identifier (empty string if all stats) */
    public season: string;
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
    /** If there is an error in the response, store it here */
    public rounds?: Rounds;
    /** Capture the flag statistics */
    public ctf: CaptureTheFlag;
    /** Zone statistics */
    public zone: Zone;
    /** Oddball statistics */
    public oddball: Oddball;
    /** Elimination statistics */
    public elimination: Elimination;
    /** Sotkcpile statistics */
    public stockpile: Stockpile;
    /** Infection statistics */
    public infection: Infection;
    /** Extraction statistics */
    public extraction: Extraction;
    /** Firefight statistics */
    public firefight: Firefight;
    /** Mode statistics */
    public mode?: CTFSchema | OddballSchema | ZoneServiceRecordSchema | EliminationSchema | StockpileSchema | ExtractionSchema | InfectionSchema | ZoneSchema | FirefightSchema | VIPSchema;
    /** Raw autocode and firebase JSON */
    public data?: ServiceRecordDataSchema;
    /** If there is an error in the response, store it here */
    public error?: string;

    /** The kills per game */
    public get killsPerGame(): number
    {
        if (this.matchesPlayed === 0) { return 0; }
        return this.summary.kills / this.matchesPlayed;
    }

    /** The deaths per game */
    public get deathsPerGame(): number
    {
        if (this.matchesPlayed === 0) { return 0; }
        return this.summary.deaths / this.matchesPlayed;
    }

    /** The assists per game */
    public get assistsPerGame(): number
    {
        if (this.matchesPlayed === 0) { return 0; }
        return this.summary.assists / this.matchesPlayed;
    }

    /** The damage per game */
    public get damagePerGame(): number
    {
        if (this.matchesPlayed === 0) { return 0; }
        return this.damage.dealt / this.matchesPlayed;
    }
 
    /** The damage efficiency per kill */
    public get damageEfficiency(): number
    {
        if (this.damage.dealt === 0 || this.summary.kills === 0) { return 0; }
        return this.PERFECT_KILL_DAMAGE / (this.damage.dealt / this.summary.kills);
    }

    /** The enemy damage efficiency per death */
    public get enemyDamageEfficiency(): number
    {
        if (this.damage.taken === 0 || this.summary.deaths === 0) { return 0; }
        return this.PERFECT_KILL_DAMAGE / (this.damage.taken / this.summary.deaths);
    }

    /** The kill death spread */
    public get killDeathSpread(): string
    {
        return (this.summary.kills - this.summary.deaths > 0 ? "+" : "") + (this.killDeathSpreadVal).toLocaleString();
    }

    /** The kill death spread per game */
    public get killDeathSpreadPerGame(): string
    {
        return (this.summary.kills - this.summary.deaths > 0 ? "+" : "") + (this.killDeathSpreadPerGameVal).toLocaleString();
    }

    /** The kill death spread */
    public get killDeathSpreadVal(): number
    {
        return this.summary.kills - this.summary.deaths;
    }

    /** The kill death spread per game */
    public get killDeathSpreadPerGameVal(): number
    {
        return this.killDeathSpreadVal / this.matchesPlayed;
    }

    /** KDA */
    public kda: number = 0;
    /** K/D */
    public kdr: number = 0;
    /** Total score */
    public totalScore: number = 0;
    /** Total points */
    public totalPoints: number = 0;
    /** Total matches played */
    public matchesPlayed: number = 0;
    /** Win rate */
    public winRate: number = 0;

    /**
     * Creates a Service Record object from the JSON response
     * @param result the JSON response from cryptum
     */
    constructor(result?: ServiceRecordSchema | TeamStatsSchema | PlayerStatsSchema, season?: string)
    {
        // Add error
        if (result && (result as any).error)
        {
            this.error = (result as any).error?.message;
        }

        // Set the season
        this.season = season ?? "";

        let timePlayed: DurationSchema | undefined;
        let matches: ServiceRecordMatchesSchema | undefined;
        let stats: PlayerStatsSchema | ServiceRecordStatsSchema | TeamStatsSchema | undefined;
        if (isServiceRecordSchema(result))
        {
            this.data = result.data;
            stats = result.data.stats;
            timePlayed = result.data.time_played;
            matches = result.data.matches;

            this.ctf = new CaptureTheFlag(stats?.modes?.capture_the_flag);
            this.zone = new Zone(stats?.modes?.zones);
            this.oddball = new Oddball(stats?.modes?.oddball);
            this.elimination = new Elimination(stats?.modes?.elimination);
            this.stockpile = new Stockpile(stats?.modes?.stockpile);
            this.infection = new Infection(stats?.modes?.infection);
            this.extraction = new Extraction(stats?.modes?.extraction);
            this.firefight = new Firefight(stats?.modes?.pve);
        }
        else if (isServiceRecordSchemaWithoutDataNode(result))
        {
            this.data = result;
            stats = result.stats;
            timePlayed = result.time_played;
            matches = result.matches;

            this.ctf = new CaptureTheFlag(stats?.modes?.capture_the_flag);
            this.zone = new Zone(stats?.modes?.zones);
            this.oddball = new Oddball(stats?.modes?.oddball);
            this.elimination = new Elimination(stats?.modes?.elimination);
            this.stockpile = new Stockpile(stats?.modes?.stockpile);
            this.infection = new Infection(stats?.modes?.infection);
            this.extraction = new Extraction(stats?.modes?.extraction);
            this.firefight = new Firefight(stats?.modes?.pve);
        }
        else
        {
            stats = result;

            this.mode = stats?.mode;
            this.ctf = new CaptureTheFlag(stats?.mode as any);
            this.zone = new Zone(stats?.mode as any);
            this.oddball = new Oddball(stats?.mode as any);
            this.elimination = new Elimination(stats?.mode as any);
            this.stockpile = new Stockpile(stats?.mode as any);
            this.infection = new Infection(stats?.mode as any);
            this.extraction = new Extraction(stats?.mode as any);
            this.firefight = new Firefight(stats?.mode as any);
        }

        // Get stubs for easy access
        const core = stats?.core;

        this.summary = 
        {
            kills: core?.summary?.kills ?? 0,
            deaths: core?.summary?.deaths ?? 0,
            assists: core?.summary?.assists ?? 0,
            betrayals: core?.summary?.betrayals ?? 0,
            suicides: core?.summary?.suicides ?? 0,
            maxKillingSpree: core?.summary?.max_killing_spree,
            vehicles:
            {
                destroys: core?.summary?.vehicles?.destroys ?? 0,
                hijacks: core?.summary?.vehicles?.hijacks ?? 0
            },
            medals: core?.summary?.medals?.total ?? 0
        };

        this.damage =
        {
            taken: core?.damage?.taken ?? 0,
            dealt: core?.damage?.dealt ?? 0,
            average: 0
        };

        this.shots = 
        {
            fired: core?.shots?.fired ?? 0,
            landed: core?.shots?.hit ?? 0,
            missed: core?.shots?.missed ?? 0,
            accuracy: core?.shots?.accuracy ?? 0,
        };

        this.breakdowns =
        {
            kills: 
            {
                melee: core?.breakdown?.kills?.melee ?? 0,
                grenades: core?.breakdown?.kills?.grenades ?? 0,
                headshots: core?.breakdown?.kills?.headshots ?? 0,
                powerWeapons: core?.breakdown?.kills?.power_weapons ?? 0,
                assassinations: core?.breakdown?.kills?.assassinations ?? 0,
                splatters: core?.breakdown?.kills?.vehicles?.splatters ?? 0,
                repulsor: core?.breakdown?.kills?.miscellaneous?.repulsor ?? 0,
                fusionCoil: core?.breakdown?.kills?.miscellaneous?.fusion_coils ?? 0,
                sticks: core?.breakdown?.kills?.sticks ?? 0
            },
            assists:
            {
                emp: core?.breakdown?.assists?.emp ?? 0,
                driver: core?.breakdown?.assists?.driver ?? 0,
                callouts: core?.breakdown?.assists?.callouts ?? 0
            },
            matches:
            {
                wins: matches?.wins ?? 0,
                losses: matches?.losses ?? 0,
                draws: matches?.ties ?? 0,
                left: 0
            }
        };

        this.timePlayed = new TimePlayed({
            seconds: timePlayed?.seconds ?? 0,
            human: timePlayed?.human ?? ""
        });

        this.medals = [];
        if (core?.breakdown?.medals && core.breakdown?.medals.length > 0)
        {
            this.medals = core.breakdown.medals.map((data: any) => 
            {
                const medal = new Medal(data);
                const parent = (AllMedals as any)[(medal.id)];
                medal.name = parent?.name ?? data?.name ?? data?.id ?? "";
                medal.rarity = parent?.type ?? MedalRarity.Normal;
                medal.type = parent?.category ?? MedalType.Unknown;
                medal.sort = parent?.sort ?? -1;
                medal.description = parent?.description ?? data?.description ?? "N/A";
                medal.images = {
                    small: parent?.image_urls?.small ?? "",
                    medium: parent?.image_urls?.medium ?? "",
                    large: parent?.image_urls?.large ?? ""
                };
                return medal;
            });
        }

        this.rounds = new Rounds(stats?.core?.rounds);
        this.kda = core?.kda ?? 0;
        this.kdr = core?.kdr ?? 0;
        this.totalScore = core?.scores?.personal ?? 0;
        this.totalPoints = core?.scores?.points ?? 0;
        this.matchesPlayed = matches?.completed ?? 0;

        if (this.matchesPlayed !== 0)
        {
            this.winRate = (this.breakdowns.matches.wins / this.matchesPlayed) * 100;
            this.kda = (this.summary.kills + (this.summary.assists / 3) - this.summary.deaths) / this.matchesPlayed;
            this.damage.average = (this.damage.dealt / this.matchesPlayed) * 100;
        }
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
     * @param outcome The outcome of the match
     */
    public AddServiceRecord(sr: ServiceRecord, outcome?: HaloOutcome): void
    {
        this.summary = 
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

        this.damage =
        {
            taken: sr.damage.taken + this.damage.taken,
            dealt: sr.damage.dealt + this.damage.dealt,
            average: 0
        };

        this.shots = 
        {
            fired: sr.shots.fired + this.shots.fired,
            landed: sr.shots.landed + this.shots.landed,
            missed: sr.shots.missed + this.shots.missed,
            accuracy: 0
        };

        if (this.shots.fired !== 0)
        {
            this.shots.accuracy = (this.shots.landed / this.shots.fired) * 100;
        }

        this.breakdowns =
        {
            kills: 
            {
                melee: sr.breakdowns.kills.melee + this.breakdowns.kills.melee,
                grenades: sr.breakdowns.kills.grenades + this.breakdowns.kills.grenades,
                headshots: sr.breakdowns.kills.headshots + this.breakdowns.kills.headshots,
                powerWeapons: sr.breakdowns.kills.powerWeapons + this.breakdowns.kills.powerWeapons,
                assassinations: sr.breakdowns.kills.assassinations + this.breakdowns.kills.assassinations,
                splatters: sr.breakdowns.kills.splatters + this.breakdowns.kills.splatters,
                repulsor: sr.breakdowns.kills.repulsor + this.breakdowns.kills.repulsor,
                fusionCoil: sr.breakdowns.kills.fusionCoil + this.breakdowns.kills.fusionCoil,
                sticks: sr.breakdowns.kills.sticks + this.breakdowns.kills.sticks
            },
            assists:
            {
                emp: sr.breakdowns.assists.emp + this.breakdowns.assists.emp,
                driver: sr.breakdowns.assists.driver + this.breakdowns.assists.driver,
                callouts: sr.breakdowns.assists.callouts + this.breakdowns.assists.callouts
            },
            matches:
            {
                wins: this.breakdowns.matches.wins + (outcome && outcome === HaloOutcome.Win ? 1 : sr.breakdowns.matches.wins),
                losses: this.breakdowns.matches.losses + (outcome && outcome === HaloOutcome.Loss ? 1 : sr.breakdowns.matches.losses),
                left: this.breakdowns.matches.left + (outcome && outcome === HaloOutcome.Draw ? 1 : sr.breakdowns.matches.left),
                draws: this.breakdowns.matches.draws + (outcome && outcome === HaloOutcome.Left ? 1 : sr.breakdowns.matches.draws)
            }
        };

        this.timePlayed = new TimePlayed({
            seconds: sr.timePlayed.seconds + this.timePlayed.seconds,
            human: ""
        });

        const medals1 = new Map<number, Medal>();
        sr.medals.forEach(m => medals1.set(m.id, m));
        this.medals.forEach(m => 
        {
            const medal = medals1.get(m.id) ?? new Medal({ id: m.id });
            const count = medal.count + m.count;
            medals1.set(m.id, Medal.FromCount(m.id, count));
        });

        this.medals = Array.from(medals1.values());

        this.totalScore = sr.totalScore + this.totalScore;
        this.matchesPlayed = (sr.matchesPlayed === 0 ? 1 : sr.matchesPlayed) + this.matchesPlayed;
        
        if (this.summary.deaths !== 0)
        {
            this.kdr = this.summary.kills / this.summary.deaths;
        }
        
        if (this.matchesPlayed !== 0)
        {
            this.winRate = (this.breakdowns.matches.wins / this.matchesPlayed) * 100;
            this.kda = (this.summary.kills + (this.summary.assists / 3) - this.summary.deaths) / this.matchesPlayed;
            this.damage.average = (this.damage.dealt / this.matchesPlayed) * 100;
        }

        this.ctf.add(sr.ctf);
        this.zone.add(sr.zone);
        this.oddball.add(sr.oddball);
        this.elimination.add(sr.elimination);
        this.stockpile.add(sr.stockpile);
        this.infection.add(sr.infection);
        this.extraction.add(sr.extraction);
        this.firefight.add(sr.firefight);
    }

    /**
     * Adds a player match to this and returns a new one
     * @param match The service record to add
     * @param outcome The outcome of the match
     */
    public AddPlayerMatch(match: PlayerMatch, outcome?: HaloOutcome): void
    {
        this.summary = 
        {
            kills: match.player.summary.kills + this.summary.kills,
            deaths: match.player.summary.deaths + this.summary.deaths,
            assists: match.player.summary.assists + this.summary.assists,
            betrayals: this.summary.betrayals,
            suicides: this.summary.suicides,
            vehicles:
            {
                destroys: this.summary.vehicles.destroys,
                hijacks: this.summary.vehicles.hijacks
            },
            medals: this.summary.medals
        };

        this.damage =
        {
            taken: this.damage.taken,
            dealt: this.damage.dealt,
            average: 0
        };

        this.shots = 
        {
            fired: this.shots.fired,
            landed: this.shots.landed,
            missed: this.shots.missed,
            accuracy: 0
        };

        if (this.shots.fired !== 0)
        {
            this.shots.accuracy = (this.shots.landed / this.shots.fired) * 100;
        }

        this.breakdowns =
        {
            kills: 
            {
                melee: this.breakdowns.kills.melee,
                grenades: this.breakdowns.kills.grenades,
                headshots: this.breakdowns.kills.headshots,
                powerWeapons: this.breakdowns.kills.powerWeapons,
                assassinations: this.breakdowns.kills.assassinations,
                splatters: this.breakdowns.kills.splatters,
                repulsor: this.breakdowns.kills.repulsor,
                fusionCoil: this.breakdowns.kills.fusionCoil,
                sticks: this.breakdowns.kills.sticks
            },
            assists:
            {
                emp: this.breakdowns.assists.emp,
                driver: this.breakdowns.assists.driver,
                callouts: this.breakdowns.assists.callouts
            },
            matches:
            {
                wins: this.breakdowns.matches.wins + (match.player.outcome === HaloOutcome.Win ? 1 : 0),
                losses: this.breakdowns.matches.losses + (match.player.outcome === HaloOutcome.Loss ? 1 : 0),
                left: this.breakdowns.matches.left + (match.player.outcome === HaloOutcome.Draw ? 1 : 0),
                draws: this.breakdowns.matches.draws + (match.player.outcome === HaloOutcome.Left ? 1 : 0)
            }
        };

        this.timePlayed = new TimePlayed({
            seconds: this.timePlayed.seconds,
            human: ""
        });

        this.matchesPlayed = 1 + this.matchesPlayed;
        
        if (this.summary.deaths !== 0)
        {
            this.kdr = this.summary.kills / this.summary.deaths;
        }
        
        if (this.matchesPlayed !== 0)
        {
            this.winRate = (this.breakdowns.matches.wins / this.matchesPlayed) * 100;
            this.kda = (this.summary.kills + (this.summary.assists / 3) - this.summary.deaths) / this.matchesPlayed;
            this.damage.average = (this.damage.dealt / this.matchesPlayed) * 100;
        }
    }
    
    /**
     * Gets the entire group of medals that match the medal type
     * @param type the medal type
     * @returns array of medals sorted by rarity
     */
    public GetMedalType(type: MedalType): Medal[]
    {
        const filtered = this.medals.filter(medal => medal.type === type);
        return filtered.sort((a, b) => a.sort > b.sort ? 1 : -1);
    }

    /** Returns true if the service record is empty */
    public IsEmpty = (): boolean => this.summary.kills === 0 && this.summary.deaths === 0 && this.matchesPlayed === 0;
}