import React, { useContext, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import useHttp from "../hooks/use-http";
import { getProfile, getProfilePosts } from "../lib/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import AuthContext from "../store/auth-context";
import ProfilePost from "../components/Profile/ProfilePost";
import ProfileInfo from "../components/Profile/ProfileInfo";
import classes from "./Profile.module.css";
import { Typography } from "@mui/material";

const Profile = () => {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const profileId = authCtx.userId;
  const params = useParams();
  const { userId } = params;

  const {
    sendRequest: requestProfilePosts,
    status: postStatus,
    data: loadedProfilePosts,
    error: postError,
  } = useHttp(getProfilePosts, true);

  const {
    sendRequest: requestProfile,
    status: profileStatus,
    data: loadedProfile,
    error: profileError,
  } = useHttp(getProfile, true);

  useEffect(() => {
    requestProfilePosts({ token: token, profileId: userId });
  }, [requestProfilePosts, token, userId]);

  useEffect(() => {
    requestProfile({ token: token, profileId: userId });
  }, [requestProfile, token, userId]);

  const updatedProfile = useCallback(() => {
    requestProfile({ token: token, profileId: userId });
    requestProfilePosts({ token: token, profileId: userId });
  }, [requestProfile, requestProfilePosts, token, userId]);

  if (postStatus === "pending" || profileStatus === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (postError) {
    return <p className="centered">Post error:{postError}</p>;
  }

  if (profileError) {
    return <p className="centered">Profile Error:{profileError}</p>;
  }

  return (
    <div className={classes.profile}>
      <div className={classes.profileInfo}>
        <ProfileInfo
          params={userId}
          userId={profileId}
          onUpdateProfile={updatedProfile}
          info={loadedProfile.user}
        />
      </div>
      <div className={classes.post}>
        {loadedProfilePosts.length ? (
          <ProfilePost posts={loadedProfilePosts} />
        ) : (
          <Typography sx={{ fontSize: "40px", textAlign: "center" }}>
            No Blogs Yet!
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Profile;
