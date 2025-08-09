interface CategoryBadgeProps {
  category: string;
  variant?: "default" | "primary" | "secondary";
}

export const CategoryBadge = ({ category, variant = "primary" }: CategoryBadgeProps) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    primary: "bg-[#9b87f5] text-white hover:bg-[#7E69AB]",
    secondary: "bg-blue-100 text-blue-800 hover:bg-blue-200"
  };

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
      transition-colors cursor-pointer
      ${variants[variant]}
    `}>
      {category}
    </span>
  );
};