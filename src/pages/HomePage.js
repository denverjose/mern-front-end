import React, { Fragment, useState, useEffect } from "react";
import RegisterForm from "../components/Auth/RegisterForm";
import LoginForm from "../components/Auth/LoginForm";
import useHttp from "../hooks/use-http";
import { login } from "../lib/api";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import LoadingSpinner from "../components/UI/LoadingSpinner"

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

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isEntering, setIsEntering] = useState(false);
  const [err, setErr] = useState(false);

  const {
    sendRequest: requestLogin,
    status,
    error: errorLogin,
  } = useHttp(login);

  useEffect(() => {
    if (status === "completed" && errorLogin) {
      setErr(true);
    }
  }, [errorLogin, status]);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const loginHandler = (requestData) => {
    requestLogin(requestData);
  };

  const finishEnteringHandler = () => {
    setIsEntering(false);
  };

  const formFocusedHandler = () => {
    setIsEntering(true);
  };

  const handleClose = () => setErr(false);
  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Fragment>
      <Modal
        open={err}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{errorLogin}</Box>
      </Modal>
      {isLogin && (
        <LoginForm
          login={loginHandler}
          switchAuthModeHandler={switchAuthModeHandler}
          isLoading={status === "pending"}
          isEntering={isEntering}
          formFocusedHandler={formFocusedHandler}
          finishEnteringHandler={finishEnteringHandler}
        />
      )}
      {!isLogin && (
        <RegisterForm
          switchAuthModeHandler={switchAuthModeHandler}
          isEntering={isEntering}
          formFocusedHandler={formFocusedHandler}
          finishEnteringHandler={finishEnteringHandler}
        />
      )}
    </Fragment>
  );
};

export default LoginPage;
