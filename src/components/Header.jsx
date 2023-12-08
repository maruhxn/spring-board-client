import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AUTH_PATH, MAIN_PATH } from "../common/constants";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { getMemberInfoRequest, logoutRequest } from "../apis/auth-api";
import { Button, Stack } from "@mui/material";

const settings = ["프로필", "프로필 수정", "로그아웃"];

function Header() {
  const navigate = useNavigate();
  const [currUser, setCurrUser] = useState(null);
  const { pathname } = useLocation();
  const [anchorElUser, setAnchorElUser] = useState(null);

  useEffect(() => {
    async function getMemberRequestAsync() {
      try {
        const { data } = await getMemberInfoRequest();
        setCurrUser(data.data);
      } catch (err) {
        if (err.response.status === 401) {
          console.log("로그인하지 않음");
        }
      }
    }

    getMemberRequestAsync();
  }, []);

  const { mutate: logoutHandler, isLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await logoutRequest();

      return data;
    },
    onSuccess: (data) => {
      window.location.reload();
      return toast.success("로그아웃 성공");
    },
    onError: (err) => {
      toast.error("서버 오류입니다. 잠시 후 다시 시도해주세요.");
    },
  });

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = async (setting) => {
    if (setting === "로그아웃") logoutHandler();
    setAnchorElUser(null);
  };

  if (pathname === AUTH_PATH()) return null;

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            SPRING BOARD
          </Typography>

          <Box sx={{ ml: "auto" }}>
            {currUser ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="profile image"
                      src={`${process.env.REACT_APP_DOMAIN}/images/${currUser.profileImage}`}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      disabled={isLoading}
                      key={setting}
                      onClick={() => handleCloseUserMenu(setting)}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Stack spacing={2} direction="row">
                <Button
                  variant="contained"
                  onClick={() => navigate("/auth?type=login")}
                  color={"secondary"}
                >
                  로그인
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/auth")}
                  color={"success"}
                >
                  회원가입
                </Button>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;