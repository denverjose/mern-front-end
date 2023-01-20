import { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import EditProfile from "./components/Edit/EditProfile";
// import EditBlog from "./components/Edit/EditBlog";
import AddBlog from "./pages/AddBlog";
import AuthContext from "./store/auth-context";
import PostDetail from "./pages/PostDetail";
import ProfileDrafts from "./pages/ProfileDrafts";

function App() {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  // const userId = authCtx.userId;
  // const token = authCtx.token;

  return (
    <Layout>
      {!isLoggedIn && (
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      )}
      {isLoggedIn && (
        <Switch>
          <Route path="/" exact>
            <Feed />
          </Route>
          <Route path="/add-blog" exact>
            <AddBlog />
          </Route>
          <Route path="/drafts" exact>
            <ProfileDrafts />
          </Route>
          <Route path="/edit-profile" exact>
            <EditProfile/>
            {/* <EditProfile token={token} userId={userId}/> */}
          </Route>
          <Route path="/:blogId" exact>
            <PostDetail />
          </Route>
          <Route path="/profile/:userId" exact>
            <Profile />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      )}
    </Layout>
  );
}

export default App;
