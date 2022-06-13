import React, {Component} from 'react';
import {Page} from '../../components/Page';
import {userService} from '../../services/User';
import {observer} from 'mobx-react';
import {autoBind} from 'jsdk/autoBind';
import {Box, Column, Row, Text} from 'native-base';

@observer
@autoBind
export class Profile extends Component<any, any> {
  constructor(props: any) {
    super(props);
    userService.queryProfile();
  }

  render() {
    const {basicProfile} = userService;
    return (
      <Page>
        <Box pl="4" pr="5" py="2">
          <Row space={3} justifyContent="space-between">
            <Column>
              <Text
                _dark={{
                  color: 'warmGray.50',
                }}
                color="coolGray.800"
                bold>
                {basicProfile?.name}
              </Text>
              <Text
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}>
                {basicProfile?.email as any}
              </Text>
            </Column>
          </Row>
        </Box>
      </Page>
    );
  }
}
