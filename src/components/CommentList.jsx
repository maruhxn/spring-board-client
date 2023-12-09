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
import { Box } from "@mui/material";

export default function CommentList({ comments }) {
  if (!comments) return;
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {comments.map((comment) => (
        <Box key={comment.commentId}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="프로필 이미지"
                src={`${FILE_BASE_URL(comment.author.profileImage)}`}
              />
            </ListItemAvatar>
            <ListItemText
              primary={comment.content}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {comment.author.username}
                  </Typography>
                  {` - ${getFormattedDate(comment.createdAt)}`}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </Box>
      ))}
    </List>
  );
}
