import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { ShopLayout } from "../layouts";

export const FullScreenLoading = () => {
  return (
      <Box
        display="flex"
        flexDirection= "column"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
      >

        <CircularProgress thickness={2} size={50} />
      </Box>
  );
};
