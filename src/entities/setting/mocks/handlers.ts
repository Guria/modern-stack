import { HttpResponse, delay, http } from 'msw'

import { composeApiUrl } from '#shared/api'

import { SETTINGS_PROFILE_API_PATH } from '../api/settingsApi'

export const settingHandlers = [
	http.patch(composeApiUrl(SETTINGS_PROFILE_API_PATH), async () => {
		await delay()

		return HttpResponse.json({ ok: true })
	}),
]
