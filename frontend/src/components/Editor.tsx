import React from 'react';
import { Zap, Send } from 'lucide-react';

interface EditorProps {
    activeTab: string;
    rawContent: string;
    setRawContent: (content: string) => void;
    handleGenerate: () => void;
    loading: boolean;
    role?: string;
    setRole?: (role: string) => void;
}

export const Editor: React.FC<EditorProps> = ({
    activeTab,
    rawContent,
    setRawContent,
    handleGenerate,
    loading,
    role,
    setRole
}) => {
    return (
        <div className="flex flex-col gap-3 h-full min-h-[500px]">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
                    <Zap className="text-brand-600" size={14} />
                    Input Context
                </div>
                {activeTab === 'weekly' && setRole && (
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase text-slate-400">Role:</span>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="text-[10px] font-bold bg-slate-100 border-none rounded-md px-2 py-1 outline-none"
                        >
                            <option value="高级产品经理">高级产品经理</option>
                            <option value="资深后端架构师">资深后端架构师</option>
                            <option value="前端开发专家">前端开发专家</option>
                            <option value="项目管理专家">项目管理专家</option>
                        </select>
                    </div>
                )}
            </div>
            <div className="flex-1 relative group">
                <textarea
                    value={rawContent}
                    onChange={(e) => setRawContent(e.target.value)}
                    placeholder={
                        activeTab === 'weekly' ? "输入你的工作碎片，例如：联调支付接口、重构登录逻辑..." :
                            activeTab === 'xhs' ? "输入文案关键词，例如：#咖啡店 #打卡圣地 #秋天第一杯奶茶..." :
                                activeTab === 'email' ? "输入草稿，例如：明天下午两点开会，讨论下个季度的计划..." :
                                    "输入会议笔记片段..."
                    }
                    className="w-full h-full bg-white border-2 border-slate-200 rounded-2xl p-8 outline-none focus:border-brand-600 transition-all text-black font-medium resize-none font-sans text-base leading-relaxed placeholder:text-slate-400 shadow-sm"
                />
                <div className="absolute bottom-6 right-6">
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !rawContent.trim()}
                        className="px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all flex items-center gap-3 active:scale-95 shadow-lg shadow-brand-500/20"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className="uppercase tracking-tight">Run Optimization</span>
                                <Send size={16} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
