import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { deletePostRequest } from "../../apis/post-api";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function PostDeleteModal({ postId, isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const { mutate: deletePost, isLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await deletePostRequest(postId);
      return data;
    },
    onSuccess: () => {
      navigate("/");
      return toast.success("게시글 삭제 성공");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error(err.response.data.message);
      }
      toast.error("서버 오류입니다. 잠시 후 다시 시도해주세요.");
    },
  });

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Stack sx={style} spacing={5}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
        >
          게시글을 삭제하시겠습니까?
        </Typography>
        <Stack flex justifyContent="flex-end" direction="row" spacing={2}>
          <Button
            variant="contained"
            color="error"
            size="medium"
            onClick={() => deletePost()}
            disabled={isLoading}
          >
            삭제
          </Button>
          <Button
            variant="contained"
            size="medium"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            취소
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
