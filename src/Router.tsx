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
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";
import Blog from "@/pages/Blog";

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
    path: "board-minutes/preview",
    element: <BoardMinutesPreview />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "contact",
    element: <Contact />,
  },
  {
    path: "privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "terms-of-service",
    element: <TermsOfService />,
  },
  {
    path: "cookie-policy",
    element: <CookiePolicy />,
  },
  {
    path: "blog",
    element: <Blog />,
  },
];

export const router = createBrowserRouter(routes);

export function Router() {
  return <RouterProvider router={router} />;
}