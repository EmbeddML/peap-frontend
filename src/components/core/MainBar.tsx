import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Grid,
  InputAdornment,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useCallback, useEffect, useState } from "react";
import { TwitterUser } from "../../models/model";
import { api } from "../../api/api";
import { useHistory } from "react-router-dom";


const StyledTextField = styled(TextField)`
  & .MuiInputBase-input {
    color: #fff;
  }
  & .MuiInputBase-root {
    color: #fff;
  }
  & .MuiInputLabel-root {
    color: #fff;
  }
  & .MuiIconButton-root {
    color: #fff;
  }
`;

export interface MainBarProps {
  handleSidebarOpen: () => void;
}

export function MainBar({ handleSidebarOpen }: MainBarProps) {
  const [searchValue, setSearchValue] = useState<TwitterUser | null>(null);
  const [politicians, setPoliticians] = useState<TwitterUser[]>([]);;
  const history = useHistory();
  
  useEffect(() => {
    api.getAllTwitterUsers().subscribe((newPoliticians) => setPoliticians(newPoliticians.sort((a: TwitterUser, b: TwitterUser) => a.name.localeCompare(b.name))) )
  }, [])

  useEffect(() => {
    if (searchValue) {
      const username = searchValue.username
      history.push(`/politicians/${username}`)
      setSearchValue(null)
    }
  
  }, [searchValue, history])

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Grid container alignContent="center" wrap="nowrap">
            <Grid item>
              <Grid container alignContent="center" style={{ height: "100%" }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleSidebarOpen}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Grid>

            <Grid item style={{ marginRight: "16px" }}>
              <Grid container alignContent="center" style={{ height: "100%" }}>
                <Typography variant="h6">Political figures analysis</Typography>
              </Grid>
            </Grid>
            <Grid item style={{ flex: "1 0 auto" }}>
              <Grid
                container
                style={{ height: "100%" }}
                justify="flex-end"
                wrap="nowrap"
              >
                <Grid item style={{ flex: "1 1 auto" }}>
                  <Grid
                    container
                    style={{ height: "100%" }}
                    alignContent="center"
                    wrap="nowrap"
                    justify="flex-end"
                  >
                    <Grid
                      item
                      style={{
                        minWidth: "150px",
                        alignSelf: "center",
                        flex: "0 1 300px",
                      }}
                    >
                      <Autocomplete
                        id="search"
                        options={politicians}
                        debug
                        getOptionLabel={(option) => option.name}
                        getOptionSelected={(option, value) =>
                          option.username === value.username
                        }
                        autoComplete
                        includeInputInList
                        value={searchValue}
                        onChange={(event: any, newValue: any | null) => {
                          setSearchValue(newValue);
                        }}
                        renderInput={(params) => (
                          <StyledTextField
                            {...params}
                            label="Search politician"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      ></Autocomplete>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar></Toolbar>
    </>
  );
}
