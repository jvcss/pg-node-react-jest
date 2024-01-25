import { render, screen } from '@testing-library/react';
import Main from './components/Main';

test('renders texts', () => {
  render(<Main />);
  const btnElement = screen.getByText(/Name/i);
  expect(btnElement).toBeInTheDocument();
});
