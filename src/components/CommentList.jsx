import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { FILE_BASE_URL } from "../apis/file-api";
import { getFormattedDate } from "../libs/utils";
import { Box, IconButton, Pagination } from "@mui/material";
import { useContext } from "react";
import { MemberContext } from "../context/member-context";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import CommentDeleteModal from "./modals/CommentDeleteModal";
import { useSearchParams } from "react-router-dom";
import { getCommentListRequest } from "../apis/comment-api";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { AxiosError } from "axios";

export default function CommentList({ postId }) {
  const { memberInfo } = useContext(MemberContext);
  const [searchParams] = useSearchParams();
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [currPage, setCurrPage] = useState(
    searchParams.get("commentPage") ? +searchParams.get("commentPage") : 1
  );

  const getCommentList = async () => {
    try {
      const { data } = await getCommentListRequest(postId);
      if ((data.code = "OK")) {
        setComments(data.data.results);
        setTotalPage(data.data.totalPage);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response.data.message);
      }
      toast.error("Server Error!");
    }
  };

  useEffect(() => {
    getCommentList();
  }, []);

  const handlePageChange = async (event, targetPage) => {
    try {
      setCurrPage(targetPage);
      const { data } = await getCommentListRequest(postId, targetPage - 1);
      setComments(data.data.results);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response.data.message);
      }
    }
  };

  if (!comments) return;

  return (
    <>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {comments.map((comment) => (
          <Box key={comment.commentId}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                memberInfo &&
                memberInfo.memberId === comment.author.memberId && (
                  <>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <CommentDeleteModal
                      postId={postId}
                      commentId={comment.commentId}
                      isOpen={isModalOpen}
                      setIsOpen={setIsModalOpen}
                    />
                  </>
                )
              }
            >
              <ListItemAvatar>
                <Avatar
                  alt="프로필 이미지"
                  src={`${FILE_BASE_URL(comment.author.profileImage)}`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {`${comment.author.username}`}
                    </Typography>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="caption"
                      color="GrayText"
                    >
                      {` - ${getFormattedDate(comment.createdAt)}`}
                    </Typography>
                  </React.Fragment>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body1"
                      color="text.primary"
                    >
                      {comment.content}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </Box>
        ))}
      </List>
      <Box>
        <Pagination
          count={totalPage}
          color="primary"
          page={currPage}
          onChange={handlePageChange}
          sx={{
            width: "fit-content",
            mx: "auto",
          }}
        />
      </Box>
    </>
  );
}
