import { Fragment, useEffect, useContext } from "react";
import AuthContext from "../store/auth-context";
import PostsList from "../components/Form/PostsList";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import useHttp from "../hooks/use-http";
import { getAllBlogs } from "../lib/api";

const Feed = () => {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  const { sendRequest, status, data, error } = useHttp(getAllBlogs, true);

  useEffect(() => {
    sendRequest(token);
  }, [sendRequest, token]);
  let posts;

  if (status === "pending") {
    posts = (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "completed" && data && data.length > 0) {
    posts = <PostsList blogs={data} />;
  }

  if (status === "completed" && (!data || data.length === 0)) {
    posts = <h1 className="centered">NO POSTS</h1>;
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <Fragment>
      {posts}
    </Fragment>
  );
};

export default Feed;
