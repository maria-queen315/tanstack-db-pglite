import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  rules: {
    'ts/no-explicit-any': 'error',
  },
  ignores: [
    '**/dist/**/*',
  ],
})
