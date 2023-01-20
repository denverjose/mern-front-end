import { Fragment, useState, useEffect } from "react";
import useHttp from "../../hooks/use-http";
import { editProfile } from "../../lib/api";
import classes from "../Form/PostForm.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useHistory } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "fit-content",
  bgcolor: "#e6e2d3",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const EditProfile = (props) => {
  const [username, setUsername] = useState(props.info.username);
  const [email, setEmail] = useState(props.info.email);
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    props.info.profilePictureUrl
  );
  const [firstname, setFirstname] = useState(props.info.firstname);
  const [lastname, setLastname] = useState(props.info.lastname);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [err, setErr] = useState(false);
  const { token } = props;
  const history = useHistory();
  const { sendRequest, status, error } = useHttp(editProfile);

  useEffect(() => {
    if (status === "completed" && error) {
      setErr(true);
    }
  }, [error, status]);

  useEffect(() => {
    if (status === "completed" && !error) {
      setSuccess(true);
    }
  }, [error, status]);

  let formIsValid;
  if (
    username.length >= 2 &&
    firstname.length >= 2 &&
    lastname.length >= 2 &&
    password.length > 0
  ) {
    formIsValid = true;
  }

  let changePwValid;
  if (
    password.length > 0 &&
    newPassword.length >= 6 &&
    confirmNewPassword === newPassword
  ) {
    changePwValid = true;
  }
  const submitFormHandler = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append(
      "firstname",
      firstname.charAt(0).toUpperCase() + firstname.slice(1)
    );
    formData.append(
      "lastname",
      lastname.charAt(0).toUpperCase() + lastname.slice(1)
    );
    formData.append("password", password);
    formData.append("newPassword", newPassword);
    formData.append("image", profilePictureUrl);
    formData.append("token", token);
    sendRequest({ data: formData, token: props.token });
  };

  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  const handleCloseSuccess = () => {
    setSuccess(false);
    props.onUpdateProfile();
    history.push(`/profile/${props.info._id}`);
  };
  const handleClose = () => setErr(false);
  const toggleChangePassword = () => setIsChangingPassword(!isChangingPassword);
  return (
    <Fragment>
      <div className={classes.form}>
        <form onSubmit={submitFormHandler} encType="multipart/form-data">
          <Modal open={err} onClose={handleClose}>
            <Box sx={style}>{error}</Box>
          </Modal>
          <Modal open={success} onClose={handleCloseSuccess}>
            <Box sx={style}>Updated Account!</Box>
          </Modal>
          {!isChangingPassword ? (
            <Fragment>
              {props.info.passwordChances}
              <div className={classes.control}>
                <TextField
                  id="email"
                  fullWidth
                  disabled
                  label="Email"
                  value={email}
                />
                <TextField
                  label="Username"
                  sx={{ marginBottom: "1rem" }}
                  helperText={
                    username.length < 2 && "Need more than 2 characters."
                  }
                  fullWidth
                  required
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  id="firstname"
                  fullWidth
                  label="First name"
                  helperText={firstname.length < 2 && "More than 2 characters."}
                  onChange={(e) => setFirstname(e.target.value)}
                  value={firstname}
                  required
                />
                <TextField
                  id="lastname"
                  fullWidth
                  label="Last name"
                  helperText={lastname.length < 2 && "More than 2 characters."}
                  onChange={(e) => setLastname(e.target.value)}
                  value={lastname}
                  required
                />
                <TextField
                  id="password"
                  type="password"
                  fullWidth
                  required
                  label="Confirm Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
              <div className={classes.file}>
                <Button component="label">
                  <label htmlFor="profilePictureUrl">
                    Add Cover Photo For Your Blog
                  </label>
                  <AddIcon />
                  {profilePictureUrl ? profilePictureUrl.name : ""}
                  <input
                    hidden
                    type="file"
                    id="profilePictureUrl"
                    name="image"
                    onChange={(e) => setProfilePictureUrl(e.target.files[0])}
                  />
                </Button>
              </div>
              {!formIsValid ? (
                <button className={classes.invalid} disabled>
                  Update Account!
                </button>
              ) : (
                <button className={classes.button}>Update Account!</button>
              )}
            </Fragment>
          ) : (
            <Fragment>
              Change Password Chances : {props.info.passwordChances}
              <TextField
                id="password"
                type="password"
                fullWidth
                label="Old Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <TextField
                id="newPassword"
                type="password"
                fullWidth
                label="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
              />
              <TextField
                id="confirmNewPassword"
                type="password"
                fullWidth
                label="Confirm Password"
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                value={confirmNewPassword}
                required
              />
              {!changePwValid ? (
                <button className={classes.invalid} disabled>
                  Change Password
                </button>
              ) : (
                <button className={classes.button}>Change Password</button>
              )}
            </Fragment>
          )}

          <button onClick={props.cancel} className={classes.button}>
            Cancel
          </button>
        </form>
        {!isChangingPassword ? (
          <button onClick={toggleChangePassword} className={classes.button}>
            Change Password
          </button>
        ) : (
          <button onClick={toggleChangePassword} className={classes.button}>
            I don't want to change my password
          </button>
        )}
      </div>
    </Fragment>
  );
};

export default EditProfile;
