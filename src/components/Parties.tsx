import React, { useEffect, useState } from "react";
import { Party } from "../models/model";
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

export function Parties() {
  const history = useHistory();
  let { path } = useRouteMatch();
  const [parties, setParties] = useState<Party[]>([]);

  useEffect(() => {
    api
      .getAllParties()
      .subscribe((parties) =>
        setParties(parties.sort((a, b) => a.name.localeCompare(b.name)))
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
                Parties
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
            >
              {parties.map((party: Party) => (
                <Grow in={true} key={party.id}>
                  <StyledItem item xs={12} sm={6} md={4} lg={3}>
                      <StyledButtonBase>
                      <StyledPaper
                        elevation={1}
                        onClick={() => onCardClick(party.id)}
                      >
                        <PoliticalFigureDescription
                          politicalFigureData={party}
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
      <Route path={`${path}/:partyId`}>
        <PoliticalFigureDetail
          politicalFigureDetailType={PoliticalFigureDetailType.Party}
        ></PoliticalFigureDetail>
      </Route>
    </Switch>
  );
}
