import React from 'react';
import { storiesOf } from '@storybook/react';
import Settlement from './index.js';

storiesOf('Settlement', module)
  .add('the default', () => (
    <Settlement />
  ));
