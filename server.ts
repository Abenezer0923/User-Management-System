import cluster from 'cluster';
import os from 'os';

const num_cpu = os.cpus().length;
if (cluster.isPrimary){
    for(let i=0; i < num_cpu; i++){
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log('worker ' + worker.process.pid + ' died');
    });

}else {
    require('./apps.ts')
}