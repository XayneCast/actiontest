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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicArguments = exports.DynamicContent = void 0;
var fs = require("fs");
var DynamicArgumentsError = /** @class */ (function (_super) {
    __extends(DynamicArgumentsError, _super);
    function DynamicArgumentsError(errorMessage) {
        return _super.call(this, errorMessage) || this;
    }
    return DynamicArgumentsError;
}(Error));
var DynamicArgumentsRequiredArgumentNotSuppliedError = /** @class */ (function (_super) {
    __extends(DynamicArgumentsRequiredArgumentNotSuppliedError, _super);
    function DynamicArgumentsRequiredArgumentNotSuppliedError(argumentName) {
        return _super.call(this, "Required argument was not supplied:\n\t'".concat(argumentName, "'")) || this;
    }
    return DynamicArgumentsRequiredArgumentNotSuppliedError;
}(DynamicArgumentsError));
var DynamicContent = /** @class */ (function () {
    function DynamicContent(content, variableTag) {
        this._allExpression = /[\S\s]*?/;
        this._content = content;
        this._variableTag = variableTag;
    }
    DynamicContent.prototype.__buildTag = function (name) {
        return "".concat(this._variableTag.begin, " ").concat(name, " ").concat(this._variableTag.end);
    };
    DynamicContent.prototype.setVariable = function (name, value) {
        var tag = this.__buildTag(name);
        this._content = this._content.replace(new RegExp("".concat(tag, "\n?").concat(this._allExpression.source).concat(tag), 'g'), value);
    };
    DynamicContent.prototype.insertVariable = function (name, value) {
        var tag = this.__buildTag(name);
        this._content = this._content.replace(new RegExp("(".concat(tag, "\n?)(").concat(this._allExpression.source).concat(tag, ")"), 'g'), "$1".concat(value, "$2"));
    };
    DynamicContent.prototype.replaceVariable = function (name, value) {
        var tag = this.__buildTag(name);
        this._content = this._content.replace(new RegExp("(".concat(tag, "\n?)").concat(this._allExpression.source, "(").concat(tag, ")"), 'g'), "$1".concat(value, "$2"));
    };
    DynamicContent.prototype.removeVariable = function (name) {
        this._content = this._content.replace(this.__buildTag(name), '');
    };
    DynamicContent.prototype.getVariable = function (name) {
        var tag = this.__buildTag(name);
        var search = new RegExp("".concat(tag, "\n?(").concat(this._allExpression.source, ")").concat(tag), 'g').exec(this._content);
        return search ? search[1] : '';
    };
    DynamicContent.prototype.getContent = function () {
        return this._content;
    };
    return DynamicContent;
}());
exports.DynamicContent = DynamicContent;
var DynamicArguments = /** @class */ (function () {
    function DynamicArguments() {
    }
    DynamicArguments.getParameter = function (parameterName) {
        var argumentValue = process.env["INPUT_".concat(parameterName.replace(' ', '_').toUpperCase())] || null;
        if (!argumentValue) {
            throw new DynamicArgumentsRequiredArgumentNotSuppliedError(parameterName);
        }
        return argumentValue;
    };
    DynamicArguments.setParameter = function (parameterName, parameterValue) {
        fs.writeFileSync(process.env['GITHUB_OUTPUT'], "".concat(parameterName.replace(' ', '_').toUpperCase(), "=").concat(parameterValue), {
            encoding: 'utf-8',
        });
    };
    return DynamicArguments;
}());
exports.DynamicArguments = DynamicArguments;
