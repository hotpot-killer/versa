import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    History,
    Copy,
    Menu,
    Sun,
    Github
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { ResultView } from './components/ResultView';

const API_BASE = "http://localhost:8000/api";

export default function App() {
    const [activeTab, setActiveTab] = useState<'weekly' | 'xhs' | 'email' | 'meeting' | 'history'>('weekly');
    const [rawContent, setRawContent] = useState('');
    const [result, setResult] = useState<any>('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [copying, setCopying] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [role, setRole] = useState('高级产品经理');

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab]);

    const fetchHistory = async () => {
        try {
            const response = await axios.get(`${API_BASE}/history`);
            setHistory(response.data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        }
    };

    const handleGenerate = async () => {
        if (!rawContent.trim()) return;
        setLoading(true);
        setResult('');

        try {
            const typeMap = {
                'weekly': 'WEEKLY_REPORT',
                'xhs': 'XHS_STYLE',
                'email': 'EMAIL_POLISH',
                'meeting': 'MEETING_MINUTES'
            };

            const response = await fetch(`${API_BASE}/generate_stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    taskType: typeMap[activeTab as keyof typeof typeMap],
                    rawContent: rawContent,
                    role: activeTab === 'weekly' ? role : undefined
                })
            });

            if (!response.body) throw new Error("No body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResult = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6).trim();
                        if (dataStr === '[DONE]') break;
                        try {
                            const data = JSON.parse(dataStr);
                            accumulatedResult += data.content;
                            setResult(accumulatedResult);
                        } catch (e) {
                            console.error("Error parsing stream chunk", e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Generation failed", error);
            setResult("生成失败，请检查后端服务是否开启。");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopying(true);
        setTimeout(() => setCopying(false), 2000);
    };

    return (
        <div className="flex min-h-screen bg-[#fcfcfd] text-slate-800 overflow-hidden font-sans selection:bg-brand-500/20">
            {/* --- Subtle Background Elements --- */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/5 blur-[100px] rounded-full" />
            </div>

            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarOpen={sidebarOpen}
            />

            {/* --- Main Content --- */}
            <main className="flex-1 relative z-10 h-screen flex flex-col">
                {/* Header */}
                <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-900">
                            <Menu size={18} />
                        </button>
                        <div className="h-4 w-px bg-slate-200 mx-1" />
                        <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                            {activeTab === 'weekly' ? 'Weekly Expert' :
                                activeTab === 'xhs' ? 'Copy Workshop' :
                                    activeTab === 'email' ? 'Email Consultant' :
                                        activeTab === 'meeting' ? 'Meeting Archive' : 'Shared Archive'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-900 transition-colors"><Sun size={18} /></button>
                        <button className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-full text-xs font-bold transition-all shadow-sm">
                            <Github size={14} />
                            <span>Star on Github</span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {activeTab !== 'history' ? (
                            <motion.div
                                key="editor-view"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full"
                            >
                                <Editor
                                    activeTab={activeTab}
                                    rawContent={rawContent}
                                    setRawContent={setRawContent}
                                    handleGenerate={handleGenerate}
                                    loading={loading}
                                    role={role}
                                    setRole={setRole}
                                />
                                <ResultView
                                    result={result}
                                    copying={copying}
                                    handleCopy={handleCopy}
                                />
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {history.map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.02 }}
                                        className="group bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border-2 bg-black text-white border-black">
                                                {item.task_type}
                                            </div>
                                            <span className="text-[9px] text-slate-900 font-black">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="h-32 overflow-hidden border-b border-slate-100 mb-2">
                                            <div className="text-sm text-black line-clamp-5 leading-relaxed font-bold">
                                                {typeof item.generated_result === 'string' ? item.generated_result : JSON.stringify(item.generated_result)}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleCopy(typeof item.generated_result === 'string' ? item.generated_result : JSON.stringify(item.generated_result, null, 2))}
                                                className="flex-1 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase flex items-center justify-center gap-2 active:scale-95 transition-all"
                                            >
                                                <Copy size={11} /> Quick Copy
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                                {history.length === 0 && (
                                    <div className="col-span-full h-80 flex flex-col items-center justify-center text-slate-200 gap-4">
                                        <History size={48} className="opacity-20" />
                                        <p className="text-xs uppercase tracking-[0.2em] font-black text-slate-300">No Archives Found</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
