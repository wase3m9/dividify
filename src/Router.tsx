
import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import AuthCallback from "@/pages/AuthCallback";
import Signup from "@/pages/Signup";
import DividendBoard from "@/pages/DividendBoard";
import Profile from "@/pages/Profile";
import Accountants from "@/pages/Accountants";
import AccountantDashboard from "@/pages/AccountantDashboard";
import GetStarted from "@/pages/GetStarted";
import DividendVoucherForm from "@/pages/DividendVoucherForm";
import DividendAmountForm from "@/pages/DividendAmountForm";
import DividendTemplate from "@/pages/DividendTemplate";
import BoardMinutesForm from "@/pages/BoardMinutesForm";
import BoardMinutesTemplate from "@/pages/BoardMinutesTemplate";
import BoardMinutesPreview from "@/pages/BoardMinutesPreview";
import DividendWaivers from "@/pages/DividendWaivers";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Api from "@/pages/Api";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";
import { DashboardRouter } from "@/components/dashboard/DashboardRouter";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/auth-callback",
    element: <AuthCallback />,
  },
  {
    path: "/signup",
    element: <Signup />,
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
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/accountants",
    element: <Accountants />,
  },
  {
    path: "/accountant-dashboard",
    element: <AccountantDashboard />,
  },
  {
    path: "/get-started",
    element: <GetStarted />,
  },
  {
    path: "/dividend-voucher-form",
    element: <DividendVoucherForm />,
  },
  {
    path: "/dividend-amount-form",
    element: <DividendAmountForm />,
  },
  {
    path: "/dividend-template",
    element: <DividendTemplate />,
  },
  {
    path: "/board-minutes-form",
    element: <BoardMinutesForm />,
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
    path: "/dividend-waivers",
    element: <DividendWaivers />,
  },
  {
    path: "/contact",
    element: <Contact />,
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
    path: "/privacy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms",
    element: <TermsOfService />,
  },
  {
    path: "/cookies",
    element: <CookiePolicy />,
  },
]);
