import { apiClient } from '#shared/api'

export const SETTINGS_PROFILE_API_PATH = '/settings/profile'

export async function patchProfile(body: { displayName: string; email: string }) {
	return apiClient.patch(SETTINGS_PROFILE_API_PATH, { body })
}
