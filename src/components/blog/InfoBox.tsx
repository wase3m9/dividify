import { Info, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface InfoBoxProps {
  children: React.ReactNode;
  type?: "info" | "success" | "warning" | "error";
  title?: string;
}

export const InfoBox = ({ children, type = "info", title }: InfoBoxProps) => {
  const configs = {
    info: {
      icon: Info,
      bgClass: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200",
      iconClass: "text-blue-600",
      titleClass: "text-blue-900"
    },
    success: {
      icon: CheckCircle,
      bgClass: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
      iconClass: "text-green-600",
      titleClass: "text-green-900"
    },
    warning: {
      icon: AlertTriangle,
      bgClass: "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200",
      iconClass: "text-yellow-600",
      titleClass: "text-yellow-900"
    },
    error: {
      icon: AlertCircle,
      bgClass: "bg-gradient-to-r from-red-50 to-rose-50 border-red-200",
      iconClass: "text-red-600",
      titleClass: "text-red-900"
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`p-6 rounded-lg border-l-4 ${config.bgClass} my-6`}>
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconClass}`} />
        <div className="flex-1">
          {title && (
            <h4 className={`font-semibold mb-2 ${config.titleClass}`}>
              {title}
            </h4>
          )}
          <div className="text-gray-700 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};