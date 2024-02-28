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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var GithubInformations = /** @class */ (function () {
    function GithubInformations() {
    }
    GithubInformations.URL = 'https://api.github.com';
    return GithubInformations;
}());
var GithubAPI = /** @class */ (function () {
    function GithubAPI(token) {
        this._headers = this.__createHeaders(token);
    }
    /**
     * @brief Create the necessary headers to connect to the Github API
     *
     * @param {string} token: The token to securize the Github API connection
     *
     * @returns {GithubAPIHeaders} Return the necessary headers to connect to the Github API
    */
    GithubAPI.prototype.__createHeaders = function (token) {
        return {
            responseEncoding: 'utf-8',
            responseType: 'json',
            headers: {
                Authorization: "Bearer ".concat(token),
                Accept: 'application/vnd.github+json'
            }
        };
    };
    GithubAPI.prototype.__getContentSha = function (owner, repository, filepath) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.head("".concat(GithubInformations.URL, "/repos/").concat(owner, "/").concat(repository, "/contents/").concat(filepath), this._headers)];
                    case 1:
                        response = _a.sent();
                        if (response.status !== 200) {
                            throw Error('File don\'t exists !');
                        }
                        return [2 /*return*/, response.headers.etag.slice(3, -1)];
                }
            });
        });
    };
    GithubAPI.prototype.getFileContent = function (owner, repository, filepath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.get("".concat(GithubInformations.URL, "/repos/").concat(owner, "/").concat(repository, "/contents/").concat(filepath), this._headers)];
            });
        });
    };
    GithubAPI.prototype.updateFile = function (content, owner, repository, filepath) {
        return __awaiter(this, void 0, void 0, function () {
            var fileSha, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.__getContentSha(owner, repository, filepath)];
                    case 1:
                        fileSha = _a.sent();
                        return [2 /*return*/, axios_1.default.put("".concat(GithubInformations.URL, "/repos/").concat(owner, "/").concat(repository, "/contents/").concat(filepath), {
                                owner: owner,
                                repo: repository,
                                path: filepath,
                                message: 'Auto updating changelog',
                                committer: {
                                    name: 'Changelog updater',
                                    email: 'octocat@github.com'
                                },
                                content: Buffer.from(content).toString('base64'),
                                sha: fileSha
                            }, this._headers)];
                    case 2:
                        error_1 = _a.sent();
                        throw Error('File not found !');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GithubAPI.prototype.compareCommit = function (owner, repository, firstUser, olderBranch, secondUser, newerBranch) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.get("".concat(GithubInformations.URL, "/repos/").concat(owner, "/").concat(repository, "/compare/").concat(olderBranch, "...").concat(newerBranch))];
            });
        });
    };
    return GithubAPI;
}());
var GithubParameters = /** @class */ (function () {
    function GithubParameters() {
    }
    GithubParameters.getParameter = function (name) {
        return process.env["INPUT_".concat(name.replace(/ /g, '_').toUpperCase())] || '';
    };
    return GithubParameters;
}());
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var token, api, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = GithubParameters.getParameter('SECRET_TOKEN');
                    api = new GithubAPI(token);
                    return [4 /*yield*/, api.getFileContent('xaynecast', 'test', 'test.md')];
                case 1:
                    content = _a.sent();
                    console.log(content);
                    return [4 /*yield*/, api.updateFile('LMAO !', 'xaynecast', 'test', 'test.md')];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
