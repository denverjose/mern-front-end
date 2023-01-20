import React from "react";
import classes from './SearchItem.module.css' 

const SearchItem = (props) => {
  return (
    <li className={classes.list}>
        <div className={classes.title}>
        {props.title}

        </div>
      {props.description}
      {props.fullname}
    </li>
  );
};

export default SearchItem;
