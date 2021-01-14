import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";


export interface MainBarProps {
  handleSidebarOpen: () => void
}

export function MainBar(props: MainBarProps) {

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={props.handleSidebarOpen}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6">Political figures analysis</Typography>
      </Toolbar>
    </AppBar>
  );
}
