// ################################################# //
// ### REGISTER ALIAS PATHS AFTER BUILT TO JS ###### //
// ################################################# //
import tsConfig from '../tsconfig.paths.json';
import * as tsConfigPaths from 'tsconfig-paths';
tsConfigPaths.register({
  baseUrl: './build',
  paths: tsConfig.compilerOptions.paths,
});
