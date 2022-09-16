import { Actionsheet, IActionsheetProps } from 'native-base';
import { lang } from '../locales';
import MediaManager, { PhotoAlbum, Options } from '@aomi/react-native-media-manager';

export type MediaActionSheetProps = {
  onFinish?: (media: PhotoAlbum) => void;
  options?: Options;
} & IActionsheetProps;

/**
 * 媒体
 * @param props
 * @constructor
 */
export function MediaActionSheet({ onFinish, options, ...props }: MediaActionSheetProps) {
  async function launchLibrary() {
    const media = await MediaManager.launchLibrary(options);
    onFinish?.(media);
    props.onClose && props.onClose();
  }

  async function launchCamera() {
    const media = await MediaManager.launchCamera(options as any);
    onFinish?.(media);
    props.onClose && props.onClose();
  }

  return (
    <Actionsheet {...props}>
      <Actionsheet.Content>
        <Actionsheet.Item onPress={launchCamera}>{lang('take-a-photo')}</Actionsheet.Item>
        <Actionsheet.Item onPress={launchLibrary}>{lang('pick-from-album')}</Actionsheet.Item>
        <Actionsheet.Item>{lang('cancel')}</Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
