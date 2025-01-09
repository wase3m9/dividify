import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Auth from "@/pages/Auth";
import DividendBoard from "@/pages/DividendBoard";
import DividendVoucherForm from "@/pages/DividendVoucherForm";
import DividendAmountForm from "@/pages/DividendAmountForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dividend-board" element={<DividendBoard />} />
        <Route path="/dividend-voucher/create" element={<DividendVoucherForm />} />
        <Route path="/dividend-voucher/amount" element={<DividendAmountForm />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;