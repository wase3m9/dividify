import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

export const Layout = () => {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
};
