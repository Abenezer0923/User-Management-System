"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const num_cpu = os_1.default.cpus().length;
if (cluster_1.default.isPrimary) {
    for (let i = 0; i < num_cpu; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', (worker, code, signal) => {
        console.log('worker ' + worker.process.pid + ' died');
    });
}
else {
    require('./apps'); // No need to add .js extension
}
