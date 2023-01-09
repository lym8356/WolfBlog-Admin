import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Login from "./pages/Login";
import PrivateRoute from "./utils/PrivateRoute";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useSelector } from "./redux/hooks";
import { fetchCurrentUser } from "./redux/slices/accountSlice";
import 'react-toastify/dist/ReactToastify.css';
import LoadingComponent from "./pages/Layout/LoadingComponent";
import Articles from "./pages/Admin/Articles";
import { Home } from "./pages/Admin/Home";
import './App.css';
import { fetchCategoriesAsync } from "./redux/slices/categorySlice";
import { fetchTagsAsync } from "./redux/slices/tagSlice";
import { fetchArticlesAsync } from "./redux/slices/articleSlice";
import { ArticleDetails } from "./pages/Admin/Articles/Details";
import Albums from "./pages/Admin/Albums";
import { fetchAlbumsAsync } from "./redux/slices/albumSlice";
import { MainLayout } from "./pages/Layout/MainLayout";
import AlbumDetails from "./pages/Admin/Albums/Details";
import { Projects } from "./pages/Admin/Projects";
import { fetchProjectsAsync } from "./redux/slices/projectSlice";

function App() {

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.account);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#282828",
        light: "#A8A8A8",
      },
      secondary: {
        main: "#FFD700",
        light: "#F1E5AC"
      }
    }
  });

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchCategoriesAsync());
      await dispatch(fetchTagsAsync());
      await dispatch(fetchArticlesAsync());
      await dispatch(fetchAlbumsAsync());
      await dispatch(fetchProjectsAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch])

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp])

  if (loading) return <LoadingComponent />

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar autoClose={4000} />
      <CssBaseline />
      <MainLayout>
      <Routes>
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Home />} />
          <Route path="/admin/articles" element={<Articles />} />
          <Route path="/admin/articles/createArticle" element={<ArticleDetails />} />
          <Route path="/admin/articles/:id" element={<ArticleDetails />} />
          <Route path="/admin/albums" element={<Albums />} />
          <Route path="/admin/albums/:id" element={<AlbumDetails />} />
          <Route path="/admin/projects" element={<Projects />} />
        </Route>
        <Route path="/login" element={user ? <Navigate to="/admin" /> : <Login /> } />
      </Routes>
      </MainLayout>
    </ThemeProvider>
  )
}


export default App;