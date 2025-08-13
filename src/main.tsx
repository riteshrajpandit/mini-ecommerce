import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import '@mantine/core/styles.css'
import './index.css'
import App from './App.tsx'
import { store, persistor } from './store/store'

const theme = createTheme({
  primaryColor: 'gray',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontWeight: '600',
  },
  colors: {
    gray: [
      '#f8f9fa',
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#6c757d',
      '#495057',
      '#343a40',
      '#212529',
      '#000000'
    ],
  },
  components: {
    Button: {
      styles: {
        root: {
          fontWeight: 500,
          transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
        },
      },
    },
    Card: {
      styles: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MantineProvider theme={theme}>
          <App />
        </MantineProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
