import React from 'react';
import renderer from 'react-test-renderer';
import { SwipeableView } from './swipeableView';

describe('<SwipeableView />', () => {
  // TODO: Fix: react-swipeable-views: Cannot read properties of null (reading 'addEventListener')
  it.skip('renders correctly', () => {
    const tree = renderer
      .create(<SwipeableView
        classes={{}}
        gamesInformation={{ get: jest.fn() }}
        initGames={jest.fn()}
        loadGames={jest.fn()}
        setLabelFilter={jest.fn()}
        setTab={jest.fn()}
        theme={{ direction: 'left' }}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
