import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getPostDetailRequest } from "../../apis/post-api";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { AxiosError } from "axios";
import PostImageCarousel from "../../components/PostImageCarousel ";
import {
  Avatar,
  CardHeader,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FILE_BASE_URL } from "../../apis/file-api";
import { getFormattedDate } from "../../libs/utils";
import CommentList from "../../components/CommentList";
import { getCommentListRequest } from "../../apis/comment-api";
import CommentInputFields from "../../components/CommentInputFields";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { POST_UPDATE_PATH } from "../../common/constants";
import PostDeleteModal from "../../components/modals/PostDeleteModal";
import { useContext } from "react";
import { MemberContext } from "../../context/member-context";

const jobs = ["게시글 수정", "게시글 삭제"];

export default function PostDetail() {
  const { postId } = useParams();
  const { memberInfo } = useContext(MemberContext);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [anchorElOwner, setAnchorElOwner] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const getPostDetail = async () => {
    try {
      const { data } = await getPostDetailRequest(postId);
      if ((data.code = "OK")) {
        setPost(data.data);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response.data.message);
      }
      toast.error("Server Error!");
    }
  };

  const handleOpenOwnerMenu = (event) => {
    setAnchorElOwner(event.currentTarget);
  };

  const handleCloseOwnerMenu = async (job) => {
    if (job === "게시글 수정") {
      navigate(POST_UPDATE_PATH(postId));
    } else if (job === "게시글 삭제") {
      setIsOpen(true);
    }
    setAnchorElOwner(null);
  };

  useEffect(() => {
    getPostDetail();
  }, []);

  if (!post) return;

  return (
    <>
      <Stack spacing={3}>
        <Card sx={{ minWidth: 350, width: "70vw" }}>
          <CardHeader
            avatar={
              <Avatar
                src={`${FILE_BASE_URL(post.author.profileImage)}`}
              ></Avatar>
            }
            action={
              memberInfo &&
              memberInfo.memberId === post.author.memberId && (
                <>
                  <Tooltip title="Open Owner Job">
                    <IconButton onClick={handleOpenOwnerMenu}>
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElOwner}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElOwner)}
                    onClose={handleCloseOwnerMenu}
                  >
                    {jobs.map((job) => (
                      <MenuItem
                        key={job}
                        onClick={() => handleCloseOwnerMenu(job)}
                      >
                        <Typography textAlign="center">{job}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )
            }
            title={post.author.username}
            subheader={getFormattedDate(post.createdAt)}
          />
          <PostImageCarousel postImages={post.images} />
          <CardContent>
            <Typography variant="h5" component="div">
              {post.title}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {`조회 수: ${post.viewCount}`}
            </Typography>
            <Divider variant="middle" />
            <Typography variant="body1">{post.content}</Typography>
          </CardContent>
          <CardActions>
            <IconButton>
              <FavoriteIcon />
            </IconButton>
          </CardActions>
        </Card>
        <Divider />
        <CommentInputFields postId={postId} />
        <CommentList postId={postId} />
      </Stack>
      <PostDeleteModal postId={postId} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
