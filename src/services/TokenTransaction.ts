import { action, makeAutoObservable, observable } from 'mobx';
import { TokenTransaction } from '../entity/Transaction';
import { tokenTransactionRepository } from '../repositories/TokenTransactionRepository';
import { WalletToken } from '../entity/Wallet';
import { DEFAULT_PAGE, Page } from '@aomi/common-service/Page';

/**
 * token 交易服务
 */
export class TokenTransactionService {
  @observable
  page: Page<TokenTransaction> = DEFAULT_PAGE;

  constructor() {
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
  }

  save(tx: TokenTransaction) {
    tokenTransactionRepository.insert(tx);
  }

  @action
  query({ type, token }: { type?: 'in' | 'out'; token: WalletToken }) {
    const args: LokiQuery<TokenTransaction> = {};
    if (type) {
      switch (type) {
        case 'in':
          args.to = token.address;
          break;
        case 'out':
          args.from = token.address;
          break;
      }
    } else {
      args.address = token.address;
    }
    const totalElements = tokenTransactionRepository.count(args);
    const content = tokenTransactionRepository.find(args);
    this.page = {
      ...this.page,
      totalElements,
      content,
    };
  }
}

export const tokenTransactionService = new TokenTransactionService();
