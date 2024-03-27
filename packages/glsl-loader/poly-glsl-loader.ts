import * as path from "path";
import * as fs from "fs";

function parser(
  loader,
  filePath,
  source: string,
  cacheNodes,
  isRoot,
  callback
) {
  let includePattern = /#include "([.\/\w_-]+)"/gi;
  let continueParsing = true;

  while (continueParsing) {
    var match = includePattern.exec(source);
    if (!match) {
      continueParsing = false;
    } else {
      let includedPath = path.resolve(path.join(filePath, match[1]));
      let includedSrc = fs.readFileSync(includedPath, "utf-8");
      loader.addDependency(includedPath);

      source = source.replace(match[0], includedSrc);
    }
  }

  return callback(source);
}

export default function (source) {
  this.cacheable && this.cacheable();
  const callback = this.async();

  parser(this, this.context, source, null, true, function (resolvedSrc) {
    const exportSrc = `module.exports = ${JSON.stringify(resolvedSrc)}`;
    return callback(null, exportSrc);
  });
}
