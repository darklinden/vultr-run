import Client, * as $Alidns20150109 from '@alicloud/alidns20150109';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import * as $tea from '@alicloud/tea-typescript';

/**
 * 使用AK&SK初始化账号Client
 * @param accessKeyId
 * @param accessKeySecret
 * @return Client
 * @throws Exception
 */
function createClient(accessKeyId: string, accessKeySecret: string): Client {
    let config = new $OpenApi.Config({
        // 必填，您的 AccessKey ID
        accessKeyId: accessKeyId,
        // 必填，您的 AccessKey Secret
        accessKeySecret: accessKeySecret,
    });
    // Endpoint 请参考 https://api.aliyun.com/product/Alidns
    config.endpoint = `alidns.cn-hangzhou.aliyuncs.com`;
    return new Client(config);
}

export async function change_dns(ip: string) {

    console.log('----------------------------------------');
    console.log(`Changing DNS ${ip} ...`);
    console.log('----------------------------------------');

    // 请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID 和 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
    // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例使用环境变量获取 AccessKey 的方式进行调用，仅供参考，建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html
    let client = createClient(process.env['ALIBABA_CLOUD_ACCESS_KEY_ID'], process.env['ALIBABA_CLOUD_ACCESS_KEY_SECRET']);
    let addCustomLineRequest = new $Alidns20150109.UpdateDomainRecordRequest({
        recordId: process.env['ALI_DNS_RECORD_ID'],
        RR: process.env['ALI_DNS_DOMAIN_RR'],
        type: 'A',
        value: ip,
    });

    try {
        // 复制代码运行请自行打印 API 的返回值
        const result = await client.updateDomainRecord(addCustomLineRequest);
        // console.log(result);
    } catch (error) {
        // 如有需要，请打印 error
        Util.assertAsString(error['message']);
    }
}