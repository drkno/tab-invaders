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

module.exports = search;
