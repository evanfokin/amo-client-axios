"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmoClientAxios = void 0;
const axios_1 = __importDefault(require("axios"));
const omit_1 = __importDefault(require("lodash/omit"));
const pick_1 = __importDefault(require("lodash/pick"));
const bottleneck_1 = __importDefault(require("bottleneck"));
class AmoClientAxios {
    constructor(clientId, config = {}) {
        this.clientId = clientId;
        this.config = config;
    }
    get axiosConfig() {
        return omit_1.default(this.config, AmoClientAxios.additionalConfigKeys);
    }
    get additionalConfig() {
        return pick_1.default(this.config, AmoClientAxios.additionalConfigKeys);
    }
    get tokenUrl() {
        return `/ajax/v2/integrations/${this.clientId}/disposable_token`;
    }
    get headerName() {
        return this.additionalConfig.headerName || 'Authorization';
    }
    isTokenURL(url) {
        return url.includes(this.tokenUrl);
    }
    get limiterOptions() {
        return (this.config.limiterOptions || {
            reservoir: 7,
            reservoirRefreshAmount: 7,
            reservoirRefreshInterval: 1000,
            maxConcurrent: 5,
            minTime: 300
        });
    }
    get limiter() {
        if (!AmoClientAxios.bottlenecks[this.clientId]) {
            AmoClientAxios.bottlenecks[this.clientId] = new bottleneck_1.default(this.limiterOptions);
        }
        return AmoClientAxios.bottlenecks[this.clientId];
    }
    create() {
        const instance = axios_1.default.create(this.axiosConfig);
        instance.interceptors.request.use(async (config) => {
            if (!this.accessToken) {
                await this.getNewToken();
            }
            if (!this.isTokenURL(config.url)) {
                this.prepareConfig(config);
            }
            return this.limiter.schedule(async () => config);
        }, error => Promise.reject(error));
        instance.interceptors.response.use(response => response, async (error) => {
            const status = error && error.response ? error.response.status : null;
            if (status === 401 && !this.isTokenURL(error.config.url) && !error.config.afterRenew) {
                try {
                    await this.getNewToken();
                    this.prepareConfig(error.config);
                    return instance.request(Object.assign(Object.assign({}, error.config), { afterRenew: true }));
                }
                catch (e) {
                    return Promise.reject(error);
                }
            }
            return Promise.reject(error);
        });
        return instance;
    }
    prepareConfig(config) {
        config.headers[this.headerName] = `Bearer ${this.accessToken}`;
        return config;
    }
    async getNewToken() {
        const { data: { token } } = await axios_1.default.get(this.tokenUrl, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        this.accessToken = token;
        if (this.additionalConfig.onGetNewToken) {
            try {
                this.additionalConfig.onGetNewToken(this.accessToken);
            }
            catch (e) { }
        }
        return this.accessToken;
    }
}
exports.AmoClientAxios = AmoClientAxios;
AmoClientAxios.additionalConfigKeys = ['headerName', 'limiterOptions', 'onGetNewToken'];
AmoClientAxios.bottlenecks = {};
//# sourceMappingURL=amo-client-axios.js.map