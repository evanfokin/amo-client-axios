import Bottleneck from 'bottleneck'

export interface AdditionalConfig {
  headerName?: string
  limiterOptions?: Bottleneck.ConstructorOptions
  onGetNewToken?: (token: string) => any | Promise<any>
}
