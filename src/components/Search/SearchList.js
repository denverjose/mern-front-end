import { useEffect } from "react";
import PostItem from "../Form/PostItem";

const SearchList = (props) => {
  return (
    <ul>
      {props.data.map((blog) => (
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
