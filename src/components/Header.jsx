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
import {
  AUTH_PATH,
  MEMBER_DETAIL_PATH,
  MEMBER_UPDATE_PATH,
  POST_CREATE_PATH,
} from "../common/constants";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { getMemberInfoRequest, logoutRequest } from "../apis/auth-api";
import { Button, Stack } from "@mui/material";
import { useContext } from "react";
import { MemberContext } from "../context/member-context";
import { FILE_BASE_URL } from "../apis/file-api";

const settings = ["프로필", "로그아웃"];

function Header() {
  const navigate = useNavigate();
  const { memberInfo, setMemberInfo } = useContext(MemberContext);
  const { pathname } = useLocation();
  const [anchorElUser, setAnchorElUser] = useState(null);

  useEffect(() => {
    async function getMemberRequestAsync() {
      try {
        const { data } = await getMemberInfoRequest();
        setMemberInfo(data.data);
      } catch (err) {
        if (err.response.status === 401) {
          return;
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
      pathname === "/" ? navigate(0) : navigate("/");
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
    if (setting === "프로필") navigate(MEMBER_DETAIL_PATH(memberInfo.memberId));
    if (setting === "로그아웃") logoutHandler();
    setAnchorElUser(null);
  };

  if (pathname === AUTH_PATH()) return null;

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            onClick={() => navigate("/")}
            variant="h6"
            noWrap
            component="a"
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
            {memberInfo ? (
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => navigate(POST_CREATE_PATH())}
                  color="success"
                >
                  게시글 작성
                </Button>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="profile image"
                      src={FILE_BASE_URL(memberInfo.profileImage)}
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
              </Stack>
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
