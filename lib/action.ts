import os from "os";
import path from "path";
import fs from "fs-extra";
import readdirp from "readdirp";
import { Git, IGitRunOutput } from "./tools/git";
import { IOptions, printOptions } from "./tools/options";
import { logger } from "./tools/log";

export const action = async (options: IOptions) => {
    printOptions(options);

    logger.isVerbose = options.verbose;

    const resolvedDirectory = path.isAbsolute(options.directory)
        ? options.directory
        : path.resolve(options.workspace, options.directory);
    logger.info("options", `Push Directory: ${resolvedDirectory}`);

    if (!(await fs.pathExists(resolvedDirectory))) {
        throw Error(
            `Desired push directory (${resolvedDirectory}) does not exist.`
        );
    }

    const temporaryDirectory = path.join(
        os.tmpdir(),
        `${Date.now()}-${path.basename(resolvedDirectory)}`
    );
    logger.debug("options", `Temporary Directory: ${temporaryDirectory}`);

    if (await fs.pathExists(temporaryDirectory)) {
        throw Error(
            `Unable to create temporary directory (${temporaryDirectory}) since it already exists.`
        );
    }

    await fs.mkdir(temporaryDirectory, {
        recursive: true,
    });

    const ghRepoUrl = `https://x-access-token:${options.githubToken}@github.com/${options.repository}`;

    const git = new Git({
        directory: temporaryDirectory,
    });

    // git init
    git.print("init", await git.run(["init"]));
    logger.info("git", `Initialized repository at ${temporaryDirectory}`);

    // git config --local user.name <username>
    git.print(
        "config: user.name",
        await git.run(["config", "--local", "user.name", options.localUsername])
    );
    logger.debug("git", `Changed local username to ${options.localUsername}`);

    // git config --local user.email <email>
    git.print(
        "config: user.email",
        await git.run(["config", "--local", "user.email", options.localEmail])
    );
    logger.debug("git", `Changed local email to ${options.localEmail}`);

    // git remote add origin <url>
    git.print(
        "add-remote",
        await git.run(["remote", "add", "origin", ghRepoUrl])
    );
    logger.info("git", `Added remote "origin" -> ${ghRepoUrl}`);

    // git fetch
    git.print("fetch", await git.run(["fetch"]));
    logger.info("git", "Fetch repository");

    // git show-branch remotes/origin/<remote-branch-name>
    const checkBranch = await git
        .run(["show-branch", `remotes/origin/${options.branch}`])
        .catch((err: IGitRunOutput) => err);

    if (checkBranch.exitCode === 0) {
        // git checkout <branch>
        git.print("checkout", await git.run(["checkout", options.branch]));
    } else {
        // git checkout -b <branch>
        git.print(
            "checkout -b",
            await git.run(["checkout", "-b", options.branch])
        );
    }
    logger.info("git", `Checked out ${options.branch}`);

    for await (const file of readdirp(resolvedDirectory, {
        type: "files",
        directoryFilter: (entry) =>
            path.relative(entry.fullPath, temporaryDirectory) !== "",
    })) {
        const relativePath = path.relative(resolvedDirectory, file.fullPath);
        const copyPath = path.join(temporaryDirectory, relativePath);
        await fs.copyFile(file.fullPath, copyPath);
        logger.debug("copy", `Copied ${file.fullPath} -> ${copyPath}`);
    }

    // git add .
    git.print("add", await git.run(["add", "."]));
    logger.info("git", "Added files");

    const commitArgs: string[] = ["commit", "-m", options.commitMessage];
    if (options.allowEmptyCommit) {
        commitArgs.push("--allow-empty");
    }

    // git commit -m <message> [--allow-empty]
    git.print("commit", await git.run(commitArgs));
    logger.info("git", `Commit with message: ${options.commitMessage}`);

    const pushArgs: string[] = ["push", "-u", "origin", options.branch];
    if (options.force) {
        pushArgs.push("--force");
    }

    // git push origin <branch> [--force]
    git.print("push", await git.run(pushArgs));
    logger.info("git", `Push files to ${options.branch}`);
};
