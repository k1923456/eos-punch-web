import React from 'react';
import { storiesOf } from '@storybook/react';
import Header from './index.js';

storiesOf('Header', module)
  .add('the default', () => (
    <Header />
  ));
