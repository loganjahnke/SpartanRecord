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
     * Logs an event in Firebase analytics for viewing the gamertag's medals
     */
    public LogViewMedals = (): void => this.__logEvent("view_medals");

    /**
     * Logs an event in Firebase analytics for viewing the gamertag's matches
     */
    public LogViewMatches = (): void => this.__logEvent("view_recent_matches");

    /**
     * Logs an event in Firebase analytics for comparing two gamertags
     */
    public LogCompare = (): void => this.__logEvent("compare_sr");

    /**
     * Logs an event in Firebase analytics for viewing the gamertag's service record
     */
    public LogViewServiceRecord(filtered?: boolean): void
    {
        if (filtered) { this.__logEvent("view_filtered_sr"); }
        else { this.__logEvent("view_sr"); }
    }

    /**
     * Logs an event in Firebase analytics for going to the subscribe page
     */
    public LogSubscribe = (): void => this.__logEvent("subscribe_page");

    /**
     * Logs an event in Firebase analytics for going to the subscribe button
     */
    public LogSubscribeButton = (): void => this.__logEvent("subscribe_button");

    /**
     * Logs an event in Firebase analytics for going to the Career Rank page
     */
    public LogCareerRank = (): void => this.__logEvent("career_rank");

    /**
     * Logs an event in Firebase analytics for going to the Leaderboard page
     */
    public LogLeaderboard = (): void => this.__logEvent("leaderboard");

    /**
     * Logs an event in Firebase analytics for viewing the spartan company
     * @param company the spartan company
     */
    public LogViewSpartanCompany = (): void => this.__logEvent("view_spartan_company");

    /**
     * Logs an error that failed to load
     */
    public LogError = (): void => this.__logEvent("error");

    /**
     * Logs an event in Firebase analytics for viewing the year in review
     */
    public LogYearInReview = (): void => this.__logEvent("year_in_review");

    /**
     * Logs an event in Firebase analytics for exporting a service record to CSV
     */
    public LogExport = (): void => this.__logEvent("export_to_csv");

    /**
     * Logs an event in Firebase analytics
     * @param event the event name
     * @param params the optional parameters
     */
    private __logEvent = (event: string, params?: any): void => logEvent(this.__analytics, event, params);
}