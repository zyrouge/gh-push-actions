import spawn from "cross-spawn";
import { ILoggerMethod, logger } from "./log";

export interface IGitOptions {
    directory: string;
}

export interface IGitRunOutput {
    spawnFile: string;
    spawnArgs: string[];
    stdout: string;
    stderr: string;
    exitCode: number | null;
}

export class Git {
    constructor(public readonly options: IGitOptions) {}

    async run(args: string[]): Promise<IGitRunOutput> {
        return new Promise<IGitRunOutput>((resolve, reject) => {
            const child = spawn("git", args, {
                cwd: this.options.directory,
                stdio: "pipe",
            });

            const result: IGitRunOutput = {
                spawnFile: child.spawnfile,
                spawnArgs: child.spawnargs,
                stdout: "",
                stderr: "",
                exitCode: null,
            };

            child.stdout?.addListener("data", (msg) => {
                result.stdout += msg.toString();
            });

            child.stderr?.addListener("data", (msg) => {
                result.stderr += msg.toString();
            });

            child.on("close", (exitCode) => {
                result.exitCode = exitCode;
                if (result.exitCode === 0) return resolve(result);
                return reject(result);
            });
        });
    }

    async print(
        prefix: string,
        output: IGitRunOutput,
        method: ILoggerMethod = "verb"
    ) {
        logger[method](`git: ${prefix}: spawnFile`, output.spawnFile);
        logger[method](`git: ${prefix}: spawnArgs`, output.spawnArgs.join(" "));
        logger[method](
            `git: ${prefix}: exitCode`,
            output.exitCode?.toString() ?? "-"
        );
        logger[method](`git: ${prefix}: stdout`, output.stdout);
        logger[method](`git: ${prefix}: stderr`, output.stderr);
    }
}
