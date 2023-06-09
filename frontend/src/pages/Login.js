import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import CircularProgress from "@mui/material/CircularProgress";
import TextInput from "../components/TextInput";
import Button from "../components/Buttton";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

const underlineStyle = {
  textDecoration: "underline",
  fontWeight: 800,
};

function Login({ history }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      navigate("/tutor");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid
        item
        xs={6}
        style={{
          background:
            "linear-gradient(180deg, #7B7B87 0%, #DFEFF1 33.33%, #1E54B7 66.67%, #23408F 100%)",
          height: "100%",
          textAlign: "center",
          paddingTop: "4.3rem",
        }}
      >
        <img src="./logo.svg" />
        <Typography
          variant="h1"
          align="center"
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "white",
          }}
        >
          Thinkbot
        </Typography>
        <Typography
          variant="h3"
          align="center"
          style={{
            fontSize: "24px",
            fontWeight: 500,
            marginTop: "1rem",
            color: "white",
          }}
        >
          Personal Student AI Robot Tutor
        </Typography>
        <img style={{ marginTop: "3rem" }} src="./mdc.svg" />
      </Grid>

      <Grid item xs={6} style={{ paddingTop: "9rem" }}>
        <Typography
          variant="h1"
          align="center"
          style={{
            fontSize: "64px",
            fontWeight: 700,
          }}
        >
          Please Log In
        </Typography>
        <Typography
          variant="h3"
          align="center"
          style={{
            fontSize: "24px",
            fontWeight: 300,
            marginTop: "1rem",
          }}
        >
          Are you a <span style={underlineStyle}>student</span> or a{" "}
          <span style={underlineStyle}>teacher?</span>
        </Typography>

        <Grid item xs={12} style={{ textAlign: "center", marginTop: "4rem" }}>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "60%" }}
          />
        </Grid>
        <Grid item xs={12} style={{ textAlign: "center", marginTop: "1rem" }}>
          <TextInput
            label="Password"
            placeholder="Enter password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "60%" }}
          />
        </Grid>

        <Grid style={{ marginTop: "4rem", textAlign: "center" }} item xs={12}>
          {loading && <CircularProgress />}
          {!loading && <Button onClick={handleLogin}>Log in</Button>}
        </Grid>

        <Typography
          variant="body1"
          style={{ marginTop: "1rem", fontWeight: 700, textAlign: "center" }}
        >
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{
              textDecoration: "underline",
              fontWeight: 600,
              color: "blue",
              cursor: "pointer",
            }}
          >
            register here
          </span>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default Login;
