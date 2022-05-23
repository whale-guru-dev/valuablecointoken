/* eslint-disable */
import { createContext } from 'react';

const VCUiContext = createContext({
  lastUpdatedTime: Date.now(),
  setLastUpdatedTime: () => {},
});

export default VCUiContext;
