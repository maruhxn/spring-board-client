import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Carousel from "react-material-ui-carousel";
import { createPostRequest } from "../../apis/post-api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const PostCreate = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm();
  const [previewImages, setPreviewImages] = useState([]);
  const addedImages = watch("images");

  useEffect(() => {
    setPreviewImages([]);
    if (addedImages && addedImages.length > 0) {
      for (let i = 0; i < addedImages.length; i++) {
        setPreviewImages((prev) => [
          ...prev,
          URL.createObjectURL(addedImages[i]),
        ]);
      }
    }
  }, [addedImages]);

  const { mutate: createPost, isLoading } = useMutation({
    mutationFn: async (formData) => {
      const { data } = await createPostRequest(formData);
      return data;
    },
    onSuccess: () => {
      navigate("/");
      return toast.success("게시글 생성 성공!");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error(err.response.data.message);
      }
      toast.error("서버 오류입니다. 잠시 후 다시 시도해주세요.");
    },
  });

  const onValid = async ({ title, content, images }) => {
    if (isLoading) return;
    const formData = new FormData();
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }
    formData.append("title", title);
    formData.append("content", content);
    return createPost(formData);
  };

  return (
    <Card
      onSubmit={handleSubmit(onValid)}
      component="form"
      variant="elevation"
      sx={{
        minWidth: 350,
        width: "70vw",
        p: 2,
        overflow: "auto",
      }}
    >
      <Typography variant="h5">게시글 생성</Typography>
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <TextField {...register("title", { required: true })} />
          </FormControl>
          <FormControl>
            <FormLabel>내용</FormLabel>
            <TextareaAutosize
              minRows={10}
              {...register("content", { required: true })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>이미지 추가</FormLabel>
            <input
              id="images"
              multiple
              type="file"
              accept="images/*"
              {...register("images")}
            />
          </FormControl>
          {previewImages?.length > 0 && (
            <Box>
              <Carousel
                sx={{
                  textAlign: "center",
                }}
              >
                {previewImages.map((image, i) => (
                  <img
                    key={i}
                    src={image}
                    alt={`이미지 ${i}`}
                    style={{ height: 300, objectFit: "contain" }}
                  />
                ))}
              </Carousel>
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ width: "100%" }}
          >
            저장
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PostCreate;
