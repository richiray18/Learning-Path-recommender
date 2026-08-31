import React from 'react';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Target,
  FolderGit2,
  CheckSquare,
  LineChart,
  Award,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useLearningPath } from '../../context/LearningPathContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { activeTab, setActiveTab, profile } = useLearningPath();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'roadmap', label: 'My Learning Path', icon: Compass },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'skills', label: 'Skills', icon: Target },
    { id: 'projects', label: 'Projects', icon: FolderGit2, count: '3' },
    { id: 'assessments', label: 'Assessments', icon: CheckSquare },
    { id: 'progress', label: 'Progress', icon: LineChart },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative z-20 border-r border-[#E3DED3] bg-[#FFFFFF] flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top Section */}
      <div className="p-3 space-y-3">
        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#E6EEE5] text-[#315C43] font-semibold border border-[#D3E0D2]'
                    : 'text-[#6E6E68] hover:text-[#262626] hover:bg-[#F7F5EF] border border-transparent'
                }`}
                title={item.label}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#315C43]' : 'text-[#8E8D88]'
                  }`}
                />
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span>{item.label}</span>
                    {item.count && (
                      <span className="text-[10px] text-[#6E6E68] bg-[#F1E9DA] px-1.5 py-0.5 rounded font-mono font-medium">
                        {item.count}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section - Profile & Collapse */}
      <div className="p-3 border-t border-[#E3DED3] space-y-2">
        {/* Learner Profile Info */}
        {!collapsed ? (
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F7F5EF] transition-colors cursor-pointer"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-9 h-9 rounded-full object-cover border border-[#E3DED3] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[#262626] truncate">{profile.name}</div>
              <div className="text-[11px] text-[#6E6E68] truncate">Machine Learning Engineer Aspirant</div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setActiveTab('profile')}
            className="flex justify-center p-1 cursor-pointer"
            title={`${profile.name} - Machine Learning Engineer Aspirant`}
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover border border-[#E3DED3]"
            />
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex w-full items-center justify-center py-2 text-[#8E8D88] hover:text-[#262626] hover:bg-[#F7F5EF] rounded-lg text-xs transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="ml-1 text-[11px] font-medium text-[#6E6E68]">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};
