import { FC } from "react";

interface HeaderProps {
  companyName: string | null;
}

export const Header: FC<HeaderProps> = ({ companyName }) => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">{companyName || 'Company Dashboard'}</h1>
      <p className="text-gray-600">
        Manage your company information, directors, shareholdings, and dividend vouchers in one place.
      </p>
    </div>
  );
};