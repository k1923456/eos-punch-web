import React from 'react';
import { storiesOf } from '@storybook/react';
import HowToPlay from './index.js';

storiesOf('HowToPlay', module)
  .add('the default', () => (
    <HowToPlay />
  ));
