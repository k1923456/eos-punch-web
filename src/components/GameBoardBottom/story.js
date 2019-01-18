import React from 'react';
import { storiesOf } from '@storybook/react';
import GameBoardBottom from './index.js';

storiesOf('GameBoardBottom', module)
  .add('the default', () => (
    <GameBoardBottom />
  ));
