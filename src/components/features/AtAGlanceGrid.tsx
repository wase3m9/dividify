import { Link } from "react-router-dom";
import { FileText, BarChart3, FileSpreadsheet, Building2, PieChart, Layers, Palette, Download } from "lucide-react";

const features = [
  { name: "Dividend voucher generator", link: "/features/dividend-vouchers", icon: FileText, color: "from-violet-500 to-purple-600", isPage: true },
  { name: "Board minutes generator", link: "/features/board-minutes", icon: FileText, color: "from-blue-500 to-indigo-600", isPage: true },
  { name: "Board pack generator", link: "/features/board-packs", icon: Layers, color: "from-emerald-500 to-teal-600", isPage: true },
  { name: "Dividend tracker & analytics", link: "/features/dividend-tracker", icon: BarChart3, color: "from-orange-500 to-amber-600", isPage: true },
  { name: "Annual summary reports (PDF & Excel)", anchor: "#annual-summary-reports", icon: FileSpreadsheet, color: "from-rose-500 to-pink-600" },
  { name: "Companies House officer import", anchor: "#companies-house-import", icon: Building2, color: "from-cyan-500 to-blue-600" },
  { name: "Shareholders & cap table snapshot", anchor: "#cap-table-snapshot", icon: PieChart, color: "from-fuchsia-500 to-purple-600" },
  { name: "Branding & templates", anchor: "#branding-templates", icon: Palette, color: "from-lime-500 to-green-600" },
  { name: "Exports & accounting integrations", anchor: "#exports-integrations", icon: Download, color: "from-sky-500 to-indigo-600" },
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
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Dividify at a glance</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage dividends professionally
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            feature.isPage ? (
              <Link
                key={feature.link}
                to={feature.link!}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-purple/20 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon container */}
                <div className={`relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Text */}
                <h3 className="relative text-gray-900 font-semibold text-lg group-hover:text-brand-purple transition-colors duration-300">
                  {feature.name}
                </h3>
                
                {/* Arrow indicator */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <svg className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ) : (
              <a
                key={feature.anchor}
                href={feature.anchor}
                onClick={(e) => scrollToSection(e, feature.anchor!)}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-purple/20 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon container */}
                <div className={`relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Text */}
                <h3 className="relative text-gray-900 font-semibold text-lg group-hover:text-brand-purple transition-colors duration-300">
                  {feature.name}
                </h3>
                
                {/* Arrow indicator */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <svg className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </a>
            )
          ))}
        </div>
      </div>
    </section>
  );
};
