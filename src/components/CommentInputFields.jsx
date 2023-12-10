import { Avatar, ListItem, ListItemAvatar, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { createCommentRequest } from "../apis/comment-api";
import { FILE_BASE_URL } from "../apis/file-api";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { MemberInfoAtom } from "../atoms/MemberInfoAtom";
import { useRecoilValue } from "recoil";

export default function CommentInputFields({ postId }) {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const memberInfo = useRecoilValue(MemberInfoAtom);

  const { mutate: createComment, isLoading } = useMutation({
    mutationFn: async ({ content }) => {
      const payload = {
        content,
      };
      const { data } = await createCommentRequest(postId, payload);
      return data;
    },
    onSuccess: () => {
      navigate(0);
      return toast.success("댓글 생성 성공");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error(err.response.data.message);
      }
      toast.error("서버 오류입니다. 잠시 후 다시 시도해주세요.");
    },
  });

  return (
    <form
      style={{ display: "flex", alignItems: "center" }}
      onSubmit={handleSubmit((content) => createComment(content))}
    >
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar
            alt="프로필 이미지"
            src={memberInfo && `${FILE_BASE_URL(memberInfo.profileImage)}`}
            sx={{
              color: "action.active",
            }}
          />
        </ListItemAvatar>
        <TextField
          {...register("content", { required: true })}
          id="comment"
          label="댓글을 입력하세요"
          variant="standard"
          disabled={isLoading}
          sx={{
            flex: "1",
          }}
        />
      </ListItem>
    </form>
  );
}
