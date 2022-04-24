import { getInput, getBooleanInput } from "@actions/core";
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
    githubToken: getInput("github-token"),
    repository: getInput("repository"),
    branch: getInput("branch"),
    force: getBooleanInput("force"),
    directory: getInput("directory"),
    tempDirPrefix: getInput("temp-dir-prefix"),
    commitMessage: getInput("commit-message"),
    localUsername: getInput("local-username"),
    localEmail: getInput("local-email"),
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
