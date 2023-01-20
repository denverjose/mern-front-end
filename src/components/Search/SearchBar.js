import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import classes from "./SearchBar.module.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SearchList from "./SearchList";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  height: '100%',
  overflow:'scroll',
  bgcolor: "#e6e2d3",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const SearchBar = () => {
  const [title, setTitle] = useState("");
  const [searchModal, setSearchModal] = useState(false);

  const search = () => {
    setSearchModal(!searchModal);
  };
  return (
    <form
      className={classes.form}
      // onSubmit={submitFormHandler}
    >
      <Modal
        open={searchModal}
        onClose={search}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <SearchList cb={search} search={title} />
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
      <div className={classes.search}>
        <SearchIcon onClick={search} />
      </div>
    </form>
  );
};

export default SearchBar;
