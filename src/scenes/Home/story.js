import React from 'react';
import { storiesOf } from '@storybook/react';
import Home from './index.js';

storiesOf('Home', module)
  .add('a normal component', () => (
    <Home />
  ));