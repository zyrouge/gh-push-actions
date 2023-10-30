import { parseOptions } from "./tools/options";
import { logger } from "./tools/log";
import { action } from "./action";

const start = async () => {
    try {
        const options = parseOptions();
        await action(options);
    } catch (err: any) {
        logger.error("main", "Something went wrong!");
        console.error(err);
        console.error(err.stack);
        process.exit(1);
    }
};

start();
