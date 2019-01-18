import React from 'react';
import { storiesOf } from '@storybook/react';
import Punch from './index.js';

storiesOf('Punch', module)
  .add('the default', () => (
    <Punch />
  ));
