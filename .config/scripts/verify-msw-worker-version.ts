import { $ } from 'bun'

type DependencyMap = Record<string, string>

type PackageJson = {
	dependencies?: DependencyMap
	devDependencies?: DependencyMap
	peerDependencies?: DependencyMap
}

const PACKAGE_JSON_PATH = 'package.json'
const WORKER_PATH = 'public/mockServiceWorker.js'
const ENSURE_FLAG = '--ensure'

function getMswVersionRange(pkg: PackageJson): string | null {
	return pkg.devDependencies?.msw ?? pkg.dependencies?.msw ?? pkg.peerDependencies?.msw ?? null
}

function getPinnedSemver(versionRange: string): string {
	const match = versionRange.match(/\d+\.\d+\.\d+(?:-[\w.-]+)?(?:\+[\w.-]+)?/)
	if (!match) {
		throw new Error(`Could not find a pinned semver version in "${versionRange}".`)
	}
	return match[0]
}

async function readPackageJson(): Promise<PackageJson> {
	const file = Bun.file(PACKAGE_JSON_PATH)
	if (!(await file.exists())) {
		throw new Error(`Missing ${PACKAGE_JSON_PATH}.`)
	}
	return (await file.json()) as PackageJson
}

async function readWorkerVersion(): Promise<string> {
	const workerFile = Bun.file(WORKER_PATH)
	if (!(await workerFile.exists())) {
		throw new Error(`Missing ${WORKER_PATH}.`)
	}

	const workerSource = await workerFile.text()
	const match = workerSource.match(/const PACKAGE_VERSION = '([^']+)'/)
	if (!match) {
		throw new Error(`${WORKER_PATH} is missing PACKAGE_VERSION metadata.`)
	}

	return match[1]
}

type VerifyResult =
	| {
			ok: true
			workerVersion: string
			mswVersionRange: string
			pinnedVersion: string
	  }
	| {
			ok: false
			reason: string
			mswVersionRange: string
			pinnedVersion: string
	  }

async function verifyWorkerVersion(): Promise<VerifyResult> {
	const packageJson = await readPackageJson()
	const mswVersionRange = getMswVersionRange(packageJson)
	if (!mswVersionRange) {
		throw new Error('MSW dependency was not found in package.json.')
	}

	const pinnedVersion = getPinnedSemver(mswVersionRange)
	let workerVersion: string

	try {
		workerVersion = await readWorkerVersion()
	} catch (error) {
		const reason = error instanceof Error ? error.message : 'Worker file is missing or invalid.'
		return {
			ok: false,
			reason,
			mswVersionRange,
			pinnedVersion,
		}
	}

	if (!Bun.semver.satisfies(workerVersion, mswVersionRange)) {
		return {
			ok: false,
			reason: `mockServiceWorker.js version ${workerVersion} does not satisfy package.json range "${mswVersionRange}".`,
			mswVersionRange,
			pinnedVersion,
		}
	}

	if (Bun.semver.order(workerVersion, pinnedVersion) !== 0) {
		return {
			ok: false,
			reason: `mockServiceWorker.js is out of date. Expected ${pinnedVersion}, found ${workerVersion}.`,
			mswVersionRange,
			pinnedVersion,
		}
	}

	return {
		ok: true,
		workerVersion,
		mswVersionRange,
		pinnedVersion,
	}
}

async function main() {
	const shouldEnsure = Bun.argv.includes(ENSURE_FLAG)
	const verified = await verifyWorkerVersion()

	if (!verified.ok) {
		if (!shouldEnsure) {
			throw new Error(`${verified.reason} Run "msw init public --save".`)
		}

		console.log(`${verified.reason}`)
		console.log('Regenerating worker with "msw init public --save"...')
		await $`msw init public --save`
		const postInit = await verifyWorkerVersion()
		if (!postInit.ok) {
			throw new Error(`${postInit.reason} Auto-regeneration failed to align worker version.`)
		}
		console.log(`mockServiceWorker.js is aligned with msw@${postInit.workerVersion}.`)
		return
	}

	console.log(`mockServiceWorker.js is aligned with msw@${verified.workerVersion}.`)
}

await main()
