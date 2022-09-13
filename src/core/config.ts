export type Config = {
  infuraApiKey: string;
  alchemyApiKey: string;
};

let config: Config;

if (__DEV__) {
  config = require('./dev.config');
} else {
  config = require('./prod.config');
}

export { config };
