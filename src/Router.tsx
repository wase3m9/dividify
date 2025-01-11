import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

const routes = [
  {
    path: "/",
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
    path: "dividend-voucher/create",
    element: <DividendVoucherForm />,
  },
  {
    path: "dividend-voucher/amount",
    element: <DividendAmountForm />,
  },
  {
    path: "dividend-waivers",
    element: <DividendWaivers />,
  },
  {
    path: "board-minutes/create",
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
];

export const router = createBrowserRouter(routes);

export function Router() {
  return <RouterProvider router={router} />;
}