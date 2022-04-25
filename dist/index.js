"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const sgit = __importStar(require("simple-git"));
const options_1 = require("./options");
const log_1 = require("./log");
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    var _b;
    const options = (0, options_1.parseOptions)();
    (0, options_1.printOptions)(options);
    log_1.Logger.isVerbose = options.verbose;
    const resolvedDirectory = path_1.default.isAbsolute(options.directory)
        ? options.directory
        : path_1.default.resolve(options.workspace, options.directory);
    log_1.Logger.info(`Push Directory: ${resolvedDirectory}`);
    if (!(yield fs_extra_1.default.pathExists(resolvedDirectory))) {
        throw Error(`Desired push directory (${resolvedDirectory}) does not exist.`);
    }
    const temporaryDirectory = path_1.default.join(os_1.default.tmpdir(), `${Date.now()}-${path_1.default.basename(resolvedDirectory)}`);
    log_1.Logger.debug(`Temporary Directory: ${temporaryDirectory}`);
    if (yield fs_extra_1.default.pathExists(temporaryDirectory)) {
        throw Error(`Unable to create temporary directory (${temporaryDirectory}) since it already exists.`);
    }
    yield fs_extra_1.default.mkdir(temporaryDirectory, {
        recursive: true,
    });
    const ghRepoUrl = `https://x-access-token:${options.githubToken}@github.com/${options.repository}`;
    const git = sgit.default(temporaryDirectory);
    // git clone <url> <path>
    log_1.Logger.verb(`git: stdout: ${yield git.clone(ghRepoUrl, ".")}`);
    log_1.Logger.info(`git: Cloned to ${temporaryDirectory}`);
    // git config --local user.name <username>
    log_1.Logger.verb(`git: stdout: ${yield git.addConfig("user.name", options.localUsername, undefined, "local")}`);
    log_1.Logger.debug(`git: Changed local username to ${options.localUsername}`);
    // git config --local user.email <email>
    log_1.Logger.verb(`git: stdout: ${yield git.addConfig("user.email", options.localEmail, undefined, "local")}`);
    log_1.Logger.debug(`git: Changed local email to ${options.localEmail}`);
    const branches = yield git.branch();
    // git checkout <branch> || git checkout -b <branch>
    if (branches.all.includes(options.branch)) {
        log_1.Logger.verb(`git: stdout: ${yield git.checkout(options.branch)}`);
    }
    else {
        log_1.Logger.verb(`git: stdout: ${yield git.checkout({
            "-b": options.branch,
        })}`);
    }
    log_1.Logger.info(`git: Checked out ${options.branch}`);
    try {
        for (var _c = __asyncValues((0, readdirp_1.default)(resolvedDirectory, {
            type: "files",
            directoryFilter: (entry) => path_1.default.relative(entry.fullPath, temporaryDirectory) !== "",
        })), _d; _d = yield _c.next(), !_d.done;) {
            const file = _d.value;
            const relativePath = path_1.default.relative(resolvedDirectory, file.fullPath);
            const copyPath = path_1.default.join(temporaryDirectory, relativePath);
            yield fs_extra_1.default.copyFile(file.fullPath, copyPath);
            log_1.Logger.debug(`copy: Copied ${file.fullPath} -> ${copyPath}`);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // git add .
    log_1.Logger.verb(`git: stdout: ${yield git.add(".")}`);
    log_1.Logger.info("git: Added files");
    // git commit -m "${{ steps.commit-msg.outputs.result }}"
    const commitResult = yield git.commit(options.commitMessage);
    log_1.Logger.verb(`git: stdout: author=${commitResult.author} | branch=${commitResult.branch} | commit=${commitResult.commit} | additions=${commitResult.summary.insertions} | deletions=${commitResult.summary.deletions} | changes=${commitResult.summary.changes}`);
    log_1.Logger.info(`git: Commit with message: ${options.commitMessage}`);
    const pushOptions = {};
    if (options.force) {
        pushOptions["--force"] = null;
    }
    // git push origin <branch> [--force]
    const pushResult = yield git.push("origin", options.branch, pushOptions);
    log_1.Logger.verb(`git: stdout: repo=${pushResult.repo} | remoteName=${(_b = pushResult.branch) === null || _b === void 0 ? void 0 : _b.remoteName}`);
    log_1.Logger.info(`git: Push files to ${options.branch}`);
});
start().catch((err) => {
    log_1.Logger.error("Something went wrong!");
    log_1.Logger.error(err);
    log_1.Logger.error(err.stack);
    process.exit(err.code || -1);
});
