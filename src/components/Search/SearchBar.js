import React, { useState, useEffect, useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import classes from "./SearchBar.module.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SearchList from "./SearchList";
import useHttp from "../../hooks/use-http";
import { searchBlog } from "../../lib/api";
import AuthContext from "../../store/auth-context";
import LoadingSpinner from "../UI/LoadingSpinner";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  height: "100%",
  overflow: "auto",
  bgcolor: "#e6e2d3",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const SearchBar = () => {
  const [searchItem, setSearchItem] = useState([]);
  const [title, setTitle] = useState("");
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const { sendRequest, data, status, error } = useHttp(searchBlog);
  const [searchModal, setSearchModal] = useState(false);

  useEffect(() => {
    if (status === "completed" && !error) {
      setSearchItem(data);
    }
  }, [status, searchItem, error]);

  const search = () => {
    setSearchModal(!searchModal);
  };
  if (status === "completed" && error) {
    return <div className="centered">{error}</div>;
  }

  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  const submitFormHandler = () => {
    sendRequest({ title: title, token: token });
  };

  return (
    <form className={classes.form} onSubmit={submitFormHandler}>
      <Modal
        open={searchModal}
        onClose={search}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <SearchList cb={search} data={searchItem} />
        </Box>
      </Modal>
      <div className={classes.control}>
        <TextField
          id="search"
          label="Search by title"
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          value={title}
          size="small"
          required
        />
      </div>
      <button className={classes.search}>
        <SearchIcon onClick={search} />
      </button>
    </form>
  );
};

export default SearchBar;
