import React from 'react';
import renderer from 'react-test-renderer';
import { ImportDrawer } from './importDrawer';

describe('<ImportDrawer />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<ImportDrawer
        classes={{}}
        importDrawer={false}
        importFile={jest.fn()}
        toggleDrawer={jest.fn()}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
