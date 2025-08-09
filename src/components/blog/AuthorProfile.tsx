interface AuthorProfileProps {
  name: string;
  title: string;
  avatarUrl: string;
  bio?: string;
  credentials?: string[];
}

export const AuthorProfile = ({ name, title, avatarUrl, bio, credentials }: AuthorProfileProps) => {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-xl border mt-12 mb-8">
      <div className="flex items-start space-x-6">
        <img 
          src={avatarUrl} 
          alt={name}
          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
          <p className="text-[#9b87f5] font-semibold mb-3">{title}</p>
          
          {bio && (
            <p className="text-gray-700 leading-relaxed mb-4">
              {bio}
            </p>
          )}
          
          {credentials && credentials.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {credentials.map((credential, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-[#9b87f5] text-white text-sm rounded-full"
                >
                  {credential}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};