import React from 'react';
import renderer from 'react-test-renderer';
import { Navigator } from './navigator';

describe('<Navigator />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<Navigator
        classes={{}}
        gamesInformation={{ get: jest.fn() }}
        importFile={jest.fn()}
        setLabelFilter={jest.fn()}
        shortByName={jest.fn()}
        toggleDrawer={jest.fn()}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
