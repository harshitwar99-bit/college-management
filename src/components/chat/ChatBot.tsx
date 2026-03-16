"use client";

import { useState } from "react";
import { MessageCircle, X, ExternalLink, ChevronRight, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
    {
        question: "What courses are offered at ITS Ghaziabad?",
        answer: "ITS Ghaziabad primarily offers PG courses like MBA & MCA, along with UG courses like BCA. The MBA program has 240 seats."
    },
    {
        question: "Is ITS Ghaziabad AICTE approved?",
        answer: "Yes, ITS - Institute of Technology & Science is approved by AICTE. It also holds an A+ Grade by NAAC and is NBA accredited."
    },
    {
        question: "What are the prominent rankings of the institute?",
        answer: "ITS Ghaziabad is ranked 1st in UP and 2nd in the Northern Region by GHRDC MCA Colleges Survey 2025. It is also ranked #19 for BCA by Outlook."
    },
    {
        question: "Who are the top recruiters for MBA/MCA?",
        answer: "Top companies visiting for placements include L’Oreal, Zydus Cadilla, Ultra Tech Cement, Reliance, and IndusInd Bank."
    },
    {
        question: "How can I contact the admission office?",
        answer: "You can reach the admission office at 8447744041 or email admissions.mn@its.edu.in. The campus is located at Mohan Nagar, Ghaziabad."
    }
];

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFAQ, setSelectedFAQ] = useState<number | null>(null);

    return (
        <div className="fixed bottom-24 right-5 lg:bottom-8 lg:right-8 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            <div className={cn(
                "glass-card overflow-hidden transition-all duration-300 origin-bottom-right mb-4 border border-blue-500/20 shadow-2xl shadow-blue-900/20 flex flex-col",
                isOpen ? "scale-100 opacity-100 w-[320px] h-[400px]" : "scale-50 opacity-0 w-[320px] h-0 pointer-events-none"
            )}>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <HelpCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">EduBot Support</h3>
                            <p className="text-blue-200 text-xs">Always here to help</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-1 rounded transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-900/50">
                    {selectedFAQ === null ? (
                        <div className="space-y-3">
                            <div className="bg-slate-800 p-3 rounded-xl rounded-tl-sm text-sm text-slate-300 w-[90%] shadow-md">
                                👋 Hi there! I&apos;m EduBot. How can I help you today? Here are some frequently asked questions:
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                                {FAQS.map((faq, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedFAQ(i)}
                                        className="text-left bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 p-3 rounded-xl text-sm text-blue-300 transition-colors flex items-center justify-between group"
                                    >
                                        <span className="line-clamp-2 pr-2">{faq.question}</span>
                                        <ChevronRight className="w-4 h-4 flex-shrink-0 text-blue-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <button
                                onClick={() => setSelectedFAQ(null)}
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mb-2"
                            >
                                <ChevronRight className="w-3 h-3 rotate-180" /> Back to questions
                            </button>

                            <div className="bg-blue-500/10 p-3 rounded-xl rounded-tr-sm text-sm text-blue-300 w-[90%] self-end ml-auto border border-blue-500/20">
                                {FAQS[selectedFAQ].question}
                            </div>

                            <div className="bg-slate-800 p-3 rounded-xl rounded-tl-sm text-sm text-slate-300 w-[90%] shadow-md">
                                {FAQS[selectedFAQ].answer}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Input Mock */}
                <div className="p-3 border-t border-white/5 bg-slate-900 flex-shrink-0">
                    <div className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center justify-between opacity-50 cursor-not-allowed">
                        <span className="text-xs text-slate-500">Ask a custom question...</span>
                        <ExternalLink className="w-4 h-4 text-slate-500" />
                    </div>
                </div>
            </div>

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 z-50",
                    isOpen ? "bg-slate-800 shadow-none border border-white/10 text-slate-400" : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/30"
                )}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
        </div>
    );
}
