import { ark } from '@ark-ui/react/factory'

import type { ComponentProps } from '#styled-system/types'

import { styled } from '#styled-system/jsx'
import { kbd } from '#styled-system/recipes'

export type KbdProps = ComponentProps<typeof Kbd>
export const Kbd = styled(ark.kbd, kbd)
