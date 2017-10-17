import babel from 'rollup-plugin-babel'
import sass from 'node-sass'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import autoprefixer from 'autoprefixer'

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  external: [
    'react',
    'react-dom',
    'prop-types',
    'lodash',
    'classnames'
  ],
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      preprocessor: (content, id) => new Promise((resolve, reject) => {
        const result = sass.renderSync({
          file: id
        })
        resolve({ code: result.css.toString() })
      }),
      plugins: [
        autoprefixer
      ],
      extensions: ['.scss']
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  context: 'window'
}
