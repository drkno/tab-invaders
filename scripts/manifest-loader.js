const { join, extname } = require('path');
const { promisify } = require('util');
const search = require('./manifest-utils');
const { getReverseLookupMap } = require('./entry-point-locator');

const updateManifest = async(manifest, context) => {
    const results = search(manifest);
    const reverseLookup = getReverseLookupMap();

    for (let result of results) {
        const spl = result.split('|');
        const targetName = spl[0];
        let fileName = manifest;
        let last = null;
        for (let s of spl) {
            last = fileName;
            fileName = fileName[s];
        }
        fileName = join(context.context, fileName);
        const ext = extname(fileName);
        switch(ext) {
            case '.js':
                last[spl[spl.length - 1]] = (reverseLookup[fileName] || targetName) + ext;
                break;
            case '.html':
            case '.png':
            case '.jpg':
            case '.jpeg':
            case '.gif':
                const mod = await promisify(context.loadModule)(fileName);
                const substr = mod.replace(/^[^"]+"([^"]+)";.*$/, '$1');
                last[spl[spl.length - 1]] = substr;
                break;
            default:
                throw new Error('Not implemented');
        }
    }
};

const loader = async(ctx, content) => {
    const data = JSON.parse(content);
    await updateManifest(data, ctx);
    const packageJson = require(join(ctx.rootContext, 'package.json'));
    data.name = packageJson.name;
    data.author = packageJson.author;
    data.version = packageJson.version;
    data.description = packageJson.description;
    data.homepage_url = packageJson.homepage.split('#')[0];
    data.applications.gecko.id = packageJson.name.replace('-', '') + '@knox.nz';
    let newContent = JSON.stringify(data);
    ctx.emitFile('manifest.json', newContent);
    return '{}';
};

module.exports = function(content) {
    const callback = this.async();
    loader(this, content)
        .then(response => {
            callback.apply(this, Array.isArray(response) ? [null].concat(response) : [null, response]);
        })
        .catch(error => {
            callback.apply(this, [e]);
        });
};
