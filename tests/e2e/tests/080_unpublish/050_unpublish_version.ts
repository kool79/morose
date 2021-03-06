import { npmPublish, npmLogin, execSilent } from '../../utils/process';
import { createPackageJson } from '../../utils/utils';
import * as fs from '../../utils/fs';

export default function() {
  let authPath = 'morose/auth.json';

  return Promise.resolve()
    .then(() => createPackageJson('package.json', '@bleenco/test-package', '0.0.1'))
    .then(() => npmLogin('admin', 'blabla', 'foo@bar.com'))
    .then(() => npmPublish())
    .then(() => createPackageJson('package.json', '@bleenco/test-package', '0.0.2'))
    .then(() => npmPublish())
    .then(() => createPackageJson('package.json', '@bleenco/test-package', '0.0.3'))
    .then(() => npmPublish())
    .then(() => execSilent(
      'npm', ['-q', 'unpublish', '@bleenco/test-package@0.0.2']))
    .then(() => fs.readJsonFile(authPath))
    .then(authObject => {
      let pkg = authObject.packages.find(p => p.name === '@bleenco/test-package');
      if (pkg && pkg.versions.length === 2) {
        return Promise.resolve();
      }
      return Promise.reject('');
    })
    .catch(() => Promise.reject(''));
}
