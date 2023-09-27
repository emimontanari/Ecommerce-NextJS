import Head from "next/head";
import { FC, PropsWithChildren } from "react";
import { SideMenu } from "../ui";
import { AdminNavbar } from "../admin";
import { Box, Typography } from "@mui/material";

interface Props extends PropsWithChildren {
  title: string;
  subTitle: string;
  icon?: JSX.Element;
}

export const AdminLayout: FC<Props> = ({ children, title, subTitle, icon }) => {
  return (
    <>
      <nav>
        <AdminNavbar />
      </nav>

      <SideMenu />

      <main
        style={{
          margin: "80px auto",
          maxWidth: "1400px",
          padding: "0 30px",
        }}
      >

        <Box display={"flex"} flexDirection="column">
            <Typography variant="h1" component="h1">{title} {icon}</Typography>
            <Typography variant="subtitle1" component="h2">{subTitle}</Typography>
        </Box>
        <Box className="fadeIn">
            {children}
        </Box>
      </main>
    </>
  );
};
