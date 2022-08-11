import { defineConfig } from 'umi';

export default defineConfig({
  plugins: [require.resolve('../lib')],
  // mainPath: '/home',
  theme_generate: {
    colorMode: 'dark',
    customIn: 'src/in.less',
    customOut: 'src/out.css',
  },
});
