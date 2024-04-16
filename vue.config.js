const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
const {
  CKEditorTranslationsPlugin,
} = require('@ckeditor/ckeditor5-dev-translations');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
const path = require('path');

module.exports = defineConfig({
  pages: {
    index: {
      entry: './src/index.ts',
      title: 'Sở du lịch CMS',
    },
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        cacheGroups: {
          defaultVendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'async',
            reuseExistingChunk: true,
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'async',
            reuseExistingChunk: true,
          },
        },
      },
    },
    plugins: [
      // CKEditor&nbsp;5 needs its own plugin to be built using webpack.
      new CKEditorTranslationsPlugin({
        // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
        language: 'en',
      }),
    ],
  },
  transpileDependencies: [/ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/],

  // Vue CLI would normally use its own loader to load .svg and .css files, however:
  chainWebpack: (config) => {
    // (1.) To handle the editor icons, get the default rule for *.svg files first:
    const svgRule = config.module.rule('svg');

    // Then you can either:
    //
    // * clear all loaders for existing 'svg' rule:
    //
    //
    // * or exclude ckeditor directory from node_modules:
    svgRule.exclude.add(path.join(__dirname, 'node_modules', '@ckeditor'));

    // Add an entry for *.svg files belonging to CKEditor. You can either:
    //
    // * modify the existing 'svg' rule:
    //
    //
    // * or add a new one:
    config.module
      .rule('cke-svg')
      .test(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
      .use('raw-loader')
      .loader('raw-loader');

    // (2.) Transpile the .css files imported by the editor using PostCSS.
    // Make sure only the CSS belonging to ckeditor5-* packages is processed this way.
    config.module
      .rule('cke-css')
      .test(/ckeditor5-[^/\\]+[/\\].+\.css$/)
      .use('postcss-loader')
      .loader('postcss-loader')
      .tap(() => ({
        postcssOptions: styles.getPostCssConfig({
          themeImporter: {
            themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
          },
          minify: true,
        }),
      }));
  },
});
