import React from 'react';
import renderer from 'react-test-renderer';
import { Login } from './login';

describe('<Login />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<Login
        classes={{}}
        loginFailure={jest.fn()}
        loginInformation={{ get: jest.fn() }}
        loginSuccess={jest.fn()}
        logoutSuccess={jest.fn()}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
