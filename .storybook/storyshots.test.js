import initStoryShots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';
import ShallowRenderer from 'react-test-renderer/shallow';

/**
 * Shallow renderer reference:
 * 1. https://reactjs.org/docs/shallow-renderer.html
 * 2. https://github.com/storybooks/storybook/issues/2021#issuecomment-355531090
 */
const shallowSnapshot = ({ story, context }) => {
  expect(new ShallowRenderer().render(story.render(context))).toMatchSnapshot();
};

/**
 * Take reference about the configuration API, see below:
 * https://github.com/infinitered/addon-storyshots
 */
initStoryShots({
  test: shallowSnapshot,
});