"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var GithubAPIInformations = /** @class */ (function () {
    function GithubAPIInformations() {
    }
    GithubAPIInformations.URL = 'https://api.github.com';
    return GithubAPIInformations;
}());
var GithubAPIResourceForbiddenError = /** @class */ (function (_super) {
    __extends(GithubAPIResourceForbiddenError, _super);
    function GithubAPIResourceForbiddenError() {
        return _super.call(this, "Requested resource cannot be accessed without appropriate authorizations !") || this;
    }
    return GithubAPIResourceForbiddenError;
}(Error));
var GithubAPIResourceConflictError = /** @class */ (function (_super) {
    __extends(GithubAPIResourceConflictError, _super);
    function GithubAPIResourceConflictError() {
        return _super.call(this, "Requested resource is conflicting with another !") || this;
    }
    return GithubAPIResourceConflictError;
}(Error));
var GithubAPIResourceNotFoundError = /** @class */ (function (_super) {
    __extends(GithubAPIResourceNotFoundError, _super);
    function GithubAPIResourceNotFoundError() {
        return _super.call(this, "Requested resource can not be found !") || this;
    }
    return GithubAPIResourceNotFoundError;
}(Error));
var GithubAPIConnectionFailed = /** @class */ (function (_super) {
    __extends(GithubAPIConnectionFailed, _super);
    function GithubAPIConnectionFailed() {
        return _super.call(this, "Connection to the Github API failed !") || this;
    }
    return GithubAPIConnectionFailed;
}(Error));
var GithubAPI = /** @class */ (function () {
    function GithubAPI(token) {
        this._headers = {
            responseEncoding: 'utf-8',
            responseType: 'json',
            headers: {
                Authorization: "Bearer ".concat(token),
                Accept: 'application/vnd.github+json'
            }
        };
    }
    GithubAPI.prototype.__getData = function (itemPath, type) {
        return __awaiter(this, void 0, void 0, function () {
            var githubPath, response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        githubPath = "".concat(GithubAPIInformations.URL, "/repos/").concat(itemPath);
                        response = void 0;
                        if (!(type === 'HEAD')) return [3 /*break*/, 2];
                        return [4 /*yield*/, axios_1.default.head(githubPath, this._headers)];
                    case 1:
                        response = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, axios_1.default.get(githubPath, this._headers)];
                    case 3:
                        response = _b.sent();
                        _b.label = 4;
                    case 4:
                        switch (response.status) {
                            case 403:
                                throw new GithubAPIResourceForbiddenError();
                            case 404:
                                throw new GithubAPIResourceNotFoundError();
                            default:
                                return [2 /*return*/, {
                                        status: response.status,
                                        data: {
                                            sha: response.data.sha,
                                            content: response.data.content,
                                            size: response.data.size
                                        }
                                    }];
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        _a = _b.sent();
                        throw new GithubAPIConnectionFailed();
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    GithubAPI.prototype.__getItemId = function (owner, repository, filepath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__getData("".concat(owner, "/").concat(repository, "/contents/").concat(filepath), 'HEAD')];
            });
        });
    };
    GithubAPI.prototype.getItem = function (owner, repository, filepath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.__getData("".concat(owner, "/").concat(repository, "/contents/").concat(filepath), 'BODY')];
            });
        });
    };
    GithubAPI.prototype.updateItem = function (content, owner, repository, filepath) {
        return __awaiter(this, void 0, void 0, function () {
            var data, options, response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.__getItemId(owner, repository, filepath)];
                    case 1:
                        data = _b.sent();
                        console.log("DATA RETRIEVED FROM ITEM ID: ".concat(data));
                        options = {
                            owner: owner,
                            repo: repository,
                            path: filepath,
                            message: 'Auto updating changelog',
                            committer: {
                                name: 'Changelog updater',
                                email: 'octocat@github.com'
                            },
                            content: Buffer.from(content).toString('base64'),
                            sha: data.data.sha
                        };
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1.default.put("".concat(GithubAPIInformations.URL, "/repos/").concat(owner, "/").concat(repository, "/contents/").concat(filepath), options, this._headers)];
                    case 3:
                        response = _b.sent();
                        switch (response.status) {
                            case 404:
                                throw new GithubAPIResourceNotFoundError();
                            case 409:
                                throw new GithubAPIResourceConflictError();
                            case 422:
                                throw new GithubAPIResourceForbiddenError();
                            default:
                                return [2 /*return*/];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _b.sent();
                        throw new GithubAPIConnectionFailed();
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return GithubAPI;
}());
var GithubParameters = /** @class */ (function () {
    function GithubParameters() {
    }
    GithubParameters.getParameter = function (name) {
        return process.env["INPUT_".concat(name.replace(' ', '_').toUpperCase())] || null;
    };
    return GithubParameters;
}());
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var secret_token, file_path, value, api, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Entering main ...');
                    console.log('Retrieving action arguments ...');
                    secret_token = GithubParameters.getParameter('secret_token');
                    file_path = GithubParameters.getParameter('file_path');
                    value = 'VALUE !' //GithubParameters.getParameter('value');
                    ;
                    console.log("Action arguments retrieved !");
                    console.log('Creating Github API connection');
                    api = new GithubAPI(secret_token);
                    console.log('Github API connection created !');
                    return [4 /*yield*/, api.getItem('xaynecast', 'actiontest', 'test.md')];
                case 1:
                    content = _a.sent();
                    console.log("DATA RETRIEVED FROM ITEM ID: ".concat(content));
                    return [4 /*yield*/, api.updateItem(value, 'xaynecast', 'actiontest', file_path)];
                case 2:
                    _a.sent();
                    console.log('Exiting main !');
                    return [2 /*return*/];
            }
        });
    });
}
main();
