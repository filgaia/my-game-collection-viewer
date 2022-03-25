import React from 'react';
import renderer from 'react-test-renderer';
import { Title } from './title';

describe('<Title />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<Title
        classes={{}}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
