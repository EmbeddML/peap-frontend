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
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import AccountTreeIcon from "@material-ui/icons/AccountTree";

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

export interface SidebarProps {
  sidebarOpen: boolean;
  handleSidebarClose: () => void;
}

export const Sidebar = React.forwardRef((props: SidebarProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

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
        <ListItem
          button
          component={Link}
          key="politicians"
          to={"/politicians"}
          selected={selectedIndex === 0}
          onClick={(event: any) => handleListItemClick(event, 0)}
        >
          <ListItemIcon>
            <SupervisorAccountIcon />
          </ListItemIcon>
          <ListItemText primary="Politicians" />
        </ListItem>

        <ListItem
          button
          component={Link}
          key="parties"
          to={"/parties"}
          selected={selectedIndex === 1}
          onClick={(event: any) => handleListItemClick(event, 1)}
        >
          <ListItemIcon>
            <GroupWorkIcon />
          </ListItemIcon>
          <ListItemText primary="Parties" />
        </ListItem>

        <ListItem
          button
          component={Link}
          key="coalitions"
          to={"/coalitions"}
          selected={selectedIndex === 2}
          onClick={(event: any) => handleListItemClick(event, 2)}
        >
          <ListItemIcon>
            <AccountTreeIcon />
          </ListItemIcon>
          <ListItemText primary="Coalitions" />
        </ListItem>

        <ListItem
          button
          component={Link}
          key="user"
          to={"/user"}
          selected={selectedIndex === 3}
          onClick={(event: any) => handleListItemClick(event, 3)}
        >
          <ListItemIcon>
            <PersonAddIcon />
          </ListItemIcon>
          <ListItemText primary="You" />
        </ListItem>
        <Divider variant="middle"/>
        <ListItem
          button
          component={Link}
          key="about"
          to={"/about"}
          selected={selectedIndex === 4}
          onClick={(event: any) => handleListItemClick(event, 4)}
        >
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
      </List>
    </Drawer>
  );
});
