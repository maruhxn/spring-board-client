import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import { getPostListRequest } from "../../apis/post-api";
import { useState } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { POST_DETAIL_PATH } from "../../common/constants";
import { styled } from "@mui/material/styles";
import { Box, Pagination, Stack } from "@mui/material";
import SearchBox from "../../components/SearchBox";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function Main() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currPage, setCurrPage] = useState(
    searchParams.get("page") ? +searchParams.get("page") : 1
  );

  useEffect(() => {
    const getPostList = async () => {
      try {
        const { data } = await getPostListRequest(currPage - 1, {});
        setPosts(data.data.results);
        setTotalPage(data.data.totalPage);
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(err.response.data.message);
        }
        toast.error("Server Error!");
      }
    };

    getPostList();
  }, []);

  const handlePageChange = async (event, targetPage) => {
    try {
      setCurrPage(targetPage);
      const { data } = await getPostListRequest(targetPage - 1, {});
      setPosts(data.data.results);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response.data.message);
      }
    }
  };

  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <SearchBox
        setPostList={setPosts}
        setTotalPage={setTotalPage}
        setCurrPage={setCurrPage}
      />
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Post ID</StyledTableCell>
              <StyledTableCell align="right">제목</StyledTableCell>
              <StyledTableCell align="right">작성자</StyledTableCell>
              <StyledTableCell align="center">게시일</StyledTableCell>
              <StyledTableCell align="right">댓글 수</StyledTableCell>
              <StyledTableCell align="right">조회 수</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.length > 0 &&
              posts?.map((post) => (
                <TableRow
                  hover
                  key={post.postId}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`${POST_DETAIL_PATH(post.postId)}`)}
                >
                  <TableCell scope="row">{post.postId}</TableCell>
                  <TableCell align="right">{post.title}</TableCell>
                  <TableCell align="right">{post.authorName}</TableCell>
                  <TableCell align="center">{post.createdAt}</TableCell>
                  <TableCell align="right">{post.commentCount}</TableCell>
                  <TableCell align="right">{post.viewCount}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
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
    </Stack>
  );
}
