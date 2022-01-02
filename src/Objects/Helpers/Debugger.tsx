export class Debugger
{
    /**
     * Prints a debug message to the console
     * @param start is this the start or end of a method
     * @param caller the caller function
     * @param message the message details (optional)
     * @param object should show object details? (optional)
     */
    public static Print(start: boolean, caller: string, message?: string, object?: any)
    {
        let result = start ? "START " : "END ";
        result += caller;

        if (message) { result += " - " + message; }
        if (object) 
        { 
            let key: keyof any;
            for (key in object)
            {
                result += `\n\t${key} = ${object[key]}`;
            }
        }

        console.log(result);
    }

    /**
     * Prints a debug message to the console
     * @param message the message details
     */
        public static Continue(message: string)
        {
            console.log(`\t${message}`);
        }
}