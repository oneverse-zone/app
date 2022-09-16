import dev from './dev.config';
import prod from './prod.config';

export type Config = {
  infuraApiKey: string;
  alchemyApiKey: string;

  ceramicApi: string;
  ipfsOptions: any;
};

export const config: Config = __DEV__ ? dev : prod;
