import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  FormLabel,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { MEMBER_CHANGE_PASSWORD_PATH } from "../../common/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { MemberContext } from "../../context/member-context";
import toast from "react-hot-toast";
import { FILE_BASE_URL } from "../../apis/file-api";

export default function MemberDetail() {
  const { memberId } = useParams();
  const { memberInfo } = useContext(MemberContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (memberInfo && memberInfo.memberId != memberId) {
      navigate("/");
      toast.error("권한이 없습니다.");
    }
  }, [memberInfo]);

  if (!memberInfo) return;

  return (
    <>
      <Card
        sx={{
          p: 3,
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6">프로필</Typography>
            <Typography variant="body2" color="GrayText" sx={{ mb: 1 }}>
              프로필 정보 및 수정
            </Typography>
            <Divider />
          </Box>
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Box
              direction="column"
              position="relative"
              sx={{
                width: "30%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar
                src={FILE_BASE_URL(memberInfo.profileImage)}
                sx={{ width: "100%", height: "auto" }}
                alt="프로필 이미지"
              />
              <IconButton
                size="medium"
                variant="outlined"
                color="neutral"
                sx={{
                  bgcolor: "ButtonFace",
                  position: "absolute",
                  zIndex: 2,
                  borderRadius: "50%",
                  left: 130,
                  top: 140,
                  boxShadow: "sm",
                }}
              >
                <EditRoundedIcon />
              </IconButton>
            </Box>
            <Stack spacing={1} height="100%" flexGrow={1}>
              <Stack flex alignItems="center" spacing={1} direction="row">
                <FormLabel sx={{ minWidth: "100px" }}>Username</FormLabel>
                <TextField
                  size="small"
                  sx={{ width: "100%" }}
                  label="USERNAME"
                  defaultValue={`${memberInfo.username}`}
                  variant="outlined"
                />
              </Stack>
              <Stack flex alignItems="center" spacing={1} direction="row">
                <FormLabel sx={{ minWidth: "100px" }}>Email</FormLabel>
                <TextField
                  size="small"
                  sx={{ flexGrow: 1 }}
                  label="EMAIL"
                  InputProps={{
                    readOnly: true,
                  }}
                  defaultValue={`${memberInfo.email}`}
                  variant="filled"
                />
              </Stack>
              <Stack flex alignItems="center" spacing={1} direction="row">
                <FormLabel sx={{ minWidth: "100px" }}>Role</FormLabel>
                <TextField
                  size="small"
                  sx={{ flexGrow: 1 }}
                  label="ROLE"
                  InputProps={{
                    readOnly: true,
                  }}
                  defaultValue={`${memberInfo.role}`}
                  variant="filled"
                />
              </Stack>
            </Stack>
          </Stack>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="contained" size="large" sx={{ width: "25%" }}>
              저장
            </Button>
          </Box>
          <Divider />
          <Grid container>
            <Grid item xs={9}>
              <Typography variant="h6">비밀번호 수정</Typography>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="contained"
                sx={{
                  width: "100%",
                }}
                size="medium"
                onClick={() =>
                  navigate(MEMBER_CHANGE_PASSWORD_PATH(memberInfo.memberId))
                }
              >
                비밀번호 수정
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </>
  );
}
