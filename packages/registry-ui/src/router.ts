// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/app`
  | `/app/debugger`
  | `/app/login-failed`
  | `/app/request-op`
  | `/app/request-op/credential`
  | `/app/request-op/holder`
  | `/app/request-op/logo`
  | `/app/request-op/notifications`
  | `/app/request-op/public-key`
  | `/app/request-op/welcome`

export type Params = {
  
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
