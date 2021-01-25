import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { api } from "../api/api";


const BackdropRowGrid = styled(Grid)`
  margin-bottom: 16px;
`
const StyledBackdrop = styled(Backdrop)`
  z-index: 999;
  color: #fff;
`;

enum Analyzing {
  Stopped,
  Canceled,
  Started,
  CollectingTweets,
  AnalyzingTweets,
  Finished,
  AlreadyExists,
  NoTweetsFound,
  CantFind,
  Error,
  Close,
}

export function CustomUser() {
  const [webSocketClient, setWebSocketClient] = useState<
    WebSocket | undefined | null
  >();
  const [dialogOpen, setDialogOpen] = useState<boolean>(true);
  const [backdropOpen, setBackdropOpen] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<Analyzing>(Analyzing.Stopped);
  const [analyzedUsername, setAnalyzedUsername] = useState<string>("");
  const [analyzedMessageText, setAnalyzedMessageText] = useState<string>("");

  const history = useHistory();

  const handleCancel = () => {
    setDialogOpen(false);
    history.goBack();
  };

  const showProgressOrButton = useCallback(() => {
    return analyzing === Analyzing.Started || analyzing === Analyzing.CollectingTweets || analyzing === Analyzing.AnalyzingTweets
  }, [analyzing]);

  const handleAnalyze = useCallback(() => {
    setAnalyzing(Analyzing.Started);
  }, []);

  useEffect(() => {
    api.getWebSocketClient().subscribe(setWebSocketClient);
  }, []);

  useEffect(() => {
    if (analyzing === Analyzing.Stopped) {
      setDialogOpen(true);
      setBackdropOpen(false);
    } else if (analyzing === Analyzing.Started) {
      setDialogOpen(false);
      setBackdropOpen(true);
      webSocketClient?.send(analyzedUsername);
      setAnalyzedMessageText(`Starting analyzing ${analyzedUsername}`);
    } else if (analyzing === Analyzing.Error) {
      setAnalyzedMessageText(`Error for ${analyzedUsername}.  Redirecting...`);
      let timer = setTimeout(
        () => history.goBack(),
        3000
      );
      return () => {
        clearTimeout(timer);
      };
    } else if (analyzing === Analyzing.CollectingTweets) {
      setAnalyzedMessageText(`Collecting tweets for ${analyzedUsername}`);
    } else if (analyzing === Analyzing.AnalyzingTweets) {
      setAnalyzedMessageText(`Analyzing tweets for ${analyzedUsername}`);
    } else if (analyzing === Analyzing.Canceled) {
      setAnalyzedMessageText(`Canceled analyzing tweets for ${analyzedUsername}.  Redirecting...`);
      let timer = setTimeout(
        () => history.goBack(),
        3000
      );
      return () => {
        clearTimeout(timer);
      };
    } else if (analyzing === Analyzing.AlreadyExists) {
      setDialogOpen(false);
      setBackdropOpen(true);
      setAnalyzedMessageText(
        `Account ${analyzedUsername} already exists. Redirecting...`
      );
      let timer = setTimeout(
        () => history.push(`/politicians/${analyzedUsername}`),
        3000
      );
      return () => {
        clearTimeout(timer);
      };
    } else if (analyzing === Analyzing.NoTweetsFound) {
      setDialogOpen(false);
      setBackdropOpen(true);
      setAnalyzedMessageText(
        `No tweets found for ${analyzedUsername}. Redirecting...`
      );
      let timer = setTimeout(() => history.goBack(), 3000);
      return () => {
        clearTimeout(timer);
      };
    } else if (analyzing === Analyzing.CantFind) {
      setDialogOpen(false);
      setBackdropOpen(true);
      setAnalyzedMessageText(
        `Can't find account ${analyzedUsername}. Redirecting...`
      );
      let timer = setTimeout(() => history.goBack(), 3000);
      return () => {
        clearTimeout(timer);
      };
    } else if (analyzing === Analyzing.Finished) {
      setAnalyzedMessageText(
        `Finished analyzing ${analyzedUsername}. Redirecting...`
      );

      let timer = setTimeout(
        () => history.push(`/politicians/${analyzedUsername}`),
        3000
      );
      return () => {
        clearTimeout(timer);
      };
    }
  }, [webSocketClient, analyzing, analyzedUsername, history]);

  // 1Ponitka0
  useEffect(() => {
    if (!webSocketClient) return;

    webSocketClient.addEventListener("open", (event) => {
      console.log("Open");
      console.log(event);
    });

    webSocketClient.addEventListener("message", (event) => {
      console.log("Message");
      console.log(event);
      const { status, text } = JSON.parse(event.data) as {
        status: string;
        text: string;
      };

      if (status === "OK") {
        if (text.includes("Collecting tweets")) {
          setAnalyzing(Analyzing.CollectingTweets);
        } else if (text.includes("Analyzing tweets")) {
          setAnalyzing(Analyzing.AnalyzingTweets);
        } else if (text.includes("Finished")) {
          setAnalyzing(Analyzing.Finished);
        }
      } else if (status === "ERROR") {
        if (text.includes("This account is already available")) {
          setAnalyzing(Analyzing.AlreadyExists);
        } else if (text.includes("No tweets found")) {
          setAnalyzing(Analyzing.NoTweetsFound);
        } else if (text.includes("Can't find")) {
          setAnalyzing(Analyzing.CantFind);
        } else {
          setAnalyzing(Analyzing.Error);
        }
      } else {
      }
    });

    webSocketClient.addEventListener("error", (event) => {
      console.log("Error");
      console.log(event);
      setAnalyzing(Analyzing.Error);
    });

    return () => webSocketClient.close();
  }, [webSocketClient]);

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={handleCancel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Analyze Twitter account
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter Twitter username here. We will analyze this account for
            you. It can take a couple of minutes.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            value={analyzedUsername}
            onChange={(event) => {
              setAnalyzedUsername(event.target.value);
            }}
            type="name"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAnalyze} color="primary">
            Analyze
          </Button>
        </DialogActions>
      </Dialog>

      <StyledBackdrop open={backdropOpen}>
        <Grid
          direction="column"
          wrap="nowrap"
          justify="center"
        >
          {showProgressOrButton() && <BackdropRowGrid container justify="center">
            <CircularProgress color="inherit" size="100px" />
          </BackdropRowGrid>}
          <BackdropRowGrid container justify="center">
            <Typography variant="h6">{analyzedMessageText}</Typography>
          </BackdropRowGrid>
          {showProgressOrButton() && <BackdropRowGrid container justify="center">
            <Button color="primary" variant="contained" onClick={() => setAnalyzing(Analyzing.Canceled)}>Cancel</Button>
          </BackdropRowGrid>}
        </Grid>
      </StyledBackdrop>
    </>
  );
}
