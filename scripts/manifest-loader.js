const { join } = require('path');
const { updateManifest } = require('./manifest-manipulator.js');

const main = async(ctx, content, callback) => {
    try {
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
        callback(null, '{}');
    }
    catch(e) {
        callback(e, null);
    }
};

module.exports = function(content) {
    const callback = this.async();
    main(this, content, callback);
};
