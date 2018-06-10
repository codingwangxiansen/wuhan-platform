// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  'globals': {
    'document': true,
    // 天地图全局变量
    'T': true,
    'TDT_STATUS_SUCCESS': true,
    'wx': true,
    'WeixinJSBridge':true
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['off', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    'import/no-unresolved': [0, {commonjs: true, amd: true}],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 字面量对象最后一项属性不要逗号
    "comma-dangle": [2, "never"],
    // 语句不需要分号结尾
    "semi": [2, "never"],
    // 如果函数参数是个对象，允许对对象属性值进行修改
    "no-param-reassign": ["error", { "props": false }],
    // 只对部分语法禁用
    "no-restricted-syntax": ["error", "WithStatement", "BinaryExpression[operator='in']"],
    // 允许使用嵌套三元表达式 不建议使用
    "no-nested-ternary": 0,
    // 暂时不要求必须全局使用require
    "global-require": 0,
    // 启用一元操作符
    "no-plusplus": 0,
    // 允许使用console和alert不出现警告
    "no-alert": 0,
    "no-console": 0,
    // 允许使用未命名的函数  不出现警告
    "func-names": 0
  }
}
