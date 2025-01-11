import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Signup from "@/pages/Signup";
import DividendBoard from "@/pages/DividendBoard";
import DividendVoucherForm from "@/pages/DividendVoucherForm";
import DividendAmountForm from "@/pages/DividendAmountForm";
import DividendWaivers from "@/pages/DividendWaivers";
import BoardMinutesForm from "@/pages/BoardMinutesForm";
import BoardMinutesTemplate from "@/pages/BoardMinutesTemplate";
import BoardMinutesPreview from "@/pages/BoardMinutesPreview";
import Profile from "@/pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "dividend-board",
        element: <DividendBoard />,
      },
      {
        path: "dividend-voucher",
        element: <DividendVoucherForm />,
      },
      {
        path: "dividend-amount",
        element: <DividendAmountForm />,
      },
      {
        path: "dividend-waivers",
        element: <DividendWaivers />,
      },
      {
        path: "board-minutes",
        element: <BoardMinutesForm />,
      },
      {
        path: "board-minutes-template",
        element: <BoardMinutesTemplate />,
      },
      {
        path: "board-minutes-preview",
        element: <BoardMinutesPreview />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);