import { Fragment, useState, useEffect } from "react";
import Card from "../UI/Card";
import LoadingSpinner from "../UI/LoadingSpinner";
import { Prompt } from "react-router-dom";
import classes from "./RegisterForm.module.css";
import useInput from "../../hooks/use-input";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import useHttp from "../../hooks/use-http";
import { signup } from "../../lib/api";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

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

const RegisterForm = (props) => {
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [err, setErr] = useState(false);
  const [success, setSuccess] = useState(false);
  const isEmail = (value) => value.includes("@");
  const isNameValid = (value) =>
    value.trim().length >= 2 && value.trim().length <= 400;
  const isPassword = (value) => value.trim().length >= 6;
  const isConfirmPassword = (value) => value === passwordValue;

  const {
    sendRequest: requestRegister,
    status,
    error: errorRegister,
  } = useHttp(signup);

  useEffect(() => {
    if (status === "completed" && errorRegister) {
      setErr(true);
    }
  }, [errorRegister, status]);
  useEffect(() => {
    if (status === "completed" && !errorRegister) {
      setSuccess(true);
    }
  }, [errorRegister, status]);
  const {
    value: usernameValue,
    isValid: usernameIsValid,
    hasError: usernameHasError,
    valueChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
  } = useInput(isNameValid);

  const {
    value: firstNameValue,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
  } = useInput(isNameValid);
  const {
    value: lastNameValue,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
  } = useInput(isNameValid);
  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput(isEmail);
  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput(isPassword);
  const {
    value: confirmPasswordValue,
    isValid: confirmPasswordIsValid,
    hasError: confirmPasswordHasError,
    valueChangeHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
  } = useInput(isConfirmPassword);

  let formIsValid = false;

  if (
    profilePictureUrl &&
    usernameIsValid &&
    firstNameIsValid &&
    lastNameIsValid &&
    emailIsValid &&
    passwordIsValid &&
    confirmPasswordIsValid
  ) {
    formIsValid = true;
  }

  const registrationHandler = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("username", usernameValue);
    formData.append(
      "firstname",
      firstNameValue.charAt(0).toUpperCase() + firstNameValue.slice(1)
    );
    formData.append(
      "lastname",
      lastNameValue.charAt(0).toUpperCase() + lastNameValue.slice(1)
    );
    formData.append("image", profilePictureUrl);
    formData.append("email", emailValue);
    formData.append("password", passwordValue);
    requestRegister(formData);
  };
  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }
  const handleClose = () => setErr(false);
  const handleCloseSuccess = () => {
    setSuccess(false);
    props.switchAuthModeHandler();
  };
  return (
    <Fragment>
      <Modal open={success} onClose={handleCloseSuccess}>
        <Box sx={style}>
          <p>Created User</p>
        </Box>
      </Modal>
      <Modal
        open={err}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{errorRegister}</Box>
      </Modal>
      <Prompt
        when={props.isEntering}
        message={(location) =>
          "Are you sure you want to leave? All your entered data will be lost!"
        }
      />
      <Card className={classes.auth}>
        <h1>Register</h1>
        <form
          onSubmit={registrationHandler}
          onFocus={props.formFocusedHandler}
          encType="multipart/form-data"
        >
          <div className={classes.control}>
            <TextField
              id="username"
              label="Username"
              onChange={usernameChangeHandler}
              onBlur={usernameBlurHandler}
              helperText={usernameHasError && "More than 2 characters."}
              value={usernameValue}
              required
            />
          </div>
          <div className={classes.control}>
            <TextField
              id="firstname"
              label="First name"
              helperText={firstNameHasError && "More than 2 characters."}
              onChange={firstNameChangeHandler}
              onBlur={firstNameBlurHandler}
              value={firstNameValue}
              required
            />
          </div>

          <div className={classes.control}>
            <TextField
              id="lastname"
              label="Last Name"
              helperText={lastNameHasError && "More than 2 characters."}
              onChange={lastNameChangeHandler}
              onBlur={lastNameBlurHandler}
              value={lastNameValue}
              required
            />
          </div>
          <div className={classes.control}>
            <TextField
              id="email"
              label="Email"
              helperText={emailHasError && "Need a valid email address"}
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
              value={emailValue}
              required
            />
          </div>
          <div className={classes.control}>
            <TextField
              id="password"
              type="password"
              label="Password"
              helperText={passwordHasError && "More than 6 characters."}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
              value={passwordValue}
              required
            />
          </div>
          <div className={classes.control}>
            <TextField
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              helperText={confirmPasswordHasError && "Password need to match."}
              onChange={confirmPasswordChangeHandler}
              onBlur={confirmPasswordBlurHandler}
              value={confirmPasswordValue}
              required
            />
          </div>
          <div className={classes.file}>
            <Button component="label">
              <label htmlFor="profilePictureUrl">Add Profile Picture</label>
              <AddIcon />
              {profilePictureUrl ? profilePictureUrl.name : ""}
              <input
                type="file"
                label="awe"
                id="profilePictureUrl"
                hidden
                name="image"
                onChange={(e) => setProfilePictureUrl(e.target.files[0])}
                required
              />
            </Button>
          </div>
          <div className={classes["actions"]}>
            {!props.isLoading && (
              <button
                disabled={!formIsValid}
                onClick={props.finishEnteringHandler}
              >
                Register Account
              </button>
            )}
            <button
              type="button"
              className={classes.toggle}
              onClick={props.switchAuthModeHandler}
            >
              Already have an account? Sign in here!
            </button>
          </div>
        </form>
      </Card>
    </Fragment>
  );
};

export default RegisterForm;
