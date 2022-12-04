import { AmoClientAxios } from './amo-client-axios';
import { AdditionalConfig } from './interfaces/additional-config';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
declare function create(clientId: string, config?: AxiosRequestConfig & AdditionalConfig): AxiosInstance;
export { create, AmoClientAxios };
export default create;
//# sourceMappingURL=index.d.ts.map