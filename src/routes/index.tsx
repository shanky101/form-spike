import { createBrowserRouter } from "react-router-dom";
import NudgeForm, {
  loader as nudgeLoader,
  action as nudgeAction,
} from "../components/NudgeForm";

export const router = createBrowserRouter([
  {
    path: "/nudge/:id?",
    element: <NudgeForm />,
    loader: nudgeLoader,
    action: nudgeAction,
  },
  {
    path: "/",
    element: <NudgeForm />,
    loader: nudgeLoader,
    action: nudgeAction,
  },
]);
