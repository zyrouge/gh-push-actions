import { getInput, getBooleanInput } from "@actions/core";
import { logger } from "./log";

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
    verbose: boolean;
    allowEmptyCommit: boolean;
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
    verbose: getBooleanInput("verbose"),
    allowEmptyCommit: getBooleanInput("allow-empty-commit"),
});

export const printOptions = (options: IOptions) => {
    const ignoredKeys: (keyof IOptions)[] = ["githubToken"];

    logger.info("options", "Input Options:");
    (Object.keys(options) as (keyof IOptions)[]).forEach((x) => {
        if (!ignoredKeys.includes(x)) {
            logger.info("options", `   ${x}: ${options[x]}`);
        }
    });
    logger.ln();
};
