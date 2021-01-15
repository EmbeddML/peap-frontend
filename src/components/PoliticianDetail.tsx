import { LensTwoTone } from "@material-ui/icons";
import { useParams } from "react-router-dom";

export function PoliticianDetail() {
  const { username } = useParams<{ username: string }>();

  return <h3> Działa {username}</h3>;
}
