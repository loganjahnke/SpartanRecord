export class Debugger
{
    /** Turns on or off debugging mode */
	private static readonly IS_DEBUGGING = process.env.NODE_ENV !== "production";

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
     * Gets the size of an object
     * @param object the object to get the size of
     */
    public static Size(object: any): string
    {
        return this.FormatByteSize(this.RoughSizeOfObject(object));
    }

    /**
     * Prints a debug message to the console
     * @param start is this the start or end of a method
     * @param caller the caller function
     * @param message the message details (optional)
     * @param object should show object details? (optional)
     */
    public static PrintSize(object: any, description?: string): void
    {
        if (!Debugger.IS_DEBUGGING) { return; }
        console.log(`Size of ${description || "object"}: ${this.Size(object)}`);
    }

    /**
     * Prints a debug message to the console
     * @param tsClass the class
     * @param tsMethod the method
     * @param message the message details (optional)
     * @param object should show object details? (optional)
     */
    public static Print(tsClass: string, tsMethod: string, message?: string, object?: any)
    {
        if (!Debugger.IS_DEBUGGING) { return; }

        let result = tsClass;
        result += "".padStart(20 - tsClass.length, " ");
        
        result += tsMethod;
        result += "".padStart(30 - tsMethod.length, " ");

        if (message) { result += message; }
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
     * @param view the name of the view
     */
    public static LoadView(view: string)
    {
        if (!Debugger.IS_DEBUGGING) { return; }
        console.log("--------------------" + view + "--------------------");
    }

    /**
     * Prints a debug message to the console
     * @param tsClass the class
     * @param tsMethod the method
     * @param message the message details (optional)
     */
    public static Simple(tsClass: string, tsMethod: string, message?: string)
    {
        if (!Debugger.IS_DEBUGGING) { return; }
        
        let result = tsClass;
        result += "".padStart(20 - tsClass.length, " ");
        
        result += tsMethod;
        result += "".padStart(30 - tsMethod.length, " ");

        if (message) { result += message; }
        
        console.log(result);
    }

    /**
     * Prints a debug message to the console
     * @param message the message details
     */
    public static Continue(message: string)
    {
        if (!Debugger.IS_DEBUGGING) { return; }
        console.log("".padStart(50, " ") + message);
    }

    /**
     * Prints a debug message to the console
     * @param message the message details
     */
    public static AxiosError(node: string, error: any)
    {
        if (!Debugger.IS_DEBUGGING) { return; }
        console.log("".padStart(20, ".") + node)
        console.log(error);
    }
}