# filter-entry-output-plugin

Webpack plugin to filter output files based on the entry points.

## Installation

```bash
yarn add filter-entry-output-plugin -D
```

## Usage

Use the plugin to remove unwanted output files, such as JS stubs that are getting created when abusing webpack as a pure SASS compiler. For example, in the following scenario normally not only a `theme.css` but also a `theme.js` file would get emitted for the `theme` entry point; the plugin can be used to remove those unnecessary webpack bootstrap files from SCSS-only entry points:

```javascript
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FilterEntryOutputPlugin = require('filter-entry-output-plugin')
const path = require('path')

module.exports = {
  entry: {
    main: './src/index.js',
    theme: './src/theme.scss'
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader'
      ]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new FilterEntryOutputPlugin({
      test: /\.scss$/,
      remove: /\.js$/,
    })
  ],
}
```

## Options

* `test` -- The entry files for which the output should get filtered.<br>*Type:* `RegExp`<br>*Default:* `/\.(c|sc|sa)ss$/`
* `remove` -- The output files that should get removed, as specified in the `filename` options of the output and plugin configurations etc.<br>*Type:* `RegExp`<br>*Default:* `/\.js$/`
* `exclude` -- Exclude entry files (overrides `test`).<br>*Type:* `RegExp|boolean`<br>*Default:* `false`
* `keep` -- Output files to keep (overrides `remove`).<br>*Type:* `RegExp|boolean`<br>*Default:* `false`
* `multi` -- Whether multi-main entry points should get filtered too.<br>*Type:* `boolean`<br>*Default:* `false`

## Alternatives

You might also have a look at the (`FilterChunkWebpackPlugin`)[https://github.com/yeojz/filter-chunk-webpack-plugin] for another approach based purely on output file patterns.

## License

MIT @ m3g4p0p
