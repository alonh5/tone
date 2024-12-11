import './App.css';
import { ToneApp } from './components/ToneApp';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { StarknetProvider } from './providers/StarknetProvider';

// The main file of the Tone app. It wraps the ToneApp component with the StarknetProvider and ErrorBoundary components.
// ErrorBoundary - a component that catches errors in its children components and displays a
//                 fallback UI, you probably won't need to modify it.
// StarknetProvider - a component that wraps the main app component with some Starknet related
//                    configuration, you probably won't need to modify it either.
// ToneApp - the main component of the Tone app, this is where you will write your app.
const App = () => (
  <ErrorBoundary>
    <StarknetProvider>
      <ToneApp />
    </StarknetProvider>
  </ErrorBoundary>
);

export default App;
