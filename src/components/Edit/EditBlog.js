import { useState, useEffect } from "react";
import useHttp from "../../hooks/use-http";
import { editBlog } from "../../lib/api";
import classes from "../Form/PostForm.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

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

const Edit = (props) => {
  const [title, setTitle] = useState(props.blog.title);
  const [description, setDescription] = useState(props.blog.description);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(props.blog.coverPhotoUrl);
  const [err, setErr] = useState(false);
  const { token } = props;
  const { sendRequest, status, error } = useHttp(editBlog);

  useEffect(() => {
    if (status === "completed" && error) {
      setErr(true);
    }
  }, [error, status]);

  useEffect(() => {
    if (status === "completed" && !error) {
      props.openModal();
      props.cancel();
    }
  }, [error, status]);

  let formIsValid;
  if (title.length >= 5 && description.length >= 400) {
    formIsValid = true;
  }

  const submitFormHandler = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", coverPhotoUrl);
    formData.append("token", token);
    sendRequest({ blogId: props.blogId, data: formData, token: props.token });
  };

  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  const handleClose = () => setErr(false);

  return (
    <form
      className={classes.form}
      onSubmit={submitFormHandler}
      encType="multipart/form-data"
    >
      <Modal
        open={err}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{error}</Box>
      </Modal>
      <div className={classes.control}>
        <TextField
          label="Title"
          sx={{ marginBottom: "1rem" }}
          helperText={title.length < 5 && "Need more than 5 characters."}
          fullWidth
          required
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          id="description"
          rows={5}
          fullWidth
          multiline
          label="Description"
          helperText={description.length < 400 && "More than 400 characters."}
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          required
        />
      </div>
      <div className={classes.file}>
        <Button component="label">
          <label htmlFor="coverPhotoUrl">Add Cover Photo For Your Blog</label>
          <AddIcon />
          {coverPhotoUrl ? coverPhotoUrl.name : ""}
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
          Update Blsog!
        </button>
      ) : (
        <button className={classes.button}>Update Blog!</button>
      )}
    </form>
  );
};

export default Edit;
