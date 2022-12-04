"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmoClientAxios = exports.create = void 0;
const amo_client_axios_1 = require("./amo-client-axios");
Object.defineProperty(exports, "AmoClientAxios", { enumerable: true, get: function () { return amo_client_axios_1.AmoClientAxios; } });
function create(clientId, config) {
    const instance = new amo_client_axios_1.AmoClientAxios(clientId, config);
    return instance.create();
}
exports.create = create;
exports.default = create;
//# sourceMappingURL=index.js.map