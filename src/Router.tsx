
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "@/pages/Index";
import DividendBoard from "@/pages/DividendBoard";
import AccountantDashboard from "@/pages/AccountantDashboard";
import DividendVoucherForm from "@/pages/DividendVoucherForm";
import DividendAmountForm from "@/pages/DividendAmountForm";
import BoardMinutesForm from "@/pages/BoardMinutesForm";
import Auth from "@/pages/Auth";
import Signup from "@/pages/Signup";
import Profile from "@/pages/Profile";
import DividendTemplate from "@/pages/DividendTemplate";
import BoardMinutesTemplate from "@/pages/BoardMinutesTemplate";
import BoardMinutesPreview from "@/pages/BoardMinutesPreview";
import Contact from "@/pages/Contact";
import Accountants from "@/pages/Accountants";
import GetStarted from "@/pages/GetStarted";
import { DashboardRouter } from "@/components/dashboard/DashboardRouter";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Api from "@/pages/Api";
import DividendWaivers from "@/pages/DividendWaivers";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/get-started",
    element: <GetStarted />,
  },
  {
    path: "/dashboard",
    element: <DashboardRouter />,
  },
  {
    path: "/dividend-board",
    element: <DividendBoard />,
  },
  {
    path: "/accountant-dashboard",
    element: <AccountantDashboard />,
  },
  {
    path: "/dividend-voucher",
    element: <DividendVoucherForm />,
  },
  {
    path: "/dividend-amount",
    element: <DividendAmountForm />,
  },
  {
    path: "/board-minutes",
    element: <BoardMinutesForm />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/dividend-template",
    element: <DividendTemplate />,
  },
  {
    path: "/board-minutes-template",
    element: <BoardMinutesTemplate />,
  },
  {
    path: "/board-minutes-preview",
    element: <BoardMinutesPreview />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/accountants",
    element: <Accountants />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/:slug",
    element: <BlogPost />,
  },
  {
    path: "/api",
    element: <Api />,
  },
  {
    path: "/dividend-waivers",
    element: <DividendWaivers />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfService />,
  },
  {
    path: "/cookie-policy",
    element: <CookiePolicy />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
