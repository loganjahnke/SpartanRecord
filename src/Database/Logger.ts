import { Analytics, logEvent } from "firebase/analytics";

export class Logger
{
    private __analytics: Analytics;

    /**
     * Creates a new arrowhead application
     * @param database the database manager
     * @param analytics the analytics manager
     */
    constructor(analytics: Analytics)
    {
        this.__analytics = analytics;
    }

	/**
     * Logs an event in Firebase analytics for viewing the gamertag's yesterday statistics
     * @param gamertag the gamertag
     */
    public LogViewYesterday = (): void => this.__logEvent("view_yesterday");

	/**
     * Logs an event in Firebase analytics for changing the season's chart metric
     * @param gamertag the gamertag
     */
    public LogChangeSeasonMetric = (): void => this.__logEvent("change_season_metric");

	/**
     * Logs an event in Firebase analytics for changing the recent match's metric
     * @param gamertag the gamertag
     */
    public LogChangeRecentMatchesMetric = (): void => this.__logEvent("change_matches_metric");

	/**
     * Logs an event in Firebase analytics for viewing the gamertag's medals
     * @param gamertag the gamertag
     */
    public LogViewMedals = (): void => this.__logEvent("view_medals");

    /**
     * Logs an event in Firebase analytics for viewing the gamertag's matches
     * @param gamertag the gamertag
     */
    public LogViewMatches = (): void => this.__logEvent("view_recent_matches");

    /**
     * Logs an event in Firebase analytics for viewing the gamertag's service record
     * @param gamertag the gamertag
     */
    public LogViewServiceRecord(filtered?: boolean): void
    {
        if (filtered) { this.__logEvent("view_filtered_sr"); }
        else { this.__logEvent("view_sr"); }
    }

    /**
     * Logs an event in Firebase analytics for viewing the spartan company
     * @param company the spartan company
     */
    public LogViewSpartanCompany = (): void => this.__logEvent("view_spartan_company");

    /**
     * Logs an error
     * @param gamertag the gamertag that failed to load
     */
    public LogError = (): void => this.__logEvent("error");

    /**
     * Logs an event in Firebase analytics
     * @param event the event name
     * @param params the optional parameters
     */
    private __logEvent = (event: string, params?: any): void => logEvent(this.__analytics, event, params);
}