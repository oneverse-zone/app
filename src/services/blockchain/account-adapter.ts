import { walletManagerService } from './wallet-manager';
import { walletAdapter } from './adapter';

/**
 * 当前选择账户对应的provider
 */
export function accountAdapter() {
  const { selectedAccount } = walletManagerService;
  if (!selectedAccount) {
    throw new Error('no selected account');
  }
  return walletAdapter.getAccountProvider(selectedAccount);
}
