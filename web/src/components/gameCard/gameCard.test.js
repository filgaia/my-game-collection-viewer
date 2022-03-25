import React from 'react';
import renderer from 'react-test-renderer';
import { GameCard } from './gameCard';

describe('<GameCard />', () => {
  // TODO: Problems with Zoom component
  // TypeError: Cannot read properties of null (reading 'scrollTop')
  it.skip('renders correctly', () => {
    const tree = renderer
      .create(<GameCard
        classes={{}}
        description=""
        image="dummy.png"
        plataform={0}
        title=""
        labels={[]}
        gamesInformation={{ get: jest.fn(() => []) }}
        setLabelFilter={jest.fn()}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
