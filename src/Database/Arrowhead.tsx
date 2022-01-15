import { Analytics, logEvent } from "firebase/analytics";
import { Auth, browserLocalPersistence, createUserWithEmailAndPassword, sendEmailVerification, setPersistence, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { Database } from "firebase/database";
import { ArrowheadError } from "../Objects/Helpers/ArrowheadError";
import { ArrowheadUser } from "../Objects/Model/ArrowheadUser";
import { Player } from "../Objects/Model/Player";
import { ArrowheadFirebase, HaloMap, HaloMode, HaloOutcome, HaloRanked, ServiceRecordFilter } from "./ArrowheadFirebase";

export class Arrowhead
{
    public db: ArrowheadFirebase;
    public arrowheadUser?: ArrowheadUser;
    public auth: Auth;

    private __analytics: Analytics;

    constructor(database: Database, analytics: Analytics, auth: Auth)
    {
        this.__analytics = analytics;
        this.auth = auth;
        this.db = new ArrowheadFirebase(database);
    }

    //#region Authentication
    /**
     * Registers a new user
     * @param email the email
     * @param password the password
     * @param gamertag the gamertag
     * @returns error message if we failed
     */
    public async Register(email: string, password: string, gamertag: string): Promise<string>
    {
        try
        {
            // Create user
            await setPersistence(this.auth, browserLocalPersistence);
            const credential = await createUserWithEmailAndPassword(this.auth, email, password);
            this.arrowheadUser = new ArrowheadUser();
            this.arrowheadUser.user = credential.user;
            this.arrowheadUser.player = new Player(gamertag);

            // Update profile
            let error = await this.UpdateGamertag(gamertag);
            if (error) { return error; }

            // Save into database
            error = await this.db.SaveNewUser(this.arrowheadUser);
            if (error) { return error; }

            // Send email verification
            await sendEmailVerification(this.arrowheadUser.user);

            return "";
        }
        catch (error)
        {
            return `Error ${ArrowheadError.AuthenticationErrorCode}: ${error instanceof Error ? error.message : "Could not register new user"}`;
        }
    }

    /**
     * Logs a user in
     * @param email the email
     * @param password password, duh
     * @returns error message if something went wrong
     */
    public async Login(email: string, password: string): Promise<string>
    {
        try
        {
            await setPersistence(this.auth, browserLocalPersistence);
            const credential = await signInWithEmailAndPassword(this.auth, email, password);
            this.arrowheadUser = new ArrowheadUser();
            this.arrowheadUser.user = credential.user;
            const result = await this.db.GetProfile(credential.user.uid);
            if (result)
            {
                this.arrowheadUser.player = result.player;
                this.arrowheadUser.spartanCompany = result.spartanCompany;
            }
            return "";
        }
        catch (error)
        {
            return `Error ${ArrowheadError.AuthenticationErrorCode}: ${error instanceof Error ? error.message : "Could not login user"}`;
        }
    }

    /**
     * Logs the current user out
     * @returns error message if something went wrong
     */
    public async Logout(): Promise<string>
    {
        try
        {
            await signOut(this.auth);
            this.arrowheadUser = undefined;
            return "";
        }
        catch (error)
        {
            return `Error ${ArrowheadError.AuthenticationErrorCode}: ${error instanceof Error ? error.message : "Could not log out the user"}`;
        }
    }

    /**
     * Updates the gamertag for the user
     * @param gamertag the gamertag to add as the display name for the user
     * @returns true if successful
     */
    public async UpdateGamertag(gamertag: string): Promise<string>
    {
        if (!this.auth.currentUser) { return "No user signed in, cannot change gamertag"; }
        try
        {
            await updateProfile(this.auth.currentUser, { displayName: gamertag });
            return "";
        }
        catch (error)
        {
            return `Error ${ArrowheadError.ProfileUpdateErrorCode}: ${error instanceof Error ? error.message : "Could not update gamertag"}`;
        }
    }
    //#endregion

    //#region Event logging
    /**
     * Logs an event in Firebase analytics for viewing the gamertag's medals
     * @param gamertag the gamertag
     */
    public LogViewMedals(gamertag: string): void
    {
        this.LogEvent("view_medals", { gamertag: gamertag });
    }

    /**
     * Logs an event in Firebase analytics for viewing the gamertag's matches
     * @param gamertag the gamertag
     */
    public LogViewMatches(gamertag: string): void
    {
        this.LogEvent("view_matches", { gamertag: gamertag });
    }

    /**
     * Logs an event in Firebase analytics for viewing the gamertag's service record
     * @param gamertag the gamertag
     */
    public LogViewServiceRecord(gamertag: string, filter?: ServiceRecordFilter, param?: HaloMap | HaloMode | HaloOutcome | HaloRanked): void
    {
        if (filter && param)
        {
            this.LogEvent("view_service_record", { gamertag: gamertag, filter: `${filter}|${param}` });
        }
        else
        {
            this.LogEvent("view_service_record", { gamertag: gamertag });
        }
    }

    /**
     * Logs an event in Firebase analytics for viewing the spartan company
     * @param company the spartan company
     */
    public LogViewSpartanCompany(company: string): void
    {
        this.LogEvent("view_spartan_company", { spartan_company: company });
    }

    /**
     * Logs an event in Firebase analytics
     * @param event the event name
     * @param params the optional parameters
     */
    public LogEvent(event: string, params?: any): void
    {
        console.log(event);
        //logEvent(this.__analytics, event, params);
    }
    //#endregion

    //#region Profile
    /**
     * Syncs the profile with the server
     */
    public async SyncProfile()
    {
        if (this.auth?.currentUser)
        {
            const result = await this.db.GetProfile(this.auth.currentUser.uid);
            this.arrowheadUser = new ArrowheadUser(this.auth.currentUser);
            if (result)
            {
                this.arrowheadUser.player = result.player;
                this.arrowheadUser.spartanCompany = result.spartanCompany;
            }
        }
    }
    //#endregion
}