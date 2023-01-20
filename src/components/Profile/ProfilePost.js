import React from "react";
import PostItem from "../Form/PostItem";
import classes from "./ProfilePost.module.css";

const ProfilePost = (props) => {
  return (
    <ul className={classes.post}>
      {props.posts.map((blog) => (
        <PostItem
          key={blog._id}
          id={blog._id}
          createdAt={blog.createdAt}
          profilePictureUrl={blog.creator.profilePictureUrl}
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

export default ProfilePost;
