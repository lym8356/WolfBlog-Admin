import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Login from "./pages/Login";
import PrivateRoute from "./utils/PrivateRoute";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useSelector } from "./redux/hooks";
import { fetchCurrentUser } from "./redux/slices/accountSlice";
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
import AlbumDetails from "./pages/Admin/Albums/Details";
import { Projects } from "./pages/Admin/Projects";
import { fetchProjectsAsync } from "./redux/slices/projectSlice";
import { SiteLogs } from "./pages/Admin/SiteLogs";
import { fetchSiteLogsAsync } from "./redux/slices/siteLogSlice";
import { fetchCommentsAsync } from "./redux/slices/commentSlice";
import Comments from "./pages/Admin/Comments";
import { fetchAboutPageAsync } from "./redux/slices/aboutPageSlice";
import AboutPages from "./pages/Admin/AboutPages";
import { AboutDetails } from "./pages/Admin/AboutPages/Details";
import AdminRoute from "./utils/AdminRoute";

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
      await Promise.all([
        dispatch(fetchCurrentUser()),
        dispatch(fetchCategoriesAsync()),
        dispatch(fetchTagsAsync()),
        dispatch(fetchArticlesAsync()),
        dispatch(fetchAlbumsAsync()),
        dispatch(fetchProjectsAsync()),
        dispatch(fetchSiteLogsAsync()),
        dispatch(fetchCommentsAsync()),
        dispatch(fetchAboutPageAsync())
      ]);
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
      <Routes>
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Home />} />
          <Route path="/admin/articles" element={<Articles type="published" />} />
          {/* <Route path="/admin/articles/createArticle" element={<ArticleDetails />} /> */}
          <Route path="/admin/articles/createArticle" element={<AdminRoute />}>
            <Route path="/admin/articles/createArticle" element={<ArticleDetails />} />
          </Route>
          {/* <Route path="/admin/articles/:id" element={<ArticleDetails />} /> */}
          <Route path="/admin/articles/:id" element={<AdminRoute />}>
            <Route path="/admin/articles/:id" element={<ArticleDetails />} />
          </Route>
          <Route path="/admin/albums" element={<Albums />} />
          <Route path="/admin/albums/:id" element={<AdminRoute />}>
            <Route path="/admin/albums/:id" element={<AlbumDetails />} />
          </Route>
          <Route path="/admin/projects" element={<Projects />} />
          <Route path="/admin/siteLogs" element={<SiteLogs />} />
          <Route path="/admin/comments" element={<Comments />} />
          <Route path="/admin/about" element={<AboutPages />} />
          <Route path="/admin/about/:id" element={<AdminRoute />}>
            <Route path="/admin/about/:id" element={<AboutDetails />} />
          </Route>
          <Route path="/admin/drafts" element={<Articles type="draft" />} />
        </Route>
        <Route path="/login" element={user ? <Navigate to="/admin" /> : <Login />} />
      </Routes>
    </ThemeProvider>
  )
}


export default App;