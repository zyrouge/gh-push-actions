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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Git = void 0;
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const log_1 = require("./log");
class Git {
    constructor(options) {
        this.options = options;
    }
    run(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const child = (0, cross_spawn_1.default)("git", args, {
                    cwd: this.options.directory,
                    stdio: "pipe",
                });
                const result = {
                    spawnFile: child.spawnfile,
                    spawnArgs: child.spawnargs,
                    stdout: "",
                    stderr: "",
                    exitCode: null,
                };
                child.on("message", (msg) => {
                    result.stdout += msg.toString();
                });
                child.on("error", (msg) => {
                    result.stderr += msg.toString();
                });
                child.on("close", (exitCode) => {
                    result.exitCode = exitCode;
                    if (result.exitCode === 0)
                        return resolve(result);
                    return reject(result);
                });
            });
        });
    }
    print(prefix, output, method = "verb") {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            log_1.logger[method](`git: ${prefix}: spawnFile`, output.spawnFile);
            log_1.logger[method](`git: ${prefix}: spawnArgs`, output.spawnArgs.join(" "));
            log_1.logger[method](`git: ${prefix}: exitCode`, (_b = (_a = output.exitCode) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "-");
            log_1.logger[method](`git: ${prefix}: stdout`, output.stdout);
            log_1.logger[method](`git: ${prefix}: stderr`, output.stderr);
        });
    }
}
exports.Git = Git;
