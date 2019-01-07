import React from 'react';
import { storiesOf } from '@storybook/react';
import Loading from './index.js';

storiesOf('Loading', module)
  .add('the default', () => (
    <Loading />
  ));
