'use strict';

module.exports = {
  plugins: [
    ['../../../../lib/index.js', {
      root: 'some-path',
    }],
  ],
  'throws': 'Expected the "svgName" prop to be a string',
};
