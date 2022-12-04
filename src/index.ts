import { AmoClientAxios } from './amo-client-axios'
import { AdditionalConfig } from './interfaces/additional-config'
import { AxiosInstance, AxiosRequestConfig } from 'axios'

function create(clientId: string, config?: AxiosRequestConfig & AdditionalConfig): AxiosInstance {
  const instance = new AmoClientAxios(clientId, config)
  return instance.create()
}

export { create, AmoClientAxios }
export default create
