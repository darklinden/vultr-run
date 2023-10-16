import * as VultrNode from '@vultr/vultr-node';
import { config as dotenv_config } from 'dotenv';
import { change_dns } from './dns';

async function find_one_instance(vultr: any) {

    console.log('----------------------------------------');
    console.log('Find One Instance ...');
    console.log('----------------------------------------');

    const instances = await vultr.instances.listInstances({
        per_page: '100',
        cursor: '0',
        label: process.env.VULTR_SERVER_LABEL,
        region: process.env.VULTR_REGION_ID,
    });

    let instance_id = '';
    const list: any[] = instances.instances;
    if (list.length > 0) {
        const ins = list[0];
        instance_id = ins.id;
    }

    console.log('Found instance:', instance_id);

    return instance_id;
}

async function create_one_instance(vultr: any) {

    console.log('----------------------------------------');
    console.log('Create One Instance ...');
    console.log('----------------------------------------');

    const result = await vultr.instances.createInstance({
        region: process.env.VULTR_REGION_ID,
        plan: process.env.VULTR_PLAN_ID,
        sshkey_id: process.env.VULTR_SSH_KEY_ID.split(','),
        os_id: process.env.VULTR_OS_ID,
        label: process.env.VULTR_SERVER_LABEL,
    });

    if (!(result.instance && result.instance.id)) {
        throw new Error('Instance creation failed.');
    }

    console.log(`Instance ${result.instance.id} created`);

    return result.instance.id;
}

async function wait_ipv4(vultr: any, instance_id: string) {

    console.log(`Instance ${instance_id} , waiting for ipv4 ...`);

    let ipv4 = '';
    while (true) {

        // sleep 10 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));

        const result = await vultr.instances.getInstance({
            'instance-id': instance_id
        });

        if (!result.instance) continue;
        if (result.instance.status !== 'active') continue;
        if (!result.instance.main_ip) continue;
        if (result.instance.main_ip === '0.0.0.0') continue;

        ipv4 = result.instance.main_ip;
        break;
    }

    return ipv4;
}

async function main() {

    dotenv_config();

    // Initialize the instance with your configuration
    const vultr = VultrNode.initialize({
        apiKey: process.env.VULTR_API_KEY,
    })

    // Find First Or Create a new instance
    let instance_id = await find_one_instance(vultr);

    if (instance_id === '') {
        instance_id = await create_one_instance(vultr);
    }

    let ipv4 = await wait_ipv4(vultr, instance_id);

    // Create a new DNS record
    await change_dns(ipv4);

    console.log('----------------------------------------');
    console.log('Host:', ipv4);
    console.log('----------------------------------------');
    console.log('Done.');
}

main();

