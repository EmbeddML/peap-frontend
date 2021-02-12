import { ButtonBase, Fade, Grid, Grow, Paper, Typography } from "@material-ui/core";
import styled from "styled-components";

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


export function Home() {
  return (
    <Fade in={true}>
      <>
        <Grid container direction="column" justify="center" style={{ marginTop: "16px" }}>
          <Typography variant="h5" align="center">
            Home
          </Typography>
          <Typography variant="h5" align="center">
            Home
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
              <Grow in={true}>
                  <StyledItem item xs={12} sm={6} md={4} lg={3}>
                      <StyledButtonBase>
                      <StyledPaper
                        elevation={1}
                      >
                        asd
                      </StyledPaper>
                    </StyledButtonBase>
                  </StyledItem>
                </Grow>


            </StyledContainer>
      </>
    </Fade>
  );
}
