import { execFileSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import { join } from 'node:path'

const outDir = '.tmp-tests'

rmSync(outDir, { recursive: true, force: true })

try {
  execFileSync(
    process.execPath,
    [
      join('node_modules', 'typescript', 'bin', 'tsc'),
      '--target', 'ES2022',
      '--module', 'NodeNext',
      '--moduleResolution', 'NodeNext',
      '--lib', 'ES2022,DOM',
      '--skipLibCheck',
      '--strict',
      '--outDir', outDir,
      'tests/favicon.test.ts',
      'tests/sanitizeHtml.test.ts',
      'tests/uploadOptimizer.test.ts',
      'tests/i18n.test.ts',
      'tests/cache.test.ts',
      'tests/contentLocalization.test.ts',
      'tests/contentBackfill.test.ts',
      'tests/portfolio.test.ts',
      'tests/portfolioFallback.test.ts',
      'tests/theme.test.ts',
      'tests/supabaseConfig.test.ts',
      'src/utils/sanitizeHtml.ts',
      'src/utils/uploadOptimizer.ts',
      'src/utils/i18n.ts',
      'src/utils/cache.ts',
      'src/utils/contentLocalization.ts',
      'src/data/contentBackfill.ts',
      'src/utils/portfolio.ts',
      'src/data/portfolioSeed.ts',
      'src/utils/theme.ts',
      'src/utils/supabaseConfig.ts',
    ],
    { stdio: 'inherit' },
  )

  execFileSync('node', ['--test', `${outDir}/tests/*.test.js`], { stdio: 'inherit' })
} finally {
  rmSync(outDir, { recursive: true, force: true })
}
