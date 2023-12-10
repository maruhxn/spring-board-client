import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import {
  confirmPasswordRequest,
  updatePasswordRequest,
} from "../../apis/member-api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useState } from "react";
import { MEMBER_DETAIL_PATH } from "../../common/constants";

const PasswordUpdate = () => {
  const navigate = useNavigate();
  const { memberId } = useParams();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { register, handleSubmit } = useForm();

  const { mutate: confirmPassword, isLoading: confirmPasswordLoading } =
    useMutation({
      mutationFn: async ({ currPassword }) => {
        const payload = {
          currPassword,
        };
        const { data } = await confirmPasswordRequest(memberId, payload);
        return data;
      },
      onSuccess: () => {
        setIsConfirmed(true);
        return toast.success("비밀번호 인증 성공!");
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          return toast.error(err.response.data.message);
        }
        toast.error("서버 오류입니다. 잠시 후 다시 시도해주세요.");
      },
    });

  const { mutate: updatePassword, isLoading: updatePasswordLoading } =
    useMutation({
      mutationFn: async ({ currPassword, newPassword, confirmNewPassword }) => {
        const payload = {
          currPassword,
          newPassword,
          confirmNewPassword,
        };
        const { data } = await updatePasswordRequest(memberId, payload);
        return data;
      },
      onSuccess: () => {
        navigate(MEMBER_DETAIL_PATH(memberId));
        return toast.success("비밀번호 변경 성공!");
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          return toast.error(err.response.data.message);
        }
        toast.error("서버 오류입니다. 잠시 후 다시 시도해주세요.");
      },
    });

  return (
    <Card sx={{ maxWidth: 600, width: "100%" }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          비밀번호 수정
        </Typography>
        <form
          onSubmit={handleSubmit((data) =>
            isConfirmed ? updatePassword(data) : confirmPassword(data)
          )}
        >
          <Typography variant="body2" gutterBottoms>
            {isConfirmed ? "새로운 비밀번호 입력" : "현재 비밀번호 입력"}
          </Typography>
          <TextField
            {...register("currPassword", { required: true })}
            label="현재 비밀번호"
            variant="outlined"
            type="password"
            disabled={isConfirmed}
            sx={{ mt: 3, width: "100%" }}
          />

          {isConfirmed && (
            <>
              <TextField
                {...register("newPassword", { required: true })}
                label="새로운 비밀번호"
                variant="outlined"
                type="password"
                sx={{ mt: 3, width: "100%" }}
              />
              <TextField
                {...register("confirmNewPassword", { required: true })}
                label="새로운 비밀번호 확인"
                variant="outlined"
                type="password"
                sx={{ mt: 3, width: "100%" }}
              />
            </>
          )}

          <Stack
            direction="row"
            spacing={2}
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={confirmPasswordLoading || updatePasswordLoading}
            >
              비밀번호 확인
            </Button>
            <Button
              variant="contained"
              size="large"
              color="error"
              disabled={confirmPasswordLoading || updatePasswordLoading}
            >
              취소
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordUpdate;
