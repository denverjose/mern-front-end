import { useState, Fragment, useEffect } from "react";
import useHttp from "../../hooks/use-http";
import { addBlog } from "../../lib/api";
import classes from "./PostForm.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import useInput from "../../hooks/use-input";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useHistory } from "react-router-dom";

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

const PostForm = (props) => {
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  const [err, setErr] = useState(false);
  const [success, setSuccess] = useState(false);
  const { sendRequest, status, error } = useHttp(addBlog);
  const { token } = props;
  const history = useHistory();

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

  const isDescriptionValid = (value) => value.length >= 400;
  const isTitleValid = (value) => value.length >= 5 && value.length <= 400;
  const {
    value: titleValue,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
  } = useInput(isTitleValid);
  const {
    value: descriptionValue,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
  } = useInput(isDescriptionValid);
  let formIsValid;

  if (!descriptionHasError && !titleHasError && coverPhotoUrl) {
    formIsValid = true;
  }

  const submitFormHandler = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", titleValue);
    formData.append("description", descriptionValue);
    formData.append("image", coverPhotoUrl);
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

  const handleClose = () => setErr(false);
  const handleCloseSuccess = () => {
    setSuccess(false);
    history.push("/");
  };

  return (
    <Fragment>
      <Modal open={success} onClose={handleCloseSuccess}>
        <Box sx={style}>
          <p>Blog created!</p>
        </Box>
      </Modal>
      <Modal
        open={err}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{error}</Box>
      </Modal>
      <form
        className={classes.form}
        onFocus={props.formFocusedHandler}
        onSubmit={submitFormHandler}
        encType="multipart/form-data"
      >
        <div className={classes.control}>
          <TextField
            id="title"
            label="Title"
            sx={{ marginBottom: "1rem" }}
            helperText={titleHasError && "Need more than 5 characters."}
            onChange={titleChangeHandler}
            onBlur={titleBlurHandler}
            fullWidth
            value={titleValue}
            required
          />
          <TextField
            id="description"
            rows={5}
            fullWidth
            multiline
            label="Description"
            helperText={descriptionHasError && "More than 400 characters."}
            onChange={descriptionChangeHandler}
            onBlur={descriptionBlurHandler}
            value={descriptionValue}
            required
          />
        </div>
        <div className={classes.file}>
          <Button component="label">
            <label htmlFor="coverPhotoUrl">Add Cover Photo For Your Blog</label>
            <AddIcon />
            {coverPhotoUrl ? coverPhotoUrl.name : ''}
            <input
              hidden
              type="file"
              id="coverPhotoUrl"
              name="image"
              onChange={(e) => setCoverPhotoUrl(e.target.files[0])}
            />
          </Button>
        </div>
        {!formIsValid ? (
          <button className={classes.invalid} disabled>
            Add Blog!
          </button>
        ) : (
          <button className={classes.button}>Add Blog!</button>
        )}
      </form>
    </Fragment>
  );
};

export default PostForm;
