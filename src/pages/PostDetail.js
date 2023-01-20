import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router";
import AuthContext from "../store/auth-context";
import useHttp from "../hooks/use-http";
import { getSingleBlog, deleteBlog, draftBlog } from "../lib/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Card from "../components/UI/Card";
import classes from "./PostDetail.module.css";
import EditBlog from "../components/Edit/EditBlog";
import Avatar from "@mui/material/Avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useHistory, Link } from "react-router-dom";
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

const PostDetail = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draftModal, setDraftModal] = useState(false);
  const [delModal, setDelModal] = useState(false);
  const [editingModal, setEditingModal] = useState(false);

  const params = useParams();
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const userId = authCtx.userId;
  const { blogId } = params;
  const history = useHistory();

  const { sendRequest, status, data, error } = useHttp(getSingleBlog, true);
  const { sendRequest: delBlog, status: deleteStatus } = useHttp(deleteBlog);
  const { sendRequest: hideBlog, status: draftStatus } = useHttp(draftBlog);

  useEffect(() => {
    sendRequest({ blogId: blogId, token: token });
  }, [sendRequest, blogId, token]);

  if (
    status === "pending" ||
    deleteStatus === "pending" ||
    draftStatus === "pending"
  ) {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const del = () => {
    delBlog({ token: token, blogId: data._id });
    setDelModal(true);
    setAnchorEl(null);
  };
  const draft = () => {
    hideBlog({ token: token, blogId: data._id });
    setDraftModal(true);
    setAnchorEl(null);
  };
  const hehe = () => {
    setIsEditing(!isEditing);
    sendRequest({ blogId: blogId, token: token });
    setAnchorEl(null);
  };

  if (error) {
    return <p className="centered">{error}</p>;
  }

  let creator;
  if (userId === data.creator._id) {
    creator = true;
  }
  const date = new Date(data.createdAt).toLocaleDateString("en-En", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleCloseDraft = () => {
    setDraftModal(false);
    history.push(`/drafts`);
  };
  const handleCloseEdit = () => {
    setEditingModal(!editingModal);
  };
  const handleCloseDel = () => {
    setDelModal(false);
    history.push("/");
  };

  return (
    <Card className={classes.post}>
      <Modal open={draftModal} onClose={handleCloseDraft}>
        <Box sx={style}>
          {!data.isDraft ? <p>Blog Drafted!</p> : <p>Blog Restored!</p>}
        </Box>
      </Modal>
      <Modal open={editingModal} onClose={handleCloseEdit}>
        <Box sx={style}>Blog Updated!</Box>
      </Modal>
      <Modal open={delModal} onClose={handleCloseDel}>
        <Box sx={style}>Blog Deleted!</Box>
      </Modal>
      {!isEditing ? (
        <div className={classes.blogContainer}>
          <div className={classes.blog}>
            <div className={classes.content}>
              <h1>{data.title}</h1>
              <p>{data.description}</p>
            </div>
            <div className={classes.image}>
              <Avatar
                alt={data.fullname}
                src={`https://mern-backend-cpbj.onrender.com/${data.coverPhotoUrl}`}
                style={{ width: 340, height: 340 }}
                variant="square"
              />
            </div>
            {creator && (
              <div className={classes.options}>
                <MoreVertIcon onClick={handleClick} />
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  {!data.isDraft ? (
                    <MenuItem onClick={draft}>Archive</MenuItem>
                  ) : (
                    <MenuItem onClick={draft}>Restore</MenuItem>
                  )}
                  <MenuItem onClick={hehe}>Edit</MenuItem>
                  <MenuItem onClick={del}>Delete</MenuItem>
                </Menu>
              </div>
            )}
          </div>
          <h6 className={classes.postedBy}>
            <span>
              {`Posted by: `}
              <span>
                <Link className={classes.aa} to={`/profile/${data.creator._id}`}>
                  {data.fullname}
                </Link>
              </span>
              {` on ${date}`}
            </span>
          </h6>
        </div>
      ) : (
        <EditBlog
          openModal={handleCloseEdit}
          cancel={hehe}
          token={token}
          blogId={data._id}
          blog={data}
        />
      )}
    </Card>
  );
};

export default PostDetail;
