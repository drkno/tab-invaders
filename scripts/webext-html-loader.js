const { join } = require('path');
const { promisify } = require('util');

const tagsRegex = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g;

const main = async(ctx, content, callback) => {
    try {
        let match = null;
        while (match = tagsRegex.exec(content)) {
            const attr = match[1];
            const val = match[1];

            if (val.startsWith('http')) {
                continue;
            }

            const index = match.index;
            let lastSpace = index;
            let tag = null;
            for (let i = index - 1; i >= 0; i--) {
                if (/\s/.test(content[i])) {
                    lastSpace = i;
                }
                if (content[i] === '<') {
                    tag = content.substring(i + 1, lastSpace);
                    break;
                }
            }
            if (tag === null) {
                throw new Error('Could not get tag name');
            }

            if (tag === 'script' && attr === 'src') {
                const mod = await promisify(context.loadModule)(val);
                throw new Error(mod);
            }
        }
        callback(null, content);
    }
    catch(e) {
        callback(e, null);
    }
};

module.exports = function(content) {
    const callback = this.async();
    main(this, content, callback);
};

