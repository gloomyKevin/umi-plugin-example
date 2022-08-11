// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';
import fs from 'fs';
import less from 'less';
import watch from 'node-watch';

let theme = 'default';

const toogleColor = function(cmode: string) {
  switch (cmode) {
    case 'light':
    case 'default':
      theme = 'default';
    case 'dark':
      theme = 'dark';
    default:
      console.log('this kind of colorMode is not allowed');
  }
};

export default function(api: IApi) {
  // env环境判断

  // if (!api.hasPlugins(['...'])) {
  //   api.logger.log(
  //     `plugin ... is required for ... .`,
  //   );
  //   return;
  // }
  api.describe({
    key: 'theme_generate',
    config: {
      schema(joi) {
        return joi.object();
      },
      // onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
    // enableBy: api.EnableBy.config,
  });
  const { colorMode = '', customIn = '', customOut = '', customAntd = '' } =
    api.userConfig?.theme_generate || {};

  const DEFAULTS = {
    in: './custom-theme.less',
    out: './custom-theme.css',
    antd: './node_modules/antd',
    theme: 'default',
  };

  theme = colorMode || DEFAULTS.theme;
  const inFilePath = customIn || DEFAULTS.in;
  const outFilePath = customOut || DEFAULTS.out;
  const antdLibPath = customAntd || DEFAULTS.antd;

  const imports = [
    `@import url('${antdLibPath}/lib/style/themes/${theme}.less');`,
    `@import url('${antdLibPath}/dist/antd.less');`,
    `@import url('${inFilePath}');`,
  ].join('');

  const compile = () => {
    console.log('Generating theme...');
    less.render(imports, { javascriptEnabled: true }).then(
      ({ css }) => {
        try {
          fs.writeFileSync(outFilePath, css);
          console.log(
            `AntDesign theme (${outFilePath}) successfully generated.`,
          );
        } catch (e) {
          console.error(`Could not write into file (${outFilePath}):`, e);
        }
      },
      error => console.error(error),
    );
  };

  compile();
  // if(shouldWatch){
  const watcher = watch(inFilePath, () => {
    console.log(`Watcher:: ${inFilePath} changed, recompiling.`);
    compile();
  });
  const closeWatcher = () => {
    console.log('Watcher:: Removing watcher...');
    watcher.close();
  };
  process.on('SIGTERM', closeWatcher);
  process.on('SIGINT', closeWatcher);
  process.on('SIGQUIT', closeWatcher);
  // };
}
