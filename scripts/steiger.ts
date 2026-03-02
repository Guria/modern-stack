#!/usr/bin/env bun

import { join } from 'node:path'

import { $ } from 'bun'

const steigerDir = join(import.meta.dir, 'steiger')

await $`bun i`.cwd(steigerDir)
await $`bunx steiger ./../../src`.cwd(steigerDir)
