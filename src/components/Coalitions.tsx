import React, { useEffect, useState } from "react";
import { Coalition } from "../models/model";
import { api } from "../api/api";
import { TwitterPlot } from "./shared/TwitterPlot";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import {
  PoliticalFigureDetail,
  PoliticalFigureDetailType,
} from "./PoliticalFigureDetail";
import { ButtonBase, Fade, Grid, Grow, Paper, Typography } from "@material-ui/core";
import styled from "styled-components";
import { PoliticalFigureDescription } from "./shared/PoliticalFigureDescription";
import TouchRipple from "@material-ui/core/ButtonBase/TouchRipple";

const StyledContainer = styled(Grid)`
  padding: 8px;
`;

const StyledItem = styled(Grid)`
  padding: 8px;
`;

const StyledButtonBase = styled(ButtonBase)`
  width: 100%;
  height: 100%;
`

const StyledPaper = styled(Paper)`
  padding: 8px;
  width: 100%;
  height: 250px;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  :hover {
    background-color: rgba(0, 0, 0, 0.04);
    cursor: pointer;
  }
`;

export function Coalitions() {
  const history = useHistory();
  let { path } = useRouteMatch();
  const [coalitions, setCoalitions] = useState<Coalition[]>([]);

  useEffect(() => {
    api
      .getAllCoalitions()
      .subscribe((coalition) =>
      setCoalitions(coalition.sort((a, b) => a.name.localeCompare(b.name)))
      );
  }, []);

  function onCardClick(partyId: string) {
    history.push(`${path}/${partyId}`)
  }

  return (
    <Switch>
      <Route exact path={path}>
        <Fade in={true}>
          <>
            <Grid container justify="center" style={{ marginTop: "16px" }}>
              <Typography variant="h5" align="center">
                Coalitions
              </Typography>
            </Grid>

            <StyledContainer
              container
              direction="row"
              justify="center"
              alignItems="center"
              alignContent="flex-start"
              wrap="wrap"
              spacing={0}
              xs={12}
              xl={8}
            >
              {coalitions.map((coalition: Coalition) => (
                <Grow in={true} key={coalition.id}>
                  <StyledItem item xs={12} sm={6} md={4}>
                      <StyledButtonBase>
                      <StyledPaper
                        elevation={1}
                        onClick={() => onCardClick(coalition.id)}
                      >
                        <PoliticalFigureDescription
                          politicalFigureData={coalition}
                          dense
                        ></PoliticalFigureDescription>
                      </StyledPaper>
                    </StyledButtonBase>
                  </StyledItem>
                </Grow>
              ))}
            </StyledContainer>
          </>
        </Fade>
      </Route>
      <Route path={`${path}/:coalitionId`}>
        <PoliticalFigureDetail
          politicalFigureDetailType={PoliticalFigureDetailType.Coalition}
        ></PoliticalFigureDetail>
      </Route>
    </Switch>
  );
}
