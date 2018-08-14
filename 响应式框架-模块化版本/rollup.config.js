import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: './mvue/mvue.js',
  output: {
    file: './dist/mvue.js',
    format: 'umd',
    name: 'MVue'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    })
  ]
};