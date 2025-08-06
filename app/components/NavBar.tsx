"use client";

import React from "react";
import Link from "next/link";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  ListItemButton,
} from "../lib/mui";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PhotoIcon from "@mui/icons-material/Photo";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

const drawerWidth = 240;
const navItems = [
  { name: "Home", icon: <HomeIcon />, href: "/" },
  { name: "Posts", icon: <PhotoIcon />, href: "/posts" },
  { name: "Authors", icon: <AccountBoxIcon />, href: "/authors" },
  { name: "Settings", icon: <SettingsIcon />, href: "/settings" },
];

const NavBar = () => {
  const [open, setOpen] = React.useState(false);

  function handleDrawerToggle() {
    setOpen((prevState) => !prevState);
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box>
        <Typography variant="h6" sx={{ my: 2 }}>
          My Featured Posts
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            style={{
              color: "inherit",
              cursor: "inherit",
              textDecoration: "none",
            }}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Box suppressHydrationWarning>
        <CssBaseline enableColorScheme />
      </Box>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            suppressHydrationWarning
          >
            My Featured Posts
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          suppressHydrationWarning
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ p: 3 }}></Box>
    </Box>
  );
};

export default NavBar;
