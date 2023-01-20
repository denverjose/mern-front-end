import React, { useContext } from "react";
import PostForm from "../components/Form/PostForm";
import AuthContext from "../store/auth-context";

const AddBlog = () => {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  return <PostForm token={token} />;
};

export default AddBlog;
