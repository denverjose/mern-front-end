import React, { useContext, useState } from "react";
import Avatar from "@mui/material/Avatar";
import classes from "./ProfileInfo.module.css";
import AuthContext from "../../store/auth-context";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
// import TextField from "@mui/material/TextField";
// import AddIcon from "@mui/icons-material/Add";
import EditProfile from "../Edit/EditProfile";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "#e6e2d3",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ProfileInfo = (props) => {
  const [editModal, setEditModal] = useState(false);

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  const date = new Date(props.info.createdAt).toLocaleDateString("en-Gb", {
    year: "numeric",
    month: "long",
  });

  const toggleModal = () => {
    setEditModal(!editModal);
  };

  let noEdit = false;

  if (props.params === props.userId) {
    noEdit = true;
  }
  return (
    <div className={classes.profile}>
      {noEdit && (
        <Modal open={editModal} onClose={toggleModal}>
          <Box sx={style}>
            <EditProfile
              onUpdateProfile={props.onUpdateProfile}
              cancel={toggleModal}
              token={token}
              info={props.info}
            />
          </Box>
        </Modal>
      )}
      <Avatar
        alt={props.info.firstName}
        // src={`https://back-end-project.onrender.com/${props.info.profilePictureUrl}`}
        src={`https://mern-backend-cpbj.onrender.com/${props.info.profilePictureUrl}`}
        sx={{ width: 200, height: 200 }}
        variant="rounded"
      />
      <div className={classes.container}>
        <div className={classes.name}>
          <span>{`${props.info.firstname} ${props.info.lastname}`}</span>
          {noEdit && <span className={classes.edit} onClick={toggleModal}>
            <SettingsIcon />
          </span>}
        </div>

        <p className={classes.username}>@{props.info.username}</p>
        <p className={classes.username}>Joined on {date}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;
