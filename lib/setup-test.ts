require('ts-node/register');
const { toMatchDiffSnapshot } = require('snapshot-diff');

expect.extend({ toMatchDiffSnapshot });
