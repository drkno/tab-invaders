const { join, extname, parse, dirname } = require('path');
const search = require('./manifest-utils');
const { JSDOM } = require('jsdom');
const { promisify } = require('util');
const glob = require('glob');
const { readFileSync } = require('fs');
const crypto = require('crypto');

let cachedEntryPoints = null;

const getEntryPoints = sourcesRoot => {
    if (cachedEntryPoints) {
        return cachedEntryPoints;
    }

    sourcesRoot = join(process.cwd(), sourcesRoot);
    const manifest = require(join(sourcesRoot, 'manifest.json'));

    const entryPoints = {};
    const results = search(manifest);

    for (let result of results) {
        const spl = result.split('|');
        const targetName = spl[0];
        let fileName = manifest;
        for (let s of spl) {
            fileName = fileName[s];
        }
        fileName = join(sourcesRoot, fileName);
        const ext = extname(fileName);
        if (ext !== '.html' && ext !== '.js') {
            continue;
        }
        if (entryPoints[targetName]) {
            entryPoints[targetName].push(fileName);
        }
        else {
            entryPoints[parse(fileName).name] = [fileName];
        }
    }

    entryPoints['manifest'] = [join(sourcesRoot, 'manifest.json')];

    const files = glob.sync(join(sourcesRoot, '**', '*.html'));
    for (let file of files) {
        let chunkName = parse(file).name;
        if (entryPoints[chunkName]) {
            if (entryPoints[chunkName].length !== 1 && !entryPoints[chunkName][0].endsWith('.html')) {
                chunkName += crypto.randomBytes(16).toString('hex');
                entryPoints[chunkName] = [];
            }
        }
        else {
            entryPoints[chunkName] = [];
        }

        const fileContents = readFileSync(file, 'utf8');
        const dom = new JSDOM(fileContents);
        Array.prototype.push.apply(entryPoints[chunkName], Array.from(dom.window.document.querySelectorAll('script'))
            .filter(s => s.src && !s.src.startsWith('http') && !s.src.startsWith('//'))
            .map(s => {
                s.parentNode.removeChild(s);
                return join(dirname(file), s.src);
            }));
    }

    cachedEntryPoints = entryPoints;
    return entryPoints;
};

const getReverseLookupMap = sourcesRoot => {
    const entryPoints = getEntryPoints();
    const reverseLookup = {};
    Object.keys(entryPoints).forEach(e => {
        for (let entryPoint of entryPoints[e]) {
            reverseLookup[entryPoint] = e;
        }
    });
    return reverseLookup;
};

module.exports = getEntryPoints;
module.exports.getReverseLookupMap = getReverseLookupMap;
