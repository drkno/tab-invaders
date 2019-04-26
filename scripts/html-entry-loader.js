const { JSDOM } = require('jsdom');
const { join } = require('path');
const { promisify } = require('util');
const { getReverseLookupMap } = require('./entry-point-locator');

const loader = async(ctx, content) => {
    const reverseLookup = getReverseLookupMap();
    const dom = new JSDOM(content);
    Array.from(dom.window.document.querySelectorAll('script'))
        .filter(s => s.src && !s.src.startsWith('http') && !s.src.startsWith('//'))
        .forEach(s => {
            const fileName = join(ctx.context, s.src);
            if (reverseLookup[fileName]) {
                s.src = reverseLookup[fileName] + '.js';
            }
        });
    return dom.serialize();
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
