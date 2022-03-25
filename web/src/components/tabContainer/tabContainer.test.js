import React from 'react';
import renderer from 'react-test-renderer';
import { TabContainer } from './tabContainer';

describe('<TabContainer />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<TabContainer
        classes={{}}
        dir="left"
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
