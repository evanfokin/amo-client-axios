import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AdditionalConfig } from './interfaces/additional-config';
export declare class AmoClientAxios {
    clientId: string;
    config: AxiosRequestConfig & AdditionalConfig;
    constructor(clientId: string, config?: AxiosRequestConfig & AdditionalConfig);
    accessToken: string;
    private get axiosConfig();
    private get additionalConfig();
    private get tokenUrl();
    private get headerName();
    private isTokenURL;
    private get limiterOptions();
    private get limiter();
    create(): AxiosInstance;
    private prepareConfig;
    getNewToken(): Promise<string>;
    private static additionalConfigKeys;
    private static bottlenecks;
}
//# sourceMappingURL=amo-client-axios.d.ts.map