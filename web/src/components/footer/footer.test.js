import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import { Footer } from './footer';

describe('<Footer />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<Footer classes={{}} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders title', () => {
    render(<Footer classes={{}} />);
    const linkElement = screen.getByText(/Filgaia developments/i);
    expect(linkElement).toBeInTheDocument();
  });
});
