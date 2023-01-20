import PostItem from "./PostItem";
import classes from "./PostsList.module.css";

const PostsList = (props) => {
  return (
    <ul className={classes.post}>
      {props.blogs.map((blog) => (
        <PostItem
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

export default PostsList;
