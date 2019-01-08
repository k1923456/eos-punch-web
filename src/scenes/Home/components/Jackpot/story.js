import React from 'react';
import { storiesOf } from '@storybook/react';
import Jackpot from './index.js';

storiesOf('Jackpot', module)
  .add('the default', () => (
    <Jackpot />
  ));
