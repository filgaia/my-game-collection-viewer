import React from 'react';
import renderer from 'react-test-renderer';
import { LabelTag } from './labelTag';

describe('<LabelTag />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<LabelTag
        classes={{}}
        gamesInformation={{ get: jest.fn() }}
        label={{}}
        setLabelFilter={jest.fn()}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
