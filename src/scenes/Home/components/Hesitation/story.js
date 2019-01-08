import React from 'react';
import { storiesOf } from '@storybook/react';
import Hesitation from './index.js';

storiesOf('Hesitation', module)
  .add('the default', () => (
    <Hesitation />
  ));
