'use strict';

const execSync = require('child_process').execSync;
const co = require('co');
const RE_COMMITTED = /^\s?([ACDMRU]+)\s+(.*)?/;

module.exports = co.wrap(function*(cwd) {
  cwd = cwd || process.cwd();
  try {
    let cmdRst = execSync('git status --porcelain', {
      cwd: cwd,
      stdio: 'pipe'
    }).toString();
    let fileList = cmdRst.split('\n')
      .map(line => {
        let matchRst = line.trim().match(RE_COMMITTED);
        if (!matchRst) return null;
        let file = matchRst[2].split('->').map(v => v.trim());
        let rst = {
          mode: matchRst[1],
          file: file[0]
        };
        if (file[1]) rst.dist = file[1];
        return rst;
      })
      .filter(v => !!v);
    return {
      success: fileList.length === 0,
      detail: fileList
    };
  } catch (e) {
    if (e.message.indexOf('Not a git repository') !== -1)
      return Promise.reject(new Error(`No git repository was found in ${cwd}`));
    return Promise.reject(e);
  }
});
