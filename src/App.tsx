import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Auth from "@/pages/Auth";
import DividendBoard from "@/pages/DividendBoard";
import DividendVoucherForm from "@/pages/DividendVoucherForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dividend-board" element={<DividendBoard />} />
        <Route path="/dividend-voucher/create" element={<DividendVoucherForm />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;