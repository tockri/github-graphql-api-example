import React from "react";
import {AppBar, Toolbar, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";


export const PageRoot: React.FC = (props) => {
  const {children} = props
  return <>
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            Github GraphQL API sample
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
    <Container sx={{paddingTop: 2}}>
      {children}
    </Container>
  </>
}
