const { join, extname } = require('path');
const { promisify } = require('util');

const search = (item, ctx = '', depth = 0) => {
    if (depth > 3) {
        throw new Error(ctx);
    }

    let candidates = [];
    for (let key in item) {
        const val = item[key];
        const type = typeof(val);
        const ctxk = ctx.length > 0 ? `${ctx}|${key}` : key;
        if (type === 'string') {
            if (/^.*\/.+\..+$/.test(val)) {
                candidates.push(ctxk);
            }
        }
        else if (type !== 'boolean' && type !== 'number') {
            candidates = candidates.concat(search(item[key], ctxk, depth + 1));
        }
    }
    return candidates;
};


exports.getEntryPoints = manifest => {
    const entryPoints = {};
    const results = search(manifest);

    for (let result of results) {
        const spl = result.split('|');
        const targetName = spl[0];
        let fileName = manifest;
        for (let s of spl) {
            fileName = fileName[s];
        }
        fileName = join(process.cwd(), 'src', fileName);
        const ext = extname(fileName);
        if (ext !== '.html' && ext !== '.js') {
            continue;
        }
        if (entryPoints[targetName]) {
            entryPoints[targetName].push(fileName);
        }
        else {
            entryPoints[targetName] = [fileName];
        }
    }

    entryPoints['manifest'] = join(process.cwd(), 'src', 'manifest.json');

    return entryPoints;
};

exports.updateManifest = async(manifest, context) => {
    const results = search(manifest);

    for (let result of results) {
        const spl = result.split('|');
        const targetName = spl[0];
        let fileName = manifest;
        let last = null;
        for (let s of spl) {
            last = fileName;
            fileName = fileName[s];
        }
        fileName = join(process.cwd(), 'src', fileName);
        const ext = extname(fileName);
        switch(ext) {
            case '.js':
                last[spl[spl.length - 1]] = targetName + ext;
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
