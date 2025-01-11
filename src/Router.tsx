import { Routes, Route } from "react-router-dom";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import DividendBoard from "@/pages/DividendBoard";
import DividendVoucherForm from "@/pages/DividendVoucherForm";
import DividendAmountForm from "@/pages/DividendAmountForm";
import DividendWaivers from "@/pages/DividendWaivers";
import Signup from "@/pages/Signup";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dividend-board" element={<DividendBoard />} />
      <Route path="/dividend-voucher/create" element={<DividendVoucherForm />} />
      <Route path="/dividend-voucher/amount" element={<DividendAmountForm />} />
      <Route path="/dividend-voucher/waivers" element={<DividendWaivers />} />
    </Routes>
  );
};