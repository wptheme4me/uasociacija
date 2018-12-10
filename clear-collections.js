// clear_collections.js
module.exports = collectionNames => {
    return function(files, metalsmith, done) {
        "use strict";
        let meta = metalsmith.metadata();

        for (let collection of collectionNames) {
            if (collection in meta) {
                meta[collection] = [];
            }
        }
        metalsmith.metadata(meta);
        done();
    };
};