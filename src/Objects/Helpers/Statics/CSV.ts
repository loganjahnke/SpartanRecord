import { ServiceRecord } from "../../Model/ServiceRecord";

export class CSV
{
	/**
	 * Generates a CSV for the passed in service record
	 * @param gamertag the service record's owner
	 * @param serviceRecord the service record
	 */
	public static generate(gamertag: string, serviceRecord: ServiceRecord, namePrefix?: string): void
	{
		const delimiter = ",";
		const content = this.__makeHeaders(delimiter) + "\n" + this.__makeRow(delimiter, gamertag, serviceRecord);
		const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
		
		const link = document.createElement('a');
      	if (link.download === undefined)  { return; }
		
		// Browsers that support HTML5 download attribute
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', this.__getFilename(gamertag, namePrefix));
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	/**
	 * Makes the headers for the service record CSV
	 * @param delimiter the delimiter to use
	 */
	private static __makeHeaders(delimiter: string): string
	{
		return "Gamertag" + delimiter
		+ "Matches Played" + delimiter
		+ "Win Rate" + delimiter
		+ "KDR" + delimiter
		+ "KDA" + delimiter
		+ "Kills" + delimiter
		+ "Deaths" + delimiter
		+ "Assists" + delimiter
		+ "Perfect Kills" + delimiter // Perfect medal
		+ "Headshots" + delimiter
		+ "Power Weapons" + delimiter
		+ "Melee" + delimiter
		+ "Grenades" + delimiter
		+ "Accuracy" + delimiter
		+ "Dealt" + delimiter
		+ "Taken" + delimiter
		+ "Damage Efficiency" + delimiter
		+ "Enemy Damage Efficiency" + delimiter;
	}

	/**
	 * Makes a service record row for the service record CSV
	 * @param delimiter the delimiter to use
	 */
	private static __makeRow(delimiter: string, gamertag: string, serviceRecord: ServiceRecord): string
	{
		return gamertag + delimiter
			+ serviceRecord.matchesPlayed + delimiter
			+ (serviceRecord.winRate / 100) + delimiter
			+ serviceRecord.kdr + delimiter
			+ serviceRecord.kda + delimiter
			+ serviceRecord.summary.kills + delimiter
			+ serviceRecord.summary.deaths + delimiter
			+ serviceRecord.summary.assists + delimiter
			+ serviceRecord.getMedalCount(1512363953) + delimiter // Perfect medal
			+ serviceRecord.breakdowns.kills.headshots + delimiter
			+ serviceRecord.breakdowns.kills.powerWeapons + delimiter
			+ serviceRecord.breakdowns.kills.melee + delimiter
			+ serviceRecord.breakdowns.kills.grenades + delimiter
			+ (serviceRecord.shots.accuracy / 100) + delimiter
			+ serviceRecord.damage.dealt + delimiter
			+ serviceRecord.damage.taken + delimiter
			+ serviceRecord.damageEfficiency + delimiter
			+ serviceRecord.enemyDamageEfficiency + delimiter;
	}

	/**
	 * Gets the filename for the CSV
	 * @param gamertag the gamertag
	 * @param namePrefix the optional name prefix
	 */
	private static __getFilename(gamertag: string, namePrefix?: string): string
	{
		return (gamertag) + "-" + (namePrefix || "ServiceRecord") + ".csv";
	}
}