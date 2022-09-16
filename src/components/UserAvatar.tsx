import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autoBind } from 'jsdk/autoBind';
import { Avatar, IAvatarProps } from 'native-base';
import { userService } from '../services/User';

@observer
@autoBind
export class UserAvatar extends Component<IAvatarProps, any> {
  render() {
    const { basicProfile } = userService;

    const props: IAvatarProps = {};
    if (basicProfile?.image) {
      props.source = {
        uri: `${basicProfile.image.original.size}`,
      };
    }

    return <Avatar {...props} {...this.props} />;
  }
}
