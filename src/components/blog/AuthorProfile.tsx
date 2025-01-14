interface AuthorProfileProps {
  name: string;
  title: string;
  avatarUrl: string;
}

export const AuthorProfile = ({ name, title, avatarUrl }: AuthorProfileProps) => {
  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-4">
        <img
          src="/lovable-uploads/b1d3373c-0b1e-46e4-84a4-8769530ab8e1.png"
          alt={name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-gray-600">{title}</p>
        </div>
      </div>
    </div>
  );
};