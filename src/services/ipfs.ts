// import { CID, create, IPFSHTTPClient } from 'ipfs-http-client/src/index.js';
// import { config } from '../core/config';
// import { ImportCandidate } from 'ipfs-core-types/dist/src/utils';
//
// /**
//  * IPFS 服务
//  */
// export class IPFSService {
//   private client: IPFSHTTPClient;
//
//   constructor() {
//     // this.client = create({ url: 'https://ipfs.io' });
//     this.client = create(config.ipfsOptions);
//   }
//
//   add(data: ImportCandidate): Promise<any> {
//     return this.client.add(data);
//   }
//
//   dagPut(data: any): Promise<CID> {
//     return this.client.dag.put(data, {
//       hashAlg: 'sha2-512',
//     });
//   }
//
//   dagGet(cid: string) {
//     return this.client.dag.get(CID.parse(cid), {
//       path: 'attributes.value',
//     });
//   }
// }
//
// export const ipfsService = new IPFSService();
