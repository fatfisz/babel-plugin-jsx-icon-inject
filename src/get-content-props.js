import { readFileSync } from 'fs';

import getJSXFromContents from './get-jsx-from-contents';
import unwrap from './unwrap';


function getSource(path, pathToSvg) {
  try {
    return readFileSync(pathToSvg, 'utf8');
  } catch (err) {
    throw path.buildCodeFrameError(`File not found: ${pathToSvg}`);
  }
}

function getPropsFromSource(path, pathToSvg, { opts, types }) {
  const contents = getSource(path, pathToSvg);
  const jsx = getJSXFromContents(contents, types);

  if (!opts.unwrap) {
    return { init: jsx };
  }

  if (!jsx) {
    throw path.buildCodeFrameError(`File could not be unwrapped: ${pathToSvg}`);
  }

  try {
    return unwrap(jsx, types);
  } catch (error) {
    throw path.buildCodeFrameError(`File could not be unwrapped: ${pathToSvg}`);
  }
}

export default function getContentProps(path, state, pathToSvg, contentsId) {
  const { opts, types } = state;
  const { init, props = [] } = getPropsFromSource(path, pathToSvg, state);
  const topLevelStatement = path.find((path) => path.parentPath.isProgram());

  topLevelStatement.insertBefore(
    types.variableDeclaration(
      'var',
      [types.variableDeclarator(contentsId, init)],
    ),
  );

  return props;
}
