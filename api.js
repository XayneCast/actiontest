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
exports.GithubAPI = exports.GithubAPIConnectionFailed = exports.GithubAPIResourceNotFoundError = exports.GithubAPIResourceConflictError = exports.GithubAPIResourceForbiddenError = void 0;
var axios_1 = require("axios");
var GithubAPIResourceError = /** @class */ (function (_super) {
    __extends(GithubAPIResourceError, _super);
    function GithubAPIResourceError(errorMessage) {
        return _super.call(this, errorMessage) || this;
    }
    return GithubAPIResourceError;
}(Error));
var GithubAPIResourceForbiddenError = /** @class */ (function (_super) {
    __extends(GithubAPIResourceForbiddenError, _super);
    function GithubAPIResourceForbiddenError(resourcePath) {
        return _super.call(this, "Requested resource cannot be accessed without appropriate authorizations:\n\t'".concat(resourcePath, "'")) || this;
    }
    return GithubAPIResourceForbiddenError;
}(GithubAPIResourceError));
exports.GithubAPIResourceForbiddenError = GithubAPIResourceForbiddenError;
var GithubAPIResourceConflictError = /** @class */ (function (_super) {
    __extends(GithubAPIResourceConflictError, _super);
    function GithubAPIResourceConflictError(resourcePath) {
        return _super.call(this, "Requested resource is conflicting with another:\n\t'".concat(resourcePath, "'")) || this;
    }
    return GithubAPIResourceConflictError;
}(GithubAPIResourceError));
exports.GithubAPIResourceConflictError = GithubAPIResourceConflictError;
var GithubAPIResourceNotFoundError = /** @class */ (function (_super) {
    __extends(GithubAPIResourceNotFoundError, _super);
    function GithubAPIResourceNotFoundError(resourcePath) {
        return _super.call(this, "Requested resource can not be found:\n\t'".concat(resourcePath, "'")) || this;
    }
    return GithubAPIResourceNotFoundError;
}(GithubAPIResourceError));
exports.GithubAPIResourceNotFoundError = GithubAPIResourceNotFoundError;
var GithubAPIConnectionFailed = /** @class */ (function (_super) {
    __extends(GithubAPIConnectionFailed, _super);
    function GithubAPIConnectionFailed() {
        return _super.call(this, "Connection to the Github API failed !") || this;
    }
    return GithubAPIConnectionFailed;
}(Error));
exports.GithubAPIConnectionFailed = GithubAPIConnectionFailed;
var GITHUB_API_VARIABLES = {
    API_URL: 'https://api.github.com',
    API_BOT_NAME: 'Legacy System',
    API_BOT_EMAIL: 'xaynecast.core@gmail.com'
};
var GithubAPI = /** @class */ (function () {
    function GithubAPI(token) {
        this._headers = {
            responseEncoding: 'utf-8',
            responseType: 'json',
            headers: {
                Authorization: "Bearer ".concat(token),
                Accept: 'application/vnd.github+json'
            }
        }; //Define the necessary Github API headers
    }
    /**
     * @brief Create the given link to the github resource path from the given informations
     *
     * @param {string} ownerName: The name of the owner of the repository to get the item to create a link from
     * @param {string} repositoryName: The name of the repository to get the item to create a link from
     * @param {string} itemPath: The path of the item to create a link from
     *
     * @returns {string} The github resource path
    */
    GithubAPI.prototype.__createLink = function (ownerName, repositoryName, itemPath) {
        return "".concat(GITHUB_API_VARIABLES.URL, "/repos/").concat(ownerName, "/").concat(repositoryName, "/contents/").concat(itemPath); //Create the github resource path from the specified informations
    };
    /**
     * @brief Get the requested unique identifier from the resource path
     *
     * @param {string} resourcePath: The path of the resource to get the unique identifier from
     *
     * @returns {Promise<IGithubGetItemIdResponse>} The result of the get
    */
    GithubAPI.prototype.__getItemId = function (resourcePath) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.head(resourcePath, this._headers)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                status: response.status,
                                sha: response.headers.etag.slice(3, -1)
                            }]; //Return the unique identifier of the specified resource
                    case 2:
                        error_1 = _a.sent();
                        switch (error_1.response.status) { //Handle the error status
                            case 403: //If 403 status
                                throw new GithubAPIResourceForbiddenError(resourcePath); //Throw resource forbidden error
                            case 404: //If 404 status
                                throw new GithubAPIResourceNotFoundError(resourcePath); //Throw resource not found error
                            default: //If other unspecified status
                                throw new GithubAPIConnectionFailed(); //Throw connection error
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @brief Get the requested item from the given user repository
     *
     * @param {string} ownerName: The name of the owner of the repository to get the item from
     * @param {string} repositoryName: The name of the repository to get the item from
     * @param {string} itemPath: The path of the item to get
     *
     * @returns {Promise<IGithubGetItemResponse>} The result of the get
    */
    GithubAPI.prototype.getItem = function (ownerName, repositoryName, itemPath) {
        return __awaiter(this, void 0, void 0, function () {
            var resourcePath, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resourcePath = this.__createLink(ownerName, repositoryName, itemPath);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get(resourcePath, this._headers)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, {
                                status: response.status,
                                data: {
                                    sha: response.data.sha,
                                    content: Buffer.from(response.data.content, 'base64').toString('utf-8'),
                                    size: response.data.size
                                }
                            }]; //Return the requested item
                    case 3:
                        error_2 = _a.sent();
                        console.log(JSON.stringify(error_2, null, 4));
                        switch (error_2.response.status) { //Handle the error status
                            case 403: //If 403 status
                                throw new GithubAPIResourceForbiddenError(resourcePath); //Throw resource forbidden error
                            case 404: //If 404 status
                                throw new GithubAPIResourceNotFoundError(resourcePath); //Throw resource not found error
                            default: //If other unspecified status
                                throw new GithubAPIConnectionFailed(); //Throw connection error
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @brief Update the requested item in the given user repository with the given content
     *
     * @param {message} messageContent: The message to show in the commit
     * @param {string} content: The content to update
     * @param {string} ownerName: The name of the owner of the repository to update the item from
     * @param {string} repositoryName: The name of the repository to update the item from
     * @param {string} itemPath: The path of the item to update
    */
    GithubAPI.prototype.updateItem = function (messageContent, content, ownerName, repositoryName, itemPath) {
        return __awaiter(this, void 0, void 0, function () {
            var resourcePath, data, options, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resourcePath = this.__createLink(ownerName, repositoryName, itemPath);
                        return [4 /*yield*/, this.__getItemId(resourcePath)];
                    case 1:
                        data = _a.sent();
                        options = {
                            owner: ownerName,
                            repo: repositoryName,
                            path: itemPath,
                            message: messageContent,
                            committer: {
                                name: GITHUB_API_VARIABLES.API_BOT_NAME,
                                email: GITHUB_API_VARIABLES.API_BOT_EMAIL
                            },
                            content: Buffer.from(content, 'utf-8').toString('base64'),
                            sha: data.sha
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1.default.put(resourcePath, options, this._headers)];
                    case 3:
                        _a.sent(); //Request the creation or the update of the specified resource
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        switch (error_3.response.status) { //Handle the error status
                            case 404: //If 404 status
                                throw new GithubAPIResourceNotFoundError(resourcePath); //Throw resource not found error
                            case 409: //If 409 status
                                throw new GithubAPIResourceConflictError(resourcePath); //Throw resource conflict error
                            case 422: //If 422 status
                                throw new GithubAPIResourceForbiddenError(resourcePath); //Throw resource forbidden error
                            default: //If other unspecified status
                                throw new GithubAPIConnectionFailed(); //Throw connection error
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @brief Delete the requested item in the given user repository
     *
     * @param {message} messageContent: The message to show in the commit
     * @param {string} ownerName: The name of the owner of the repository to delete the item from
     * @param {string} repositoryName: The name of the repository to delete the item from
     * @param {string} itemPath: The path of the item to delete
    */
    GithubAPI.prototype.deleteItem = function (messageContent, ownerName, repositoryName, itemPath) {
        return __awaiter(this, void 0, void 0, function () {
            var resourcePath, data, options, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resourcePath = this.__createLink(ownerName, repositoryName, itemPath);
                        return [4 /*yield*/, this.__getItemId(resourcePath)];
                    case 1:
                        data = _a.sent();
                        options = {
                            owner: ownerName,
                            repo: repositoryName,
                            path: itemPath,
                            message: messageContent,
                            committer: {
                                name: GITHUB_API_VARIABLES.API_BOT_NAME,
                                email: GITHUB_API_VARIABLES.API_BOT_EMAIL
                            },
                            sha: data.sha
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1.default.delete(resourcePath, {
                                data: options,
                                params: this._headers
                            })];
                    case 3:
                        _a.sent(); //Request the deletion of the specified resource
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _a.sent();
                        switch (error_4.response.status) { //Handle the error status
                            case 404: //If 404 status
                                throw new GithubAPIResourceNotFoundError(resourcePath); //Throw resource not found error
                            case 409: //If 409 status
                                throw new GithubAPIResourceConflictError(resourcePath); //Throw resource conflict error
                            case 422: //If 422 status
                                throw new GithubAPIResourceForbiddenError(resourcePath); //Throw resource forbidden error
                            default: //If other unspecified status
                                throw new GithubAPIConnectionFailed();
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return GithubAPI;
}());
exports.GithubAPI = GithubAPI;
