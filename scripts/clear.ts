import * as path from 'path';
import * as readline from 'readline';
import * as VultrNode from '@vultr/vultr-node';
import { config as dotenv_config } from 'dotenv';

async function main() {

    dotenv_config();

    console.log('----------------------------------------');
    console.log('Clear Instances ...');
    console.log('----------------------------------------');

    // Initialize the instance with your configuration
    const vultr = VultrNode.initialize({
        apiKey: process.env.VULTR_API_KEY,
    })

    const instances = await vultr.instances.listInstances({
        per_page: '100',
        cursor: '0',
        tag: '',
        label: '',
        main_ip: '',
        region: ''
    });

    console.log('instances:', instances);

    const list: any[] = instances.instances;
    for (const instance of list) {
        console.log('instance:', instance.label, instance.main_ip);

        const ask = await ask_question('Delete? (y/n) ');
        if (ask === 'y') {
            await vultr.instances.deleteInstance({
                'instance-id': instance.id,
            });
        }
    }

    console.log('Done.');
}

main();


async function ask_question(query: string): Promise<string> {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

