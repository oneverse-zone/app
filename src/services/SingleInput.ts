import { makeAutoObservable } from 'mobx';
import { navigate } from '../core/navigation';
import { route } from '../core/route.config';

export class SingleInputService {
  loading = false;

  defaultValue: string = '';
  value: string = '';
  helperText?: string = '';
  onOk?: (v: any) => Promise<any> = undefined;

  inputProps: any = {};

  constructor() {
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });
  }

  go({
    title,
    helperText,
    defaultValue,
    onOk,
    inputProps,
  }: {
    title: string;
    helperText: string;
    defaultValue?: any;
    onOk: (data: any) => Promise<any>;
    inputProps?: any;
  }) {
    this.value = defaultValue;
    this.defaultValue = defaultValue;
    this.helperText = helperText;
    this.onOk = onOk;
    this.inputProps = inputProps;
    navigate(route.SingleInputScreen, {
      title,
    });
  }

  handleChange(v: any) {
    this.value = v;
  }

  async handleConfirm() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      await this.onOk?.(this.value);
    } finally {
      this.loading = false;
    }
  }
}

export const singleInputService = new SingleInputService();
