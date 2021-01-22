import { Route, useRouteMatch, Switch, Redirect } from "react-router-dom";
import { PoliticalFigureDetail, PoliticalFigureDetailType } from "./shared/PoliticalFigureDetail";



export function Topics() {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Redirect to={`${path}/0`}></Redirect>
      </Route>
      <Route path={`${path}/:topicId`}>
        <PoliticalFigureDetail
          politicalFigureDetailType={PoliticalFigureDetailType.Topic}
        ></PoliticalFigureDetail>
      </Route>
    </Switch>
  );
}
