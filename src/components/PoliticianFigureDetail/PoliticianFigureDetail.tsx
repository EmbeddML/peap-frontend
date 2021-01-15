import { useParams } from "react-router-dom";

export enum PoliticianFigureDetailType {
  Politician,
  Party,
  Coalition,
}

export interface PoliticianFigureDetailProps {
  politicianFigureDetailType: PoliticianFigureDetailType;
}

export function PoliticianFigureDetail({
  politicianFigureDetailType,
}: PoliticianFigureDetailProps) {
  const { username } = useParams<{ username: string }>();

  return (
    <h3> Działa {username}</h3>
  );
}
