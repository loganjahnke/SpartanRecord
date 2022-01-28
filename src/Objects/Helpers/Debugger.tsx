export class Debugger
{
    /**
     * Gets the rough byte estimate for an object
     * @param object the object
     * @returns number of bytes
     */
    private static RoughSizeOfObject(object: any): number
    {
        let objectList = [];
        let stack = [object];
        let bytes = 0;
    
        while (stack.length) 
        {
            let value = stack.pop();
    
            if (typeof value === "boolean")
            {
                bytes += 4;
            }
            else if (typeof value === "string")
            {
                bytes += value.length * 2;
            }
            else if (typeof value === "number")
            {
                bytes += 8;
            }
            else if (typeof value === "object" && objectList.indexOf(value) === -1)
            {
                objectList.push(value);
    
                for (let key in value) 
                {
                    bytes += key.length;
                    stack.push(value[key]);
                }
            }
        }
        return bytes;
    }

    /**
     * Gets the formatted number of bytes
     * @param bytes the number of bytes
     * @returns highest order of bytes
     */
    private static FormatByteSize(bytes: number) 
    {
        if (bytes < 1024) { return bytes + " bytes"; }
        else if (bytes < 1048576) { return (bytes / 1024).toFixed(3) + " KiB"; }
        else if (bytes < 1073741824) { return (bytes / 1048576).toFixed(3) + " MiB"; }
        else { return (bytes / 1073741824).toFixed(3) + " GiB"; }
    }

    /**
     * Prints a debug message to the console
     * @param start is this the start or end of a method
     * @param caller the caller function
     * @param message the message details (optional)
     * @param object should show object details? (optional)
     */
    public static Size(object: any, description?: string)
    {
        console.log(`Size of ${description || "object"}: ${this.FormatByteSize(this.RoughSizeOfObject(object))}`);
    }

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