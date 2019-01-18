import React from 'react';
import { storiesOf } from '@storybook/react';
import BetField from './index.js';

storiesOf('BetField', module)
  .add('the default', () => (
    <BetField />
  ));
