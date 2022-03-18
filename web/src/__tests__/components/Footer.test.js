import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '../../components/footer/footer';

test('renders title', () => {
  render(<Footer classes={{}} />);
  const linkElement = screen.getByText(/Filgaia developments/i);
  expect(linkElement).toBeInTheDocument();
});
