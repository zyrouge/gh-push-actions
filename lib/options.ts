import core from "@actions/core";
import { Logger } from "./log";

export interface IOptions {
    githubToken: string;
    repository: string;
    branch: string;
    force: boolean;
    directory: string;
    tempDirPrefix: string;
    commitMessage: string;
    localUsername: string;
    localEmail: string;
}

export const parseOptions = (): IOptions => ({
    githubToken: core.getInput("github-token"),
    repository: core.getInput("repository"),
    branch: core.getInput("branch"),
    force: core.getBooleanInput("force"),
    directory: core.getInput("directory"),
    tempDirPrefix: core.getInput("temp-dir-prefix"),
    commitMessage: core.getInput("commit-message"),
    localUsername: core.getInput("local-username"),
    localEmail: core.getInput("local-email"),
});

export const printOptions = (options: IOptions) => {
    const ignoredKeys: (keyof IOptions)[] = ["githubToken"];

    Logger.info("Options:");
    (Object.keys(options) as (keyof IOptions)[]).forEach((x) => {
        if (!ignoredKeys.includes(x)) {
            Logger.info(`   ${x}: ${options[x]}`);
        }
    });
    Logger.info(" ");
};
