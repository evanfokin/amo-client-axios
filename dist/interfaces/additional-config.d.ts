import Bottleneck from 'bottleneck';
export interface AdditionalConfig {
    headerName?: string;
    limiterOptions?: Bottleneck.ConstructorOptions;
    onGetNewToken?: (token: string) => any | Promise<any>;
}
//# sourceMappingURL=additional-config.d.ts.map