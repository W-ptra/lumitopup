import { Mail, Calendar, ShieldCheck } from "lucide-react";

type UserData = { 
  id: string; 
  name: string; 
  email: string; 
  role: "ADMIN" | "USER"; 
  joinedDate: string; 
  image: string; 
};

interface UserCardProps {
  user: UserData;
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all group">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img 
            src={user.image} 
            alt={user.name} 
            className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 object-cover" 
          />
          {user.role === "ADMIN" && (
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white p-1 rounded-full border-2 border-white">
              <ShieldCheck size={12} />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-gray-800 text-lg truncate leading-tight">{user.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <img 
              src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" 
              alt="G" 
              className="w-3 h-3" 
            />
            <span className="text-[10px] font-bold text-gray-400 uppercase">Google Verified</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-gray-500">
          <Mail size={14} className="text-[#7491F7]" />
          <p className="text-xs font-semibold truncate">{user.email}</p>
        </div>
        <div className="flex items-center gap-3 text-gray-500">
          <Calendar size={14} className="text-[#7491F7]" />
          <p className="text-xs font-semibold uppercase tracking-tighter">Joined {user.joinedDate}</p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;