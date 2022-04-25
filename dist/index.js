"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const readdirp_1 = __importDefault(require("readdirp"));
const git_1 = require("./git");
const options_1 = require("./options");
const log_1 = require("./log");
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const options = (0, options_1.parseOptions)();
    (0, options_1.printOptions)(options);
    log_1.logger.isVerbose = options.verbose;
    const resolvedDirectory = path_1.default.isAbsolute(options.directory)
        ? options.directory
        : path_1.default.resolve(options.workspace, options.directory);
    log_1.logger.info("options", `Push Directory: ${resolvedDirectory}`);
    if (!(yield fs_extra_1.default.pathExists(resolvedDirectory))) {
        throw Error(`Desired push directory (${resolvedDirectory}) does not exist.`);
    }
    const temporaryDirectory = path_1.default.join(os_1.default.tmpdir(), `${Date.now()}-${path_1.default.basename(resolvedDirectory)}`);
    log_1.logger.debug("options", `Temporary Directory: ${temporaryDirectory}`);
    if (yield fs_extra_1.default.pathExists(temporaryDirectory)) {
        throw Error(`Unable to create temporary directory (${temporaryDirectory}) since it already exists.`);
    }
    yield fs_extra_1.default.mkdir(temporaryDirectory, {
        recursive: true,
    });
    const ghRepoUrl = `https://x-access-token:${options.githubToken}@github.com/${options.repository}`;
    const git = new git_1.Git({
        directory: temporaryDirectory,
    });
    // git clone <url> <path>
    git.print("clone", yield git.run(["clone", ghRepoUrl, "."]));
    log_1.logger.info("git", `Cloned to ${temporaryDirectory}`);
    // git config --local user.name <username>
    git.print("config: user.name", yield git.run(["config", "--local", "user.name", options.localUsername]));
    log_1.logger.debug("git", `Changed local username to ${options.localUsername}`);
    // git config --local user.email <email>
    git.print("config: user.email", yield git.run(["config", "--local", "user.email", options.localEmail]));
    log_1.logger.debug("git", `Changed local email to ${options.localEmail}`);
    // git show-branch remotes/origin/<remote-branch-name>
    const checkBranch = yield git
        .run(["show-branch", `remotes/origin/${options.branch}`])
        .catch((err) => err);
    if (checkBranch.exitCode === 0) {
        // git checkout <branch>
        git.print("checkout", yield git.run(["checkout", options.branch]));
    }
    else {
        // git checkout -b <branch>
        git.print("checkout -b", yield git.run(["checkout", "-b", options.branch]));
    }
    log_1.logger.info("git", `Checked out ${options.branch}`);
    try {
        for (var _b = __asyncValues((0, readdirp_1.default)(resolvedDirectory, {
            type: "files",
            directoryFilter: (entry) => path_1.default.relative(entry.fullPath, temporaryDirectory) !== "",
        })), _c; _c = yield _b.next(), !_c.done;) {
            const file = _c.value;
            const relativePath = path_1.default.relative(resolvedDirectory, file.fullPath);
            const copyPath = path_1.default.join(temporaryDirectory, relativePath);
            yield fs_extra_1.default.copyFile(file.fullPath, copyPath);
            log_1.logger.debug("copy", `Copied ${file.fullPath} -> ${copyPath}`);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // git add .
    git.print("add", yield git.run(["add", "."]));
    log_1.logger.info("git", "Added files");
    // git commit -m "${{ steps.commit-msg.outputs.result }}"
    git.print("commit", yield git.run(["commit", "-m", options.commitMessage]));
    log_1.logger.info("git", `Commit with message: ${options.commitMessage}`);
    const pushArgs = ["push", "-u", "origin", options.branch];
    if (options.force) {
        pushArgs.push("--force");
    }
    // git push origin <branch> [--force]
    git.print("push", yield git.run(pushArgs));
    log_1.logger.info("git", `Push files to ${options.branch}`);
});
start().catch((err) => {
    log_1.logger.error("main", "Something went wrong!");
    log_1.logger.error("main", err);
    log_1.logger.error("main", err.stack);
    process.exit(err.code || -1);
});
