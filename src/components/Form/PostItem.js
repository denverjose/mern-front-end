import classes from "./PostItem.module.css";
import React from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";

const PostItem = (props) => {
  const p = (
    <p>
      {props.description.slice(0, 400)} . . .
      <Link className={classes.detail} to={"/" + props.id}>
        <button>See more</button>
      </Link>
    </p>
  );
  const date = new Date(props.createdAt).toLocaleDateString("en-En", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <li className={classes.post}>
      <Avatar
        alt={props.fullname}
        src={`https://mern-backend-cpbj.onrender.com/${props.coverPhotoUrl}`}
        style={{ width: 450, height: 400 }}
        variant="square"
      />
      <div className={classes.content}>
        <h1>{props.title}</h1>
        {p}
      </div>
      <h6 className={classes.postedBy}>
        <span>
          {`Posted by: `}
          <span>
            <Link className={classes.aa} to={`/profile/${props.userId}`}>{props.fullname}</Link>
          </span>
          {` on ${date}`}
        </span>
      </h6>
    </li>
  );
};

export default PostItem;
