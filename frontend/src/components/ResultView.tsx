import React from 'react';
import { Sparkles, Copy, Check, Coffee } from 'lucide-react';

interface ResultViewProps {
    result: any;
    copying: boolean;
    handleCopy: (text: string) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, copying, handleCopy }) => {
    const RenderResult = ({ content }: { content: any }) => {
        if (!content) return null;

        if (typeof content === 'string') {
            return <div className="whitespace-pre-wrap">{content}</div>;
        }

        if (typeof content === 'object') {
            return (
                <div className="space-y-4">
                    {Object.entries(content).map(([key, value]) => (
                        <div key={key}>
                            <h3 className="font-black text-brand-700 text-sm uppercase tracking-wider mb-1">{key}</h3>
                            {Array.isArray(value) ? (
                                <ol className="list-decimal list-inside space-y-1">
                                    {value.map((item, i) => (
                                        <li key={i} className="text-slate-800">{String(item)}</li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-slate-800">{String(value)}</p>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        return <div>{String(content)}</div>;
    };

    return (
        <div className="flex flex-col gap-3 h-full min-h-[500px]">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-brand-700 uppercase tracking-widest leading-none">
                    <Sparkles size={14} />
                    AI Intelligence Output
                </div>
                {result && (
                    <button
                        onClick={() => handleCopy(typeof result === 'string' ? result : JSON.stringify(result, null, 2))}
                        className="flex items-center gap-2 px-3 py-1 hover:bg-slate-100 rounded-lg text-[10px] font-black text-slate-900 border-2 border-slate-200 uppercase tracking-tighter"
                    >
                        {copying ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                        {copying ? 'Stored to Clipboard' : 'Copy Full Text'}
                    </button>
                )}
            </div>
            <div className="flex-1 bg-white border-2 border-slate-100 rounded-2xl p-8 overflow-y-auto relative shadow-sm">
                {result ? (
                    <div className="prose prose-slate max-w-none prose-brand animate-in fade-in duration-700">
                        <div className="text-black leading-relaxed font-sans text-[17px] font-medium">
                            <RenderResult content={result} />
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                        <Coffee size={40} className="opacity-20 translate-y-2 animate-bounce" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Engine Idle</p>
                    </div>
                )}
            </div>
        </div>
    );
};
