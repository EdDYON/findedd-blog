import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'dist/**',
      'external/**',
      'node_modules/**',
      'public/**',
      '.valaxy/**',
    ],
  },
  ...nextVitals,
  ...nextTypescript,
]

export default eslintConfig
