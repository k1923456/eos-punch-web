import React from 'react';
import { storiesOf } from '@storybook/react';
import GameBoard from './index.js';

storiesOf('GameBoard', module)
  .add('the default', () => (
    <GameBoard />
  ));
