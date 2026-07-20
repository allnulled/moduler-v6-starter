#!/usr/bin/env node

require(`${__dirname}/../dist/src/lib/dev-binary-v6.dist.js`);

module.exports = DevBinaryV6.create(`${__dirname}/..`);