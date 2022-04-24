import { getInput, getBooleanInput } from "@actions/core";
import { Logger } from "./log";

export interface IOptions {
    githubToken: string;
    repository: string;
    branch: string;
    force: boolean;
    directory: string;
    commitMessage: string;
    localUsername: string;
    localEmail: string;
    workspace: string;
}

export const parseOptions = (): IOptions => ({
    githubToken: getInput("github-token"),
    repository: getInput("repository"),
    branch: getInput("branch"),
    force: getBooleanInput("force"),
    directory: getInput("directory"),
    commitMessage: getInput("commit-message"),
    localUsername: getInput("local-username"),
    localEmail: getInput("local-email"),
    workspace: process.env.GITHUB_WORKSPACE!,
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
