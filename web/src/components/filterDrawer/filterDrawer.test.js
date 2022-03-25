import React from 'react';
import renderer from 'react-test-renderer';
import { FilterDrawer } from './filterDrawer';

describe('<FilterDrawer />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<FilterDrawer
        classes={{}}
        filterDrawer={false}
        gamesInformation={{ get: jest.fn(() => []) }}
        setLabelFilter={jest.fn()}
        toggleDrawer={jest.fn()}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
