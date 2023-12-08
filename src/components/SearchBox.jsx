import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { getPostListRequest } from "../apis/post-api";

const SearchBox = ({ setPostList, setTotalPage, setCurrPage }) => {
  const { register, handleSubmit } = useForm();
  const [selectedSearchParam, setSelectedSearchParam] = useState("title");
  const searchParams = ["title", "content", "author"];

  const searchParamMap = {
    title: "제목",
    content: "내용",
    author: "작성자",
  };

  const handleSelectChange = (event) => {
    setSelectedSearchParam(event.target.value);
  };

  const onValid = async ({ keyword }) => {
    const queryOption = {
      [selectedSearchParam]: keyword,
    };
    const { data } = await getPostListRequest(0, queryOption);
    setPostList(data.data.results);
    setTotalPage(data.data.totalPage);
    setCurrPage(1);
  };

  return (
    <form
      style={{ display: "flex", alignItems: "center" }}
      onSubmit={handleSubmit(onValid)}
    >
      <Select
        value={selectedSearchParam}
        onChange={handleSelectChange}
        style={{ marginRight: "8px" }}
      >
        {searchParams.map((param) => (
          <MenuItem key={param} value={param}>
            {searchParamMap[param]}
          </MenuItem>
        ))}
      </Select>
      <TextField
        {...register("keyword", { required: true })}
        placeholder={`${searchParamMap[selectedSearchParam]}으로 검색`}
        variant="outlined"
        fullWidth
        InputProps={{
          startAdornment: (
            <SearchIcon color="action" style={{ marginRight: "8px" }} />
          ),
        }}
      />
      <button style={{ display: "none" }}>검색</button>
    </form>
  );
};

export default SearchBox;
