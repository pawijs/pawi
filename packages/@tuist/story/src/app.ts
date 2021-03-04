import { IAction } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled from 'styled-components'
import { StoryConfig } from './'

export { Comp, styled }

export type Config = StoryConfig

export type Action<Input, Output = void> = IAction<Config, Input, Output>

export const useOvermind = createHook<Config>()
