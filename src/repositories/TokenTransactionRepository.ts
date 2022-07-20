import { localDB } from './local';
import { TokenTransaction } from '../entity/Transaction';

/**
 * token transaction 数据仓库
 */
export class TokenTransactionRepository {
  collection: Collection<TokenTransaction>;

  constructor() {
    this.collection = localDB.addCollection<TokenTransaction>('TokenTransaction');
  }

  insert(doc: TokenTransaction | TokenTransaction[]): TokenTransaction | TokenTransaction[] | undefined {
    return this.collection.insert(doc);
  }
}

export const tokenTransactionRepository = new TokenTransactionRepository();
