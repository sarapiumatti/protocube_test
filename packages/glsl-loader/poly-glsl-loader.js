"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
function parser(loader, filePath, source, cacheNodes, isRoot, callback) {
    var includePattern = /#include "([.\/\w_-]+)"/gi;
    var continueParsing = true;
    while (continueParsing) {
        var match = includePattern.exec(source);
        if (!match) {
            continueParsing = false;
        }
        else {
            var includedPath = path.resolve(path.join(filePath, match[1]));
            var includedSrc = fs.readFileSync(includedPath, 'utf-8');
            loader.addDependency(includedPath);
            source = source.replace(match[0], includedSrc);
        }
    }
    return callback(source);
}
function default_1(source) {
    this.cacheable && this.cacheable();
    var callback = this.async();
    parser(this, this.context, source, null, true, function (resolvedSrc) {
        var exportSrc = "module.exports = " + JSON.stringify(resolvedSrc);
        return callback(null, exportSrc);
    });
}
exports.default = default_1;
