import React from 'react';
import renderer from 'react-test-renderer';
import { Catalog } from './catalog';

describe('<Catalog />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<Catalog
        classes={{}}
        gamesInformation={{ get: jest.fn() }}
        loadGames={jest.fn()}
        setLabelFilter={jest.fn()}
        hasMoreItems={false}
        games={[]}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
