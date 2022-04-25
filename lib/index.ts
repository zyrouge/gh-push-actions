import os from "os";
import path from "path";
import fs from "fs-extra";
import readdirp from "readdirp";
import * as sgit from "simple-git";
import { parseOptions, printOptions } from "./options";
import { Logger } from "./log";

const start = async () => {
    const options = parseOptions();
    printOptions(options);
    Logger.isVerbose = options.verbose;

    const resolvedDirectory = path.isAbsolute(options.directory)
        ? options.directory
        : path.resolve(options.workspace, options.directory);
    Logger.info(`Push Directory: ${resolvedDirectory}`);

    if (!(await fs.pathExists(resolvedDirectory))) {
        throw Error(
            `Desired push directory (${resolvedDirectory}) does not exist.`
        );
    }

    const temporaryDirectory = path.join(
        os.tmpdir(),
        `${Date.now()}-${path.basename(resolvedDirectory)}`
    );
    Logger.debug(`Temporary Directory: ${temporaryDirectory}`);

    if (await fs.pathExists(temporaryDirectory)) {
        throw Error(
            `Unable to create temporary directory (${temporaryDirectory}) since it already exists.`
        );
    }

    await fs.mkdir(temporaryDirectory, {
        recursive: true,
    });

    const ghRepoUrl = `https://x-access-token:${options.githubToken}@github.com/${options.repository}`;

    const git = sgit.default(temporaryDirectory);

    // git clone <url> <path>
    Logger.verb(`git: stdout: ${await git.clone(ghRepoUrl, ".")}`);
    Logger.info(`git: Cloned to ${temporaryDirectory}`);

    // git config --local user.name <username>
    Logger.verb(
        `git: stdout: ${await git.addConfig(
            "user.name",
            options.localUsername,
            undefined,
            "local"
        )}`
    );
    Logger.debug(`git: Changed local username to ${options.localUsername}`);

    // git config --local user.email <email>
    Logger.verb(
        `git: stdout: ${await git.addConfig(
            "user.email",
            options.localEmail,
            undefined,
            "local"
        )}`
    );
    Logger.debug(`git: Changed local email to ${options.localEmail}`);

    const branches = await git.branch();
    // git checkout <branch> || git checkout -b <branch>
    if (branches.all.includes(options.branch)) {
        Logger.verb(`git: stdout: ${await git.checkout(options.branch)}`);
    } else {
        Logger.verb(
            `git: stdout: ${await git.checkout({
                "-b": options.branch,
            })}`
        );
    }
    Logger.info(`git: Checked out ${options.branch}`);

    for await (const file of readdirp(resolvedDirectory, {
        type: "files",
        directoryFilter: (entry) =>
            path.relative(entry.fullPath, temporaryDirectory) !== "",
    })) {
        const relativePath = path.relative(resolvedDirectory, file.fullPath);
        const copyPath = path.join(temporaryDirectory, relativePath);
        await fs.copyFile(file.fullPath, copyPath);
        Logger.debug(`copy: Copied ${file.fullPath} -> ${copyPath}`);
    }

    // git add .
    Logger.verb(`git: stdout: ${await git.add(".")}`);
    Logger.info("git: Added files");

    // git commit -m "${{ steps.commit-msg.outputs.result }}"
    const commitResult = await git.commit(options.commitMessage);
    Logger.verb(
        `git: stdout: author=${commitResult.author} | branch=${commitResult.branch} | commit=${commitResult.commit} | additions=${commitResult.summary.insertions} | deletions=${commitResult.summary.deletions} | changes=${commitResult.summary.changes}`
    );
    Logger.info(`git: Commit with message: ${options.commitMessage}`);

    const pushOptions: sgit.Options = {};
    if (options.force) {
        pushOptions["--force"] = null;
    }

    // git push origin <branch> [--force]
    const pushResult = await git.push("origin", options.branch, pushOptions);
    Logger.verb(
        `git: stdout: repo=${pushResult.repo} | remoteName=${pushResult.branch?.remoteName}`
    );
    Logger.info(`git: Push files to ${options.branch}`);
};

start().catch((err) => {
    Logger.error("Something went wrong!");
    Logger.error(err);
    Logger.error(err.stack);
    process.exit(err.code || -1);
});
