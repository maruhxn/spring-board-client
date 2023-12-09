import * as React from "react";
import Carousel from "react-material-ui-carousel";
import { FILE_BASE_URL } from "../apis/file-api";
import { Box } from "@mui/material";

function PostImageCarousel({ postImages }) {
  if (!postImages || postImages.length <= 0) return;
  return (
    <Box>
      <Carousel
        sx={{
          textAlign: "center",
          minHeight: 300,
          height: "100%",
        }}
      >
        {postImages.map((image, i) => (
          <img
            key={i}
            src={`${FILE_BASE_URL(image.storedName)}`}
            alt={image.originalName}
            style={{
              height: "100%",
            }}
          />
        ))}
      </Carousel>
    </Box>
  );
}

export default PostImageCarousel;
