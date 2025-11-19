
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import Features from "@/pages/Features";
import Auth from "@/pages/Auth";
import AuthCallback from "@/pages/AuthCallback";
import ResetPassword from "@/pages/ResetPassword";
import Signup from "@/pages/Signup";
import CompanyDashboard from "@/pages/CompanyDashboard";
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
import JournalEntries from "@/pages/JournalEntries";
import EmailVerified from "@/pages/EmailVerified";
import AdminDashboard from "@/pages/AdminDashboard";

import { DashboardRouter } from "@/components/dashboard/DashboardRouter";
import { PaymentRequiredGate } from "@/components/dashboard/PaymentRequiredGate";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/features",
        element: <Features />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/auth-callback",
        element: <AuthCallback />,
      },
      {
        path: "/email-verified",
        element: <EmailVerified />,
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
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        path: "/company-dashboard",
        element: (
          <PaymentRequiredGate>
            <CompanyDashboard />
          </PaymentRequiredGate>
        ),
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
        element: (
          <PaymentRequiredGate>
            <AccountantDashboard />
          </PaymentRequiredGate>
        ),
      },
      {
        path: "/get-started",
        element: <GetStarted />,
      },
      {
        path: "/dividend-voucher-form",
        element: (
          <PaymentRequiredGate>
            <DividendVoucherForm />
          </PaymentRequiredGate>
        ),
      },
      {
        path: "/dividend-amount-form",
        element: (
          <PaymentRequiredGate>
            <DividendAmountForm />
          </PaymentRequiredGate>
        ),
      },
      {
        path: "/dividend-template",
        element: (
          <PaymentRequiredGate>
            <DividendTemplate />
          </PaymentRequiredGate>
        ),
      },
      {
        path: "/board-minutes-form",
        element: (
          <PaymentRequiredGate>
            <BoardMinutesForm />
          </PaymentRequiredGate>
        ),
      },
      {
        path: "/board-minutes-template",
        element: (
          <PaymentRequiredGate>
            <BoardMinutesTemplate />
          </PaymentRequiredGate>
        ),
      },
      {
        path: "/board-minutes-preview",
        element: (
          <PaymentRequiredGate>
            <BoardMinutesPreview />
          </PaymentRequiredGate>
        ),
      },
      {
        path: "/dividend-waivers",
        element: <DividendWaivers />,
      },
      {
        path: "/journal-entries",
        element: <JournalEntries />,
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
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms",
        element: <TermsOfService />,
      },
      {
        path: "/terms-of-service", 
        element: <TermsOfService />,
      },
      {
        path: "/cookies",
        element: <CookiePolicy />,
      },
      {
        path: "/cookie-policy",
        element: <CookiePolicy />,
      },
      {
        path: "/documentation",
        element: <Api />,
      },
    ],
  },
]);

const Router = () => <RouterProvider router={router} />;
export default Router;
