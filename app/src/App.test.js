import { render } from '@testing-library/react';
import App from './App';

test('renders correctly', () => {
  const comp = render(<App />);
  expect(comp).toBeTruthy();
});
