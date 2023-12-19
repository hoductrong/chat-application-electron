/* eslint-disable no-console */
import type { Configuration } from 'webpack';
import path from 'path';
import { EnvironmentPlugin } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

const env = process.env.NODE_ENV || 'production';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/main.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    new EnvironmentPlugin({
      NODE_ENV: env,
    }),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};
