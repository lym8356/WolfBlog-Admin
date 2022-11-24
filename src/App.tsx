import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Backdrop, Box, CircularProgress, createTheme, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import PrivateRoute from "./utils/PrivateRoute";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "./redux/hooks";
import { fetchCurrentUser } from "./redux/slices/accountSlice";
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#282828"
      },
      secondary: {
        main: "#A5873E"
      }
    }
  });

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch])

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp])

  if (loading) return (
    <Backdrop open={true} invisible={true}>
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress size={100} color='secondary' />
        <Typography variant='h4' sx={{ justifyContent: 'center', position: 'fixed', top: '60%' }}>
          Loading...
        </Typography>
      </Box>
    </Backdrop>
  )

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar />
      <CssBaseline />
      <Routes>
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Admin />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </ThemeProvider>
  )
}


export default App;