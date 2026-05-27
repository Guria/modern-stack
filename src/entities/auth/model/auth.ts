import type { AuthSession, LoginCredentials } from './types'

import { action, atom, computed, wrap, withAsync, withLocalStorage } from '@reatom/core'

import { login, logout } from '#entities/auth/api/authApi'

export const authSessionAtom = atom<AuthSession | null>(null, 'authSession').extend(
	withLocalStorage('modern-stack.authSession'),
)

export const isAuthenticatedAtom = computed(() => authSessionAtom() !== null, 'isAuthenticated')

export const loginAction = action(async (credentials: LoginCredentials) => {
	authSessionAtom.set(await wrap(login(credentials)))
}, 'loginAction').extend(withAsync())

export const logoutAction = action(() => {
	authSessionAtom.set(null)
	wrap(logout())
}, 'logoutAction')

export const setAuthenticatedForTest = action((session: AuthSession | null) => {
	authSessionAtom.set(session)
}, 'setAuthenticatedForTest')
