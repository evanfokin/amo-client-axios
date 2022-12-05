import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AmoClientAxios } from './amo-client-axios';
import { AdditionalConfig } from './interfaces/additional-config';
declare function create(clientId: string, config?: AxiosRequestConfig & AdditionalConfig): AxiosInstance;
export { create, AmoClientAxios };
export default create;
//# sourceMappingURL=index.d.ts.map