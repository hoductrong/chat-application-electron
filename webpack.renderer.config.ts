import type { Configuration } from 'webpack';
import path from 'path';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push(
  ...[
    {
      test: /\.s?(c|a)ss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
            sourceMap: true,
            importLoaders: 1,
          },
        },
        'sass-loader',
      ],
      include: /\.module\.s?(c|a)ss$/,
    },
    {
      test: /\.s?css$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      exclude: /\.module\.s?(c|a)ss$/,
    },
    // {
    //   test: /\.s[ac]ss$/i,
    //   use: [
    //     // Creates `style` nodes from JS strings
    //     'style-loader',
    //     // Translates CSS into CommonJS
    //     'css-loader',
    //     // Compiles Sass to CSS
    //     'sass-loader',
    //   ],
    // },
  ],
);

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
