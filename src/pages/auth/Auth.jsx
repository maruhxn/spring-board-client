import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { LOGIN_PATH } from "../../common/constants";
import { useState } from "react";
import { loginRequest, registerRequest } from "../../apis/auth-api";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.redirectedFrom?.pathname || "/";
  const [searchParams] = useSearchParams();
  const authType = searchParams.get("type");
  const [isLoginType] = useState(authType === "login");
  const { register, handleSubmit } = useForm();

  const { mutate: registerHandler, isLoading: isRegisterLoading } = useMutation(
    {
      mutationFn: async ({ email, username, password, confirmPassword }) => {
        const payload = {
          email,
          username,
          password,
          confirmPassword,
        };
        const { data } = await registerRequest(payload);
        return data;
      },
      onSuccess: (data) => {
        navigate(LOGIN_PATH(), { replace: true });
        return toast.success("회원가입 성공");
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 400) {
            return toast.error(err.response.data.message);
          }
        }
        toast.error("서버 오류입니다. 잠시 후 다시 시도해주세요.");
      },
    }
  );

  const { mutate: loginHandler, isLoading: isLoginLoading } = useMutation({
    mutationFn: async ({ email, password }) => {
      const payload = {
        email,
        password,
      };
      const { data } = await loginRequest(payload);

      return data;
    },
    onSuccess: () => {
      navigate(from, { replace: true });
      return toast.success("로그인 성공");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error(err.response.data.message);
      }
      toast.error("서버 오류입니다. 잠시 후 다시 시도해주세요.");
    },
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {authType == "login" ? "Login" : "Register"}
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 3 }}
            onSubmit={handleSubmit((data) => {
              isLoginType ? loginHandler(data) : registerHandler(data);
            })}
          >
            <Grid container spacing={2}>
              {!isLoginType && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    {...register("username")}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  {...register("email")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...register("password")}
                />
              </Grid>
              {!isLoginType && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    autoComplete="confirm-password"
                    {...register("confirmPassword")}
                  />
                </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              disabled={isLoginType ? isLoginLoading : isRegisterLoading}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoginType ? "Login" : "Register"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={LOGIN_PATH()} variant="body2">
                  {isLoginType
                    ? "계정이 없습니까? 회원가입"
                    : "이미 계정이 있습니까? 로그인"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
