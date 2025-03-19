import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import { router } from './routes';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';

const theme = createTheme({
  primaryColor: 'purple',
  colors: {
    purple: [
      '#f5f0ff',
      '#e5dbfa',
      '#c9b2f3',
      '#ad89ec',
      '#9670e5',
      '#8661e0',
      '#7a52db',
      '#6a43c8',
      '#5e3ab6',
      '#5031a4'
    ],
  },
  fontFamily: 'Roboto, sans-serif',
  defaultRadius: 'md',
  components: {
    RichTextEditor: {
      styles: {
        root: {
          // Add any root-level styles here
        },
        content: {
          '.variable-token': {
            backgroundColor: '#E7F5FF',
            color: '#228BE6',
            padding: '2px 4px',
            borderRadius: '4px',
            margin: '0 2px',
            display: 'inline-block'
          }
        }
      }
    }
  }
});

const App: React.FC = () => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

export default App;