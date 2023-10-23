import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import { UserList } from './users/UserList.js'

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserList />,
  }
])

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
