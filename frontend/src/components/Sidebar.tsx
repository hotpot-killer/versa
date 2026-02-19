import React from 'react';
import {
    FileText,
    Smartphone,
    History,
    ChevronRight,
    Sparkles,
    Zap,
    Mail,
    Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SidebarProps {
    activeTab: 'weekly' | 'xhs' | 'email' | 'meeting' | 'history';
    setActiveTab: (tab: any) => void;
    sidebarOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, sidebarOpen }) => {
    const SidebarItem = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group",
                activeTab === id
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                    : "text-slate-700 hover:bg-slate-50"
            )}
        >
            <Icon size={20} className={cn(activeTab === id ? "text-white" : "group-hover:text-brand-600")} />
            {sidebarOpen && <span className="font-bold">{label}</span>}
            {sidebarOpen && activeTab === id && (
                <motion.div layoutId="indicator" className="ml-auto">
                    <ChevronRight size={16} />
                </motion.div>
            )}
        </button>
    );

    return (
        <aside className={cn(
            "relative z-20 h-screen border-r border-slate-200 bg-white transition-all duration-500 flex flex-col items-center py-8",
            sidebarOpen ? "w-72" : "w-20"
        )}>
            <div className="flex items-center gap-3 mb-10 px-6">
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 flex-shrink-0">
                    <Sparkles className="text-white" size={20} />
                </div>
                {sidebarOpen && <span className="text-xl font-bold tracking-tight text-slate-900 px-2 leading-none">Versa AI</span>}
            </div>

            <nav className="flex-1 w-full px-4 space-y-1">
                <SidebarItem id="weekly" icon={FileText} label="AI周报助手" />
                <SidebarItem id="xhs" icon={Smartphone} label="小红书文案工坊" />
                <SidebarItem id="email" icon={Mail} label="邮件润色专家" />
                <SidebarItem id="meeting" icon={Users} label="会议纪要提炼" />
                <SidebarItem id="history" icon={History} label="创作历史" />
            </nav>

            <div className="mt-auto px-4 w-full">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] text-slate-900 uppercase tracking-widest font-bold">
                        <Zap size={12} className="text-brand-600" />
                        <span>引擎状态</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                        {sidebarOpen && <span className="text-xs font-bold text-slate-800 uppercase tracking-tighter">DeepSeek Active</span>}
                    </div>
                </div>
            </div>
        </aside>
    );
};
