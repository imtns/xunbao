module.exports = {
  root: true,
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss', 'stylelint-config-recommended-vue', 'stylelint-config-rational-order', 'stylelint-config-prettier'],
  plugins: ['stylelint-order', 'stylelint-scss'],
  // https://stylelint.docschina.org/user-guide/rules/
  rules: {
    'selector-id-pattern': null,
    'property-no-unknown': null,
    indentation: [2, { severity: 'warning' }],
    'number-leading-zero': null,
    'declaration-colon-space-after': 'always-single-line',
    'declaration-block-no-redundant-longhand-properties': null,
    'no-descending-specificity': null,
    'no-empty-source': null,
    'no-duplicate-selectors': null,
    'selector-type-no-unknown': null,
    'comment-empty-line-before': null,
    'rule-empty-line-before': null,
    'color-function-notation': null,
    'value-no-vendor-prefix': null,
    'selector-descendant-combinator-no-non-space': null,
    // 允许嵌套的深度最多 10 层
    'max-nesting-depth': 10,
    // 防止::deep报错
    'selector-pseudo-element-no-unknown': null,
    // 防止类似@mixin报错
    'at-rule-no-unknown': null,
    // 支持rpx
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    // 支持import引入scss
    'scss/at-import-partial-extension': ['always', { except: ['scss'] }],
    'scss/double-slash-comment-empty-line-before': null,
    'selector-class-pattern': null,
    'font-family-no-missing-generic-family-keyword': null
  }
}
