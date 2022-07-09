import React, { Component } from 'react';
import { autoBind } from 'jsdk/autoBind';
import { Page } from '../../../../components/Page';
import { lang } from '../../../../locales';
import { PageTitle } from '../../../../components/PageTitle';
import { randomMnemonic } from '@oneverse/utils';
import { repository } from '../../../../services/Repository';
import { ArrayUtil } from '@aomi/utils/ArrayUtil';
import { Box, Row } from 'native-base';
import { Word } from './Word';
import { FixedBottomView } from '../../../../components/FixedBottomView';
import { Button } from '../../../../components/Button';
import { resetTo } from '../../../../core/navigation';
import { route } from '../../../router';

type State = {
  mnemonic: string;
  mnemonicWords: Array<string>;
  selectMnemonicWords: Array<string>;
};

/**
 * 备份第三步
 */
@autoBind
export class BackupThree extends Component<any, State> {
  static options = {
    title: lang('app.name'),
    headerBackTitleVisible: false,
    headerShadowVisible: false,
  };

  state: State = {
    mnemonic: '',
    /**
     * 乱序后的助记词
     */
    mnemonicWords: [],
    /**
     * 当前选择的助记词
     */
    selectMnemonicWords: [],
  };

  constructor(props: any) {
    super(props);
    this.getMnemonic();
  }

  async getMnemonic() {
    const data: any = await repository.findMnemonic(true);
    if (data?.mnemonic) {
      this.setState({
        mnemonic: data?.mnemonic,
        mnemonicWords: ArrayUtil.shuffle(data?.mnemonic.split(' ')),
      });
    }
  }

  /**
   * 选择一个助记词
   * 把选择的单词加到选择的数组中并从原始数组中移除
   * @param word 助记词
   */
  handleSelect(word: string) {
    const { mnemonicWords, selectMnemonicWords } = this.state;
    const idx = mnemonicWords.indexOf(word);
    if (idx > -1) {
      mnemonicWords.splice(idx, 1);
      selectMnemonicWords.push(word);
      this.setState({ mnemonicWords, selectMnemonicWords });
    }
  }

  /**
   * 从当前选择的助记词中移除，随机插入到源助记词数组中
   * @param word 移除的助记词
   */
  handleRemove(word: string) {
    const { mnemonicWords, selectMnemonicWords } = this.state;
    const idx = selectMnemonicWords.indexOf(word);
    if (idx > -1) {
      selectMnemonicWords.splice(idx, 1);
      const pushIndex = Math.floor(Math.random() * mnemonicWords.length);
      mnemonicWords.splice(pushIndex, 0, word);
      this.setState({
        mnemonicWords,
        selectMnemonicWords,
      });
    }
  }

  handleFinish() {
    resetTo(route.BackupFour);
  }

  render() {
    const { mnemonic, mnemonicWords, selectMnemonicWords } = this.state;
    return (
      <Page paddingX={7}>
        <PageTitle title={lang('backup.three.title')} description={lang('backup.three.describe')}></PageTitle>
        <Row flexWrap="wrap" padding={3} backgroundColor="coolGray.200" borderRadius="lg">
          {selectMnemonicWords.length === 0 && <Box height={50} />}
          {selectMnemonicWords.map((item, index) => (
            <Word word={item} key={index} onPress={this.handleRemove} />
          ))}
        </Row>
        <Row flexWrap="wrap" mt={5}>
          {mnemonicWords.map((item, index) => (
            <Word word={item} key={index} onPress={this.handleSelect} />
          ))}
        </Row>
        <FixedBottomView>
          <Button isDisabled={mnemonic !== selectMnemonicWords.join(' ')} onPress={this.handleFinish}>
            {lang('backup.three.button')}
          </Button>
        </FixedBottomView>
      </Page>
    );
  }
}
