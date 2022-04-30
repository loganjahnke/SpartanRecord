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
    
        // Set it expire in 28 days
        date.setTime(date.getTime() + (28 * 24 * 60 * 60 * 1000));
    
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
        
        if (parts.length == 2) {
            return parts.pop()?.split(";").shift();
        }
    }

    /**
     * Adds a gamertag to the most recent list
     * @param gamertag the gamertag to add
     */
    public static addRecent(gamertag: string): void
    {
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
}