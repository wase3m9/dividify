import { Link } from "react-router-dom";
import { FileText, Users, BarChart3, FileSpreadsheet, Building2, PieChart, Layers, Palette, Download } from "lucide-react";

const features = [
  { name: "Dividend voucher generator", anchor: "#dividend-voucher-generator", icon: FileText },
  { name: "Board minutes generator", anchor: "#board-minutes-generator", icon: FileText },
  { name: "Board pack generator", anchor: "#board-pack-generator", icon: Layers },
  { name: "Dividend tracker & analytics", anchor: "#dividend-tracker", icon: BarChart3 },
  { name: "Annual summary reports (PDF & Excel)", anchor: "#annual-summary-reports", icon: FileSpreadsheet },
  { name: "Companies House officer import", anchor: "#companies-house-import", icon: Building2 },
  { name: "Shareholders & cap table snapshot", anchor: "#cap-table-snapshot", icon: PieChart },
  { name: "Branding & templates", anchor: "#branding-templates", icon: Palette },
  { name: "Exports & accounting integrations", anchor: "#exports-integrations", icon: Download },
];

export const AtAGlanceGrid = () => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    const element = document.querySelector(anchor);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Dividify at a glance</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <a
              key={feature.anchor}
              href={feature.anchor}
              onClick={(e) => scrollToSection(e, feature.anchor)}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-brand-purple hover:shadow-md transition-all group"
            >
              <feature.icon className="w-5 h-5 text-brand-purple flex-shrink-0" />
              <span className="text-gray-700 group-hover:text-brand-purple transition-colors">
                {feature.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
