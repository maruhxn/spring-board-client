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
import {
  deleteImageRequest,
  getPostDetailRequest,
  updatePostRequest,
} from "../../apis/post-api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { FILE_BASE_URL } from "../../apis/file-api";
import { POST_DETAIL_PATH } from "../../common/constants";
import { useRecoilValue } from "recoil";
import { MemberInfoAtom } from "../../atoms/MemberInfoAtom";

const PostUpdate = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const memberInfo = useRecoilValue(MemberInfoAtom);
  const { register, handleSubmit, watch, setValue } = useForm();
  const [previewImages, setPreviewImages] = useState([]);
  const [postImages, setPostImages] = useState([]);
  const [postDetail, setPostDetail] = useState(null);
  const addedImages = watch("images");

  const getPostDetail = async () => {
    try {
      const { data } = await getPostDetailRequest(postId);
      if ((data.code = "OK")) {
        setPostDetail(data.data);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response.data.message);
      }
      toast.error("Server Error!");
    }
  };

  useEffect(() => {
    getPostDetail();
  }, []);

  // 권한 체크
  useEffect(() => {
    if (postDetail && memberInfo.memberId !== postDetail.author?.memberId) {
      navigate("/", { replace: true });
      toast.error("권한이 없습니다.");
    }
  }, [postDetail]);

  useEffect(() => {
    if (postDetail?.title) setValue("title", postDetail.title);
    if (postDetail?.content) setValue("content", postDetail.content);
    if (postDetail?.images) setPostImages(postDetail.images);
  }, [postDetail, setValue]);

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

  const { mutate: deleteImage } = useMutation({
    mutationFn: async (image) => {
      setPostImages(
        postImages.filter((postImage) => postImage.imageId !== image.imageId)
      );
      const { data } = await deleteImageRequest(postId, image.imageId);
      return data;
    },
    onSuccess: () => {
      // navigate(0);
      return toast.success("이미지 삭제 성공!");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error(err.response.data.message);
      }
      toast.error("서버 오류입니다. 잠시 후 다시 시도해주세요.");
    },
  });

  const { mutate: updatePost, isLoading } = useMutation({
    mutationFn: async (formData) => {
      const { data } = await updatePostRequest(postId, formData);
      return data;
    },
    onSuccess: () => {
      navigate(POST_DETAIL_PATH(postId));
      return toast.success("게시글 수정 성공!");
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
    return updatePost(formData);
  };

  if (!postDetail) return;

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
      <Typography variant="h5">게시글 수정</Typography>
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
          {postImages && postImages.length > 0 && (
            <FormControl>
              <FormLabel>기존 이미지 삭제(클릭)</FormLabel>
              <Carousel
                sx={{
                  textAlign: "center",
                }}
              >
                {postImages.length > 0 &&
                  postImages.map((image, i) => (
                    <img
                      onClick={() => deleteImage(image)}
                      key={image.imageId}
                      src={`${FILE_BASE_URL(image.storedName)}`}
                      alt={image.originalName}
                      style={{ height: 300, objectFit: "contain" }}
                    />
                  ))}
              </Carousel>
            </FormControl>
          )}

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

export default PostUpdate;
