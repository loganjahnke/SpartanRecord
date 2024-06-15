import moment from "moment";
import { Debugger } from "./Debugger";

export class Cookie
{
    /**
     * Sets the value into the name
     * @param name the key
     * @param val the value
     */
    public static set(name: string, val: string): void
    {
        const date = new Date();
        const value = val;
    
        // Set it expire in 365 days
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    
        // Set it
        document.cookie = name+"="+value+"; expires="+date.toUTCString()+"; path=/";
    }
    
    /**
     * Gets the cookie by name
     * @param name the key
     * @returns the value
     */
    public static get(name: string): string | undefined
    {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        
        if (parts.length === 2) {
            return parts.pop()?.split(";").shift();
        }
    }

    /**
     * Adds a gamertag to the most recent list
     * @param gamertag the gamertag to add
     */
    public static addRecent(gamertag: string): void
    {
        if (this.isFavorite(gamertag)) { return; }

        const recents = this.getRecents();
        if (recents.includes(gamertag))
        {
            if (recents[0] === gamertag) { return; }
            if (recents[1] === gamertag) 
            { 
                const move = recents[0];
                recents[0] = gamertag;
                recents[1] = move;
                return;
            }
        }

        if (recents.length === 3)
        {
            recents[2] = recents[1];
            recents[1] = recents[0];
            recents[0] = gamertag;
        }
        else if (recents.length === 2)
        {
            recents.push(recents[1]);
            recents[1] = recents[0];
            recents[0] = gamertag;
        }
        else if (recents.length === 1)
        {
            recents.push(recents[0]);
            recents[0] = gamertag;
        }
        else
        {
            recents.push(gamertag);
        }

        this.set("sc-recents", recents.join("|"));
    }

    /**
     * Gets the recent gamertags
     * @returns the recent gamertags
     */
    public static getRecents(): string[]
    {
        const recentsAsString = this.get("sc-recents");
        if (recentsAsString)
        {
            const split = recentsAsString.split("|");
            if (split && split.length > 0)
            {
                return split;
            }
        }

        return [];
    }

    /**
     * Adds a gamertag to the spartan company
     * @param gamertag the gamertag to add
     */
    public static addGamertagToCompany(gamertag: string): void
    {
        const members = this.getCompanyMembers();
        if (members.includes(gamertag))
        {
            return;
        }

        members.push(gamertag);
        this.set("sc-company", members.join("|"));
    }

    /**
     * Removes a gamertag to the spartan company
     * @param gamertag the gamertag to remove
     */
    public static removeGamertagToCompany(gamertag: string): void
    {
        const members = this.getCompanyMembers();
        if (!members.includes(gamertag))
        {
            return;
        }
        
        this.set("sc-company", members.filter(member => member !== gamertag).join("|"));
    }

    /**
     * Gets the gamertags in the spartan company
     * @returns the gamertags in the spartan company
     */
    public static getCompanyMembers(): string[]
    {
        const spartanCompany = this.get("sc-company");
        if (spartanCompany)
        {
            const split = spartanCompany.split("|");
            if (split && split.length > 0)
            {
                return split;
            }
        }

        return [];
    }

    /**
     * Gets the name of the spartan company
     * @returns the name of the spartan company
     */
    public static getCompanyName(): string
    {
        const name = this.get("sc-company-name");
        return name ?? "";
    }

    /**
     * Gets the medal of the spartan company
     * @returns the medal of the spartan company
     */
    public static getCompanyMedal(): number | undefined
    {
        const medal = this.get("sc-company-medal");
        return medal ? +medal : undefined;
    }

    /**
     * Sets the SC name and medal
     * @param name the new SC name
     * @param medal the new SC medal
     */
    public static setSpartanCompanyNameAndMedal(name: string, medal: number): void
    {
        this.set("sc-company-name", name);
        this.set("sc-company-medal", medal.toString());
    }

    /** Gets the show unearned stats cookie */
    public static getShowUnearnedMedals = (): boolean => this.get("sc-show-unearned") === "true";

    /**
     * Sets the show unearned stats cookie
     * @param show set the show boolean
     */
    public static setShowUnearnedMedals = (show: boolean): void => this.set("sc-show-unearned", show.toString());

    /** Gets the show expanded stats cookie */
    public static getShowExpanded = (): boolean => this.get("sc-show-expanded") === "true";

    /**
     * Sets the show expanded stats cookie
     * @param show set the show boolean
     */
    public static setShowExpanded = (show: boolean): void => this.set("sc-show-expanded", show.toString());
    
    /**
     * Deletes a cookie by name
     * @param name the key
     */
    public static delete(name: string): void
    {
        const date = new Date();
    
        // Set it expire in -1 days
        date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
    
        // Set it
        document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
    }

    //#region Favorites
    /**
     * Gets all favorites as a Set
     */
    public static getFavorites(): string[]
    {
        const all = this.__getFavorites();
        Debugger.Simple("Cookie", "getFavorites()", all);
        if (!all) { return []; }
        return all.split("|");
    }

    /**
     * Gets all favorites as a Set
     */
    public static allFavorites(): Set<string>
    {
        const all = this.__getFavorites();
        return this.__convertFavoritesToSet(all);
    }

    /**
     * Determines if a gamertag is a favorite
     * @param gamertag the gamertag to check
     */
    public static isFavorite(gamertag: string): boolean
    {
        const all = this.allFavorites();
        return all.has(gamertag);
    }

    /**
     * Adds a favorite
     * @param gamertag the gamertag to add as a favorite
     */
    public static addFavorite(gamertag: string): void
    {
        let all = this.__getFavorites();
        const set = this.__convertFavoritesToSet(all);
        if (set.has(gamertag)) { return; }

        if (!all) { all = gamertag; }
        else { all += "|" + gamertag; }

        this.set("favs", all);
    }

    /**
     * Removes a favorite
     * @param gamertag the gamertag to remove as a favorite
     */
    public static removeFavorite(gamertag: string): void
    {
        const all = this.__getFavorites();
        const set = this.__convertFavoritesToSet(all);
        if (!set.has(gamertag)) { return; }

        set.delete(gamertag);
        const str = Array.from(set).join("|");

        Debugger.Simple("Cookie", "removeFavorite()", str);
        
        this.set("favs", str);
    }

    /** Gets all favorites in the cookie */
    private static __getFavorites(): string
    {
        return this.get("favs") ?? "";
    }

    /** Converts the favorites to a set */
    private static __convertFavoritesToSet(favs: string): Set<string>
    {
        const allArray = favs.split("|");
        return new Set<string>(allArray);
    }
    //#endregion

    //#region What's New
    /**
     * Should we hide what's new for this major version?
     */
    public static getHideWhatsNew(): boolean
    {
        const version = process.env.REACT_APP_MAJOR_VERSION;
        const hideWhatsNew = this.get(`sc-hide-whatsnew${version}`);
        return !!hideWhatsNew;
    }

    /**
     * Should we hide what's new for this major version?
     */
    public static dismissWhatsNew(): void
    {
        const version = process.env.REACT_APP_MAJOR_VERSION;
        this.set(`sc-hide-whatsnew${version}`, "true");
    }
    //#endregion

    //#region Hero Tracker
    /**
     * Get the hero tracker goal date for the user
     */
    public static getHeroTrackerGoalDate(): moment.Moment | null
    {
        const dateAsString = this.get(`sr-hero-tracker-goal-date`);
        if (!dateAsString) { return null; }

        const momentDate = moment(dateAsString);
        return momentDate;
    }

    /**
     * Set the hero tracker goal date for the user
     * @param date the date to set into the cookie
     */
    public static setHeroTrackerGoalDate(date: moment.Moment): void
    {
        this.set(`sr-hero-tracker-goal-date`, date.toString());
    }
    //#endregion
}