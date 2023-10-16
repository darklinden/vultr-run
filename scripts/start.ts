import * as path from 'path';
import * as VultrNode from '@vultr/vultr-node';
import { config as dotenv_config } from 'dotenv';
import { spawn as process_exec } from 'child_process';

async function exec(command: string, args: string[], cwd: string) {
    return new Promise((resolve, reject) => {

        const sp = process_exec(command, args, { cwd: cwd });

        sp.stdout.on('data', function (data) {
            console.log(data.toString());
        });

        sp.stderr.on('data', function (data) {
            console.log('err: ', data.toString());
        });

        sp.on('exit', function (code) {
            if (code == 0) {
                resolve('ok');
            }
            else {
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    })
}


async function find_one_instance_ip(vultr: any) {

    console.log('----------------------------------------');
    console.log('Find One Instance ...');
    console.log('----------------------------------------');

    const instances = await vultr.instances.listInstances({
        per_page: '100',
        cursor: '0',
        tag: '',
        label: '',
        main_ip: '',
        region: ''
    });

    let ipv4 = '';
    const list: any[] = instances.instances;
    if (list.length > 0) {
        const ins = list[0];
        ipv4 = ins.main_ip;
    }

    console.log('Found instance:', ipv4);

    return ipv4;
}

async function main() {

    dotenv_config();

    console.log('----------------------------------------');
    console.log('Starting Instance ...');
    console.log('----------------------------------------');

    // Initialize the instance with your configuration
    const vultr = VultrNode.initialize({
        apiKey: process.env.VULTR_API_KEY,
    })

    const ipv4 = await find_one_instance_ip(vultr);

    const project_root = path.resolve(__dirname, '..');

    await exec(`sh`, [
        'start.sh', ipv4
    ], project_root);

    console.log('----------------------------------------');

    console.log('Done.');
}

main();

