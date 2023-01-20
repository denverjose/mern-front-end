import React, { Fragment, useContext, useEffect } from "react";
import { getProfileDrafts } from "../lib/api";
import { useParams } from "react-router";
import AuthContext from "../store/auth-context";
import PostItem from "../components/Form/PostItem";
import useHttp from "../hooks/use-http";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { Typography } from "@mui/material";
import classes from '../components/Form/PostsList.module.css'
const ProfileDrafts = () => {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const params = useParams();
  const { userId } = params;

  const {
    sendRequest: requestProfileDrafts,
    status: draftStatus,
    data: loadedProfileDrafts,
    error: draftError,
  } = useHttp(getProfileDrafts, true);

  useEffect(() => {
    requestProfileDrafts({ token: token, profileId: userId });
  }, [requestProfileDrafts, token, userId]);

  if (draftStatus === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (draftError) {
    return <p className="centered">draft error:{draftError}</p>;
  }
  return (
    // <ul className={classes.posts}>
    <ul className={classes.post}>
      {!loadedProfileDrafts.length ? (
        <Typography sx={{ fontSize: "40px" , textAlign:'center'}}>No Drafts Found!</Typography>
      ) : (
        loadedProfileDrafts.map((blog) => (
          <PostItem
            key={blog._id}
            id={blog._id}
            createdAt={blog.createdAt}
            userId={blog.creator._id}
            title={blog.title}
            fullname={blog.fullname}
            coverPhotoUrl={blog.coverPhotoUrl}
            description={blog.description}
          />
        ))
      )}
    </ul>
  );
};

export default ProfileDrafts;
