import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import Bottleneck from 'bottleneck'
import _omit from 'lodash/omit'
import _pick from 'lodash/pick'
import { AdditionalConfig } from './interfaces/additional-config'

export class AmoClientAxios {
  constructor(public clientId: string, public config: AxiosRequestConfig & AdditionalConfig = {}) {}

  public accessToken: string

  private get axiosConfig(): AxiosRequestConfig {
    return _omit(this.config, AmoClientAxios.additionalConfigKeys)
  }

  private get additionalConfig(): AdditionalConfig {
    return _pick(this.config, AmoClientAxios.additionalConfigKeys)
  }

  private get tokenUrl(): string {
    return `/ajax/v2/integrations/${this.clientId}/disposable_token`
  }

  private get headerName(): string {
    return this.additionalConfig.headerName || 'Authorization'
  }

  private isTokenURL(url: string): boolean {
    return url.includes(this.tokenUrl)
  }

  private get limiterOptions(): Bottleneck.ConstructorOptions {
    return (
      this.config.limiterOptions || {
        reservoir: 7,
        reservoirRefreshAmount: 7, // 7 запросов
        reservoirRefreshInterval: 1000, // 1 секунда
        maxConcurrent: 5,
        minTime: 300
      }
    )
  }

  private get limiter(): Bottleneck {
    if (!AmoClientAxios.bottlenecks[this.clientId]) {
      AmoClientAxios.bottlenecks[this.clientId] = new Bottleneck(this.limiterOptions)
    }

    return AmoClientAxios.bottlenecks[this.clientId]
  }

  public create(): AxiosInstance {
    const instance = axios.create(this.axiosConfig)

    instance.interceptors.request.use(
      async config => {
        if (!this.accessToken) {
          await this.getNewToken()
        }
        if (!this.isTokenURL(config.url)) {
          this.prepareConfig(config)
        }
        return this.limiter.schedule(async () => config)
      },
      error => Promise.reject(error)
    )

    instance.interceptors.response.use(
      response => response,
      async error => {
        const status = error && error.response ? error.response.status : null
        if (status === 401 && !this.isTokenURL(error.config.url) && !error.config.afterRenew) {
          try {
            await this.getNewToken()
            this.prepareConfig(error.config)
            return instance.request({ ...error.config, afterRenew: true })
          } catch (e) {
            return Promise.reject(error)
          }
        }

        return Promise.reject(error)
      }
    )

    return instance
  }

  private prepareConfig(config: AxiosRequestConfig): AxiosRequestConfig {
    config.headers[this.headerName] = `Bearer ${this.accessToken}`
    return config
  }

  public async getNewToken(): Promise<string> {
    const {
      data: { token }
    } = await axios.get(this.tokenUrl, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    this.accessToken = token
    if (this.additionalConfig.onGetNewToken) {
      try {
        this.additionalConfig.onGetNewToken(this.accessToken)
      } catch (e) {}
    }
    return this.accessToken
  }

  private static additionalConfigKeys = ['headerName', 'limiterOptions', 'onGetNewToken']
  private static bottlenecks: Record<string, Bottleneck> = {}
}
