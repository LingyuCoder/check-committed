'use strict';

require('should');
const checker = require('../index');
const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('check-committed', () => {
  afterEach(() => execSync('git reset --hard HEAD'));
  it('should resolve object with success false if found uncommitted changes', () => {
    fs.writeFileSync(path.join(__dirname, 'change'), 'test', 'utf-8');
    return checker().should.be.fulfilledWith({
      success: false,
      detail: ` M test/change\n`
    });
  });
  it('should resolve object with success true no uncommitted changes', () => {
    return checker(process.cwd()).should.be.fulfilledWith({
      success: true,
      detail: ''
    });
  });
  it('should reject when error', () => {
    return checker(os.tmpdir()).should.be.rejectedWith(Error);
  });
});
