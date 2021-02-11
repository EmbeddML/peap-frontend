import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import InfoIcon from "@material-ui/icons/Info";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import HomeIcon from "@material-ui/icons/Home";
import { Textsms } from "@material-ui/icons";

const StyledPaper = styled.div`
  width: 240px;
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  min-height: 64px;
  justify-content: flex-end;
  padding: 8px;
`;

class DrawerListItem {
  constructor(
    public key: string,
    public to: string,
    public text: string,
    public icon: JSX.Element,
    public dividerBefore: boolean = false
  ) {}
}

const drawerListItems = [
  new DrawerListItem("home", "/", "Home", <HomeIcon />),
  new DrawerListItem(
    "politicians",
    "/politicians",
    "Politicians",
    <SupervisorAccountIcon />
  ),
  new DrawerListItem("parties", "/parties", "Parties", <GroupWorkIcon />),
  new DrawerListItem(
    "coalitions",
    "/coalitions",
    "Coalitions",
    <AccountTreeIcon />
  ),
  new DrawerListItem("topics", "/topics", "Topics", <Textsms />),
  new DrawerListItem(
    "customUser",
    "/customUser",
    "New User",
    <PersonAddIcon />
  ),
  new DrawerListItem("about", "/about", "About", <InfoIcon />, true),
];

export interface SidebarProps {
  sidebarOpen: boolean;
  handleSidebarClose: () => void;
}

export const Sidebar = React.forwardRef((props: SidebarProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const history = useHistory();
  const [currentUrl, setCurrentUrl] = useState<string>(
    history.location.pathname
  );

  useEffect(() => {
    const unlisten = history.listen((location) => {
      setCurrentUrl(location.pathname);
    });
    return () => unlisten();
  }, [history]);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    if (currentUrl === "/") {
      setSelectedIndex(0);
    } else {
      const index = drawerListItems.slice(1).findIndex(
        (drawerListItem) => currentUrl.includes(drawerListItem.to)
      );
      if (index !== -1) {
        setSelectedIndex(index + 1);
      }
    }
  }, [currentUrl]);

  return (
    <Drawer
      ref={ref}
      variant="temporary"
      anchor="left"
      open={props.sidebarOpen}
      PaperProps={{ component: StyledPaper }}
    >
      <DrawerHeader>
        <IconButton onClick={props.handleSidebarClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {drawerListItems.map((drawerListItem, index) => (
          <>
            {drawerListItem.dividerBefore ? <Divider variant="middle" /> : null}
            <ListItem
              button
              component={Link}
              key={drawerListItem.key}
              to={drawerListItem.to}
              selected={selectedIndex === index}
              onClick={(event: any) => handleListItemClick(event, index)}
            >
              <ListItemIcon>{drawerListItem.icon}</ListItemIcon>
              <ListItemText primary={drawerListItem.text} />
            </ListItem>
          </>
        ))}
      </List>
    </Drawer>
  );
});
