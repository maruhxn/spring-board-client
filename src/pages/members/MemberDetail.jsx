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
import { useContext, useEffect, useState } from "react";
import { MemberContext } from "../../context/member-context";
import toast from "react-hot-toast";
import { FILE_BASE_URL } from "../../apis/file-api";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  getMemberDetailRequest,
  updateMemberProfileRequest,
} from "../../apis/member-api";
import { AxiosError } from "axios";

export default function MemberDetail() {
  const { register, handleSubmit, watch } = useForm();
  const { memberId } = useParams();
  const { memberInfo } = useContext(MemberContext);
  const navigate = useNavigate();
  const [memberDetail, setMemberDetail] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const newProfileImage = watch("profileImage");

  const getMemberDetail = async () => {
    try {
      const { data } = await getMemberDetailRequest(memberId);
      if ((data.code = "OK")) {
        setMemberDetail(data.data);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response.data.message);
      }
      toast.error("Server Error!");
    }
  };

  useEffect(() => {
    if (memberInfo && memberInfo.memberId !== +memberId) {
      navigate("/");
      toast.error("권한이 없습니다.");
      return;
    }
    getMemberDetail();
  }, [memberInfo]);

  useEffect(() => {
    if (newProfileImage && newProfileImage.length > 0) {
      const file = newProfileImage[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [newProfileImage]);

  const { mutate: updateProfile, isLoading } = useMutation({
    mutationFn: async (formData) => {
      const { data } = await updateMemberProfileRequest(memberId, formData);
      return data;
    },
    onSuccess: () => {
      navigate(0);
      return toast.success("프로필 변경 성공!");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error(err.response.data.message);
      }
      toast.error("서버 오류입니다. 잠시 후 다시 시도해주세요.");
    },
  });

  const onValid = async ({ profileImage, username }) => {
    if (isLoading) return;
    const formData = new FormData();
    if (profileImage && profileImage[0]) {
      formData.append("profileImage", profileImage[0]);
    }
    formData.append("username", username);
    return updateProfile(formData);
  };

  if (!memberInfo || !memberDetail) return;

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
          <form onSubmit={handleSubmit(onValid)}>
            <Stack direction="row" spacing={3} flex>
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
                  src={
                    avatarPreview || FILE_BASE_URL(memberDetail.profileImage)
                  }
                  sx={{ width: "200px", height: "200px", aspectRatio: "1 / 1" }}
                  alt="프로필 이미지"
                />
                <input
                  {...register("profileImage")}
                  style={{ display: "none" }}
                  type="file"
                  accept="image/*"
                  id="file"
                  alt="프로필 이미지 선택"
                />
                <IconButton
                  htmlFor="file"
                  component="label"
                  size="medium"
                  variant="outlined"
                  color="neutral"
                  sx={{
                    bgcolor: "ButtonFace",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    left: 130,
                    top: 160,
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
                    {...register("username")}
                    size="small"
                    sx={{ width: "100%" }}
                    label="USERNAME"
                    defaultValue={`${memberDetail.username}`}
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
                    defaultValue={`${memberDetail.email}`}
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
                    defaultValue={`${memberDetail.role}`}
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
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ width: "25%" }}
              >
                저장
              </Button>
            </Box>
          </form>
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
