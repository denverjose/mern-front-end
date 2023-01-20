import { useEffect, useContext, useState } from "react";
import useHttp from "../../hooks/use-http";
import { searchBlog } from "../../lib/api";
import AuthContext from "../../store/auth-context";
import LoadingSpinner from "../UI/LoadingSpinner";
// import SearchItem from "./SearchItem";
import PostItem from "../Form/PostItem";

const SearchList = (props) => {
  const [searchItem, setSearchItem] = useState([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const { sendRequest, data, status, error } = useHttp(searchBlog);

  useEffect(() => {
    sendRequest({ title: props.search, token: token });
  }, [sendRequest, props.search, token]);

  useEffect(() => {
    if (status === "completed" && !error) {
      setSearchItem(data);
    }
  }, [status, searchItem, error]);

  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "completed" && error) {
    return <div className="centered">{error}</div>;
  }

  return (
    <ul>
      {searchItem.map((blog) => (
        <PostItem
          cb={props.cb}
          profilePictureUrl={blog.creator.profilePictureUrl}
          key={blog._id}
          id={blog._id}
          createdAt={blog.createdAt}
          userId={blog.creator._id}
          title={blog.title}
          fullname={blog.fullname}
          coverPhotoUrl={blog.coverPhotoUrl}
          description={blog.description}
        />
      ))}
    </ul>
  );
};

export default SearchList;
