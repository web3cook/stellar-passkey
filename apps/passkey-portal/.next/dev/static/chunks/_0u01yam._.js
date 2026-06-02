(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/WalletCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WalletCard",
    ()=>WalletCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function WalletCard({ contractId, balance, loading }) {
    _s();
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function handleCopy() {
        await navigator.clipboard.writeText(contractId);
        setCopied(true);
        setTimeout(()=>setCopied(false), 1500);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl p-px",
        style: {
            background: 'linear-gradient(135deg, #1a2e5c, #2563eb, #7ba8d9)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl p-6 flex flex-col gap-4",
            style: {
                background: 'linear-gradient(135deg, #1a2e5c 0%, #243f7a 100%)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs font-semibold uppercase tracking-widest",
                            style: {
                                color: '#7ba8d9'
                            },
                            children: "Smart Account"
                        }, void 0, false, {
                            fileName: "[project]/components/WalletCard.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs px-2.5 py-0.5 rounded-full font-medium",
                            style: {
                                color: '#2563eb',
                                background: '#eff6ff'
                            },
                            children: "Testnet"
                        }, void 0, false, {
                            fileName: "[project]/components/WalletCard.tsx",
                            lineNumber: 25,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/WalletCard.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-mono text-xs flex-1 truncate",
                            style: {
                                color: '#aecbef'
                            },
                            children: contractId
                        }, void 0, false, {
                            fileName: "[project]/components/WalletCard.tsx",
                            lineNumber: 29,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleCopy,
                            className: "text-xs px-2.5 py-1 rounded-lg border transition-all shrink-0 font-medium",
                            style: {
                                color: copied ? '#7ba8d9' : '#aecbef',
                                borderColor: 'rgba(174,203,239,0.3)'
                            },
                            children: copied ? 'Copied!' : 'Copy'
                        }, void 0, false, {
                            fileName: "[project]/components/WalletCard.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/WalletCard.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs block mb-1",
                            style: {
                                color: '#7ba8d9'
                            },
                            children: "Balance"
                        }, void 0, false, {
                            fileName: "[project]/components/WalletCard.tsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this),
                        loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-8 w-32 rounded-lg animate-pulse",
                            style: {
                                background: 'rgba(255,255,255,0.08)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/WalletCard.tsx",
                            lineNumber: 42,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-3xl font-bold text-white",
                            children: [
                                balance ?? '—',
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-lg",
                                    style: {
                                        color: '#7ba8d9'
                                    },
                                    children: "XLM"
                                }, void 0, false, {
                                    fileName: "[project]/components/WalletCard.tsx",
                                    lineNumber: 45,
                                    columnNumber: 32
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/WalletCard.tsx",
                            lineNumber: 44,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/WalletCard.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/WalletCard.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/WalletCard.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_s(WalletCard, "NE86rL3vg4NVcTTWDavsT0hUBJs=");
_c = WalletCard;
var _c;
__turbopack_context__.k.register(_c, "WalletCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/TransferModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransferModal",
    ()=>TransferModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function TransferModal({ onClose, onTransfer }) {
    _s();
    const [recipient, setRecipient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [amount, setAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('pending');
        setError(null);
        try {
            await onTransfer(recipient, amount);
            setStatus('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Transfer failed');
            setStatus('error');
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center px-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 backdrop-blur-sm bg-slate-900/40",
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/components/TransferModal.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold",
                                style: {
                                    color: '#1a2e5c'
                                },
                                children: "Send XLM"
                            }, void 0, false, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "text-xl leading-none text-slate-400 hover:text-slate-600 transition-colors",
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/TransferModal.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    status === 'success' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-4xl mb-3",
                                children: "✅"
                            }, void 0, false, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 40,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-bold text-lg mb-1",
                                style: {
                                    color: '#1a2e5c'
                                },
                                children: "Transfer submitted"
                            }, void 0, false, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 41,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-500",
                                children: "Transaction signed and sent to the network"
                            }, void 0, false, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 42,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "mt-6 w-full py-2.5 rounded-xl font-bold text-white transition-all",
                                style: {
                                    background: '#2563eb'
                                },
                                children: "Done"
                            }, void 0, false, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 43,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/TransferModal.tsx",
                        lineNumber: 39,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "flex flex-col gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs font-semibold mb-1.5 uppercase tracking-wide text-slate-500",
                                        children: "Recipient Address"
                                    }, void 0, false, {
                                        fileName: "[project]/components/TransferModal.tsx",
                                        lineNumber: 54,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: recipient,
                                        onChange: (e)=>setRecipient(e.target.value),
                                        placeholder: "G… or C…",
                                        required: true,
                                        className: "w-full rounded-xl px-3 py-2.5 font-mono text-sm border border-slate-200 outline-none transition-colors focus:border-blue-400 bg-slate-50 placeholder-slate-300",
                                        style: {
                                            color: '#1a2e5c'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/TransferModal.tsx",
                                        lineNumber: 57,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs font-semibold mb-1.5 uppercase tracking-wide text-slate-500",
                                        children: "Amount (XLM)"
                                    }, void 0, false, {
                                        fileName: "[project]/components/TransferModal.tsx",
                                        lineNumber: 69,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: amount,
                                        onChange: (e)=>setAmount(e.target.value),
                                        placeholder: "0.00",
                                        min: "0.0000001",
                                        step: "any",
                                        required: true,
                                        className: "w-full rounded-xl px-3 py-2.5 text-sm border border-slate-200 outline-none transition-colors focus:border-blue-400 bg-slate-50 placeholder-slate-300",
                                        style: {
                                            color: '#1a2e5c'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/TransferModal.tsx",
                                        lineNumber: 72,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 68,
                                columnNumber: 13
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-100",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 86,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: status === 'pending',
                                className: "w-full py-2.5 rounded-xl font-bold text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm",
                                style: {
                                    background: '#2563eb'
                                },
                                children: status === 'pending' ? 'Signing with passkey…' : '🔑 Sign with Passkey'
                            }, void 0, false, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/TransferModal.tsx",
                        lineNumber: 52,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/TransferModal.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/TransferModal.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_s(TransferModal, "gXZ1ksSqawj7wFwUqnQ8vJYKDs0=");
_c = TransferModal;
var _c;
__turbopack_context__.k.register(_c, "TransferModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/RFPViewer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RFPViewer",
    ()=>RFPViewer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
const RFP_HTML = `
<h1>SCF RFP Proposal: Passkey UI for Stellar Smart Accounts</h1>

<h2>1. Problem Statement</h2>
<p>Every Stellar wallet today requires users to manage a seed phrase or private key. This is the single biggest barrier to adoption for non-technical users:</p>
<ul>
  <li><strong>Seed phrases are fragile.</strong> Lose it, expose it, or mistype it, and the wallet is gone forever. There is no recovery.</li>
  <li><strong>Browser extension wallets</strong> (Freighter, Rabet, xBull) require a separate install step before a user can interact with any dApp. Most users abandon at this point.</li>
  <li><strong>Hardware wallets</strong> (Ledger, Trezor) add cost and friction that everyday users will not accept.</li>
  <li><strong>Custodial alternatives</strong> trade security for convenience, reintroducing the counterparty risk that blockchains exist to eliminate.</li>
</ul>
<p>Passkeys solve this. They are already how billions of users authenticate with their banks, Apple ID, and Google accounts. They require no install, no seed phrase, and no new mental model. Stellar's Protocol 21 added native support for the cryptography passkeys use. What is missing is a <strong>documented, reusable, production-quality SDK and UI layer</strong> integrated with stellar-wallet-kit that Stellar wallet developers can actually ship.</p>

<h2>2. What Are Passkeys and How They Work</h2>
<h3>Background</h3>
<p>Passkeys are a W3C/FIDO2 standard (WebAuthn) that replace passwords and seed phrases with cryptographic keys stored securely on a user's device, protected by biometrics (Face ID, Touch ID, fingerprint) or device PIN. They were designed by Apple, Google, and Microsoft under the FIDO Alliance, and are now supported natively on every major OS and browser.</p>
<p>Unlike passwords, passkeys are:</p>
<ul>
  <li><strong>Phishing-resistant</strong>: cryptographically bound to the origin (domain) they were created on; a fake site cannot trick the device into signing</li>
  <li><strong>Non-exportable</strong>: the private key is stored in the device's secure enclave and never leaves it</li>
  <li><strong>Cross-device sync-capable</strong>: via iCloud Keychain (Apple devices) or Google Password Manager (Android/Chrome)</li>
  <li><strong>Already familiar</strong>: users already use biometrics to unlock their phone, banking app, and laptop</li>
</ul>

<h3>The Cryptography</h3>
<p>Passkeys use <strong>P-256 (secp256r1)</strong> elliptic curve cryptography. When a user registers a passkey:</p>
<ol>
  <li>The device generates a P-256 key pair inside the secure enclave</li>
  <li>The <strong>public key</strong> is returned to the application and stored in the smart contract</li>
  <li>The <strong>private key</strong> never leaves the device</li>
</ol>

<h3>Why This Matters for Wallets</h3>
<p>Traditional blockchain wallets require users to understand and protect a private key directly. Passkeys move the key into the OS security layer — the same layer that protects Apple Pay, Windows Hello, and Android Keystore. The user interacts only with a familiar biometric prompt.</p>

<h2>3. Passkeys on Stellar</h2>
<h3>Protocol 21 and secp256r1</h3>
<p>Stellar's Protocol 21 (live on Mainnet) introduced native secp256r1 signature verification inside Soroban smart contracts (CAP-0051). With Protocol 21, a passkey can directly authorize a Soroban transaction with no bridging, no wrapping, and no trusted intermediary.</p>

<h3>Smart Wallet Architecture</h3>
<p>On Stellar, a passkey wallet is a <strong>Soroban smart contract</strong>, not a key pair. The contract maintains a list of authorized signers, and one of those signers is a passkey (a P-256 public key).</p>
<pre><code>User's Wallet = Soroban Smart Contract
  └── Signer 1: Passkey (P-256 public key from device)
  └── Signer 2: Backup Ed25519 keypair (recovery)
  └── Signer N: Additional passkeys, session keys, policies...</code></pre>

<h2>4. Platform Compatibility Matrix</h2>
<h3>Browsers (Desktop)</h3>
<table>
  <thead>
    <tr><th>Browser</th><th>Passkey Support</th><th>Platform Authenticator</th><th>Credential Sync</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>Chrome 106+</td><td>✅ Full</td><td>✅ Yes</td><td>✅ Google Password Manager</td><td>Recommended primary target</td></tr>
    <tr><td>Edge 106+</td><td>✅ Full</td><td>✅ Yes</td><td>✅ Windows Hello</td><td>Chromium-based; identical to Chrome</td></tr>
    <tr><td>Safari 16+</td><td>✅ Full</td><td>✅ Yes</td><td>✅ iCloud Keychain</td><td>Required path for iOS</td></tr>
    <tr><td>Firefox 122+</td><td>⚠️ Partial</td><td>❌ No</td><td>❌ No</td><td>No biometric platform authenticator</td></tr>
    <tr><td>Brave</td><td>✅ Full</td><td>✅ Yes</td><td>✅ Via OS</td><td>Works identically to Chrome</td></tr>
  </tbody>
</table>

<h3>Operating Systems / Mobile</h3>
<table>
  <thead>
    <tr><th>Platform</th><th>Support</th><th>Authenticator</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>macOS 13+ (Ventura)</td><td>✅ Full</td><td>Touch ID / iCloud Keychain</td><td>Syncs across all Apple devices</td></tr>
    <tr><td>iOS 16+</td><td>✅ Full</td><td>Face ID / Touch ID</td><td>Smoothest mobile experience</td></tr>
    <tr><td>Android 9+ (Chrome)</td><td>✅ Full</td><td>Fingerprint / face unlock</td><td>Requires Google Play Services</td></tr>
    <tr><td>Windows 10/11</td><td>✅ Full</td><td>Windows Hello</td><td>Works on Edge and Chrome</td></tr>
    <tr><td>Linux (desktop)</td><td>⚠️ Partial</td><td>Hardware keys only</td><td>No platform authenticator</td></tr>
  </tbody>
</table>

<h2>5. Implementation Plan</h2>
<h3>Approach</h3>
<p>The existing ecosystem has the hard parts solved at the protocol and contract level (OpenZeppelin stellar-contracts) and at the full-featured SDK level (smart-account-kit). What is missing is the minimal, approachable middle layer.</p>

<h3>Package Architecture</h3>
<pre><code>packages/
  passkey-sdk/          # WebAuthn ceremonies + Soroban signature formatting
  passkey-ui/           # Headless UI components (Web Components)
  wallets-kit-adapter/  # stellar-wallets-kit connector
apps/
  demo/                 # End-to-end demo (Vite + TypeScript)</code></pre>

<h3>Key Technical Decisions</h3>
<table>
  <thead>
    <tr><th>Decision</th><th>Choice</th><th>Reason</th></tr>
  </thead>
  <tbody>
    <tr><td>On-chain contracts</td><td>OpenZeppelin stellar-contracts</td><td>Already deployed, partially audited, modular verifiers</td></tr>
    <tr><td>WebAuthn library</td><td>@simplewebauthn/browser</td><td>Smallest proven abstraction; normalizes browser differences</td></tr>
    <tr><td>UI approach</td><td>Headless Web Components</td><td>Framework-agnostic; developer owns styling</td></tr>
    <tr><td>Stellar SDK</td><td>@stellar/stellar-sdk</td><td>Required for Soroban transaction construction</td></tr>
    <tr><td>Test framework</td><td>Vitest</td><td>Fast; native ESM; TypeScript-native</td></tr>
  </tbody>
</table>

<h3>Timeline</h3>
<table>
  <thead>
    <tr><th>Month</th><th>Focus</th><th>Deliverables</th></tr>
  </thead>
  <tbody>
    <tr><td>Month 1</td><td>Research and compatibility docs</td><td>compatibility-matrix.md and usage-patterns.md</td></tr>
    <tr><td>Month 2</td><td>Core SDK</td><td>packages/passkey-sdk: WebAuthn ceremony wrappers, Soroban payload formatter, full Vitest suite</td></tr>
    <tr><td>Month 3</td><td>Headless UI components</td><td>packages/passkey-ui: register, sign, recover Web Components</td></tr>
    <tr><td>Month 4</td><td>Wallets Kit adapter</td><td>packages/wallets-kit-adapter + PR into official repo</td></tr>
    <tr><td>Month 5</td><td>Hardening and delivery</td><td>Final docs, end-to-end demo on testnet, public blog post</td></tr>
  </tbody>
</table>

<h2>6. About the Team</h2>
<p><strong>SmartCloud</strong> is a two-engineer studio that builds production systems for agent and infrastructure teams.</p>

<h3>Rohit Aggarwal: Founder / CTO, Web3 Protocols</h3>
<p>Rohit is the Founder/CTO of <strong>Raga Finance</strong> and <strong>Nexus Network</strong>. He previously led EVM development at <strong>pSTAKE Finance</strong>, building liquid staking on BNB/Ethereum and cross-chain L2 staking via LayerZero. He is an alumnus of <strong>IIT Bombay</strong> and has deep experience designing minimal, production-quality protocol SDKs and smart contract systems.</p>

<h3>Anmol Yadav: Infrastructure + Agents Engineer</h3>
<p>Anmol specializes in Kubernetes-native platforms and agent infrastructure. He is the maintainer of <strong>Starship</strong>, the Kubernetes-native multi-chain devnet adopted across the Cosmos ecosystem and co-founder of <strong>Constructive</strong>.</p>

<h2>7. Milestone Breakdown</h2>
<table>
  <thead>
    <tr><th>Milestone</th><th>Deliverable</th><th>Verification</th><th>Funding</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>M1</strong> Compatibility Research</td><td>docs/compatibility-matrix.md and docs/usage-patterns.md published</td><td>Reviewers can inspect the matrix, reproduce test cases</td><td>Tranche 1</td></tr>
    <tr><td><strong>M2</strong> Passkey SDK</td><td>packages/passkey-sdk published with startRegistration(), startAuthentication(), buildSignaturePayload()</td><td>npm install + run tests; read API docs</td><td>Tranche 2</td></tr>
    <tr><td><strong>M3</strong> UI Components</td><td>packages/passkey-ui Web Components for register, sign, and recover flows</td><td>Load demo app; test each flow in Chrome, Safari, Firefox</td><td>Tranche 3</td></tr>
    <tr><td><strong>M4</strong> Wallets Kit Adapter</td><td>packages/wallets-kit-adapter + PR into official @creit-tech/stellar-wallets-kit repo</td><td>Review the PR; run the demo app end-to-end</td><td>Tranche 4</td></tr>
    <tr><td><strong>M5</strong> Delivery</td><td>All docs finalized. Public blog post published. Full demo working on Testnet.</td><td>End-to-end demo walkthrough; blog post live</td><td></td></tr>
  </tbody>
</table>
`;
function RFPViewer() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rfp-content prose-invert max-w-none",
        dangerouslySetInnerHTML: {
            __html: RFP_HTML
        }
    }, void 0, false, {
        fileName: "[project]/components/RFPViewer.tsx",
        lineNumber: 144,
        columnNumber: 5
    }, this);
}
_c = RFPViewer;
var _c;
__turbopack_context__.k.register(_c, "RFPViewer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/kit.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getKit",
    ()=>getKit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$smart$2d$account$2d$kit$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/smart-account-kit/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$smart$2d$account$2d$kit$2f$dist$2f$kit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/smart-account-kit/dist/kit.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$smart$2d$account$2d$kit$2f$dist$2f$storage$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/smart-account-kit/dist/storage/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$smart$2d$account$2d$kit$2f$dist$2f$storage$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/smart-account-kit/dist/storage/indexeddb.js [app-client] (ecmascript)");
;
;
let _kit = null;
function getKit() {
    if (_kit) return _kit;
    _kit = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$smart$2d$account$2d$kit$2f$dist$2f$kit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SmartAccountKit"]({
        rpcUrl: ("TURBOPACK compile-time value", "https://soroban-testnet.stellar.org"),
        networkPassphrase: ("TURBOPACK compile-time value", "Test SDF Network ; September 2015"),
        accountWasmHash: ("TURBOPACK compile-time value", "8537b8166c0078440a5324c12f6db48d6340d157c306a54c5ea81405abcc2611"),
        webauthnVerifierAddress: ("TURBOPACK compile-time value", "CCMR63YE5T7MPWREF3PC5XNTTGXFSB4GYUGUIT5POHP2UGCS65TBIUUU"),
        storage: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$smart$2d$account$2d$kit$2f$dist$2f$storage$2f$indexeddb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexedDBStorage"]()
    });
    return _kit;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@stellar/stellar-sdk/dist/stellar-sdk.min.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WalletCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/WalletCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TransferModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/TransferModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RFPViewer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/RFPViewer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$kit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/kit.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const NATIVE_CONTRACT = ("TURBOPACK compile-time value", "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC");
function AppPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [contractId, setContractId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [balance, setBalance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [balanceLoading, setBalanceLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('rfp');
    const [showTransfer, setShowTransfer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppPage.useEffect": ()=>{
            const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSession"])();
            if (session) setContractId(session.contractId);
        }
    }["AppPage.useEffect"], []);
    const fetchBalance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppPage.useCallback[fetchBalance]": async (addr)=>{
            setBalanceLoading(true);
            try {
                const server = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Horizon"].Server(HORIZON_URL);
                const account = await server.loadAccount(addr);
                const native = account.balances.find({
                    "AppPage.useCallback[fetchBalance].native": (b)=>b.asset_type === 'native'
                }["AppPage.useCallback[fetchBalance].native"]);
                setBalance(native ? parseFloat(native.balance).toFixed(2) : '0.00');
            } catch  {
                setBalance('—');
            } finally{
                setBalanceLoading(false);
            }
        }
    }["AppPage.useCallback[fetchBalance]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppPage.useEffect": ()=>{
            if (contractId) fetchBalance(contractId);
        }
    }["AppPage.useEffect"], [
        contractId,
        fetchBalance
    ]);
    function handleDisconnect() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearSession"])();
        router.replace('/');
    }
    async function handleTransfer(recipient, amount) {
        const kit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$kit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getKit"])();
        const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSession"])();
        if (!session) throw new Error('Session expired');
        await kit.transfer(NATIVE_CONTRACT, recipient, parseFloat(amount));
        if (contractId) await fetchBalance(contractId);
    }
    if (!contractId) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex flex-col",
        style: {
            background: '#f0f4ff'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex items-center justify-between px-4 md:px-8 py-3 bg-white border-b border-slate-200 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/logo1.jpeg",
                                alt: "SealPass",
                                width: 36,
                                height: 36,
                                className: "rounded-lg"
                            }, void 0, false, {
                                fileName: "[project]/app/app/page.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-base font-bold hidden md:block",
                                style: {
                                    color: '#1a2e5c'
                                },
                                children: "SealPass"
                            }, void 0, false, {
                                fileName: "[project]/app/app/page.tsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/page.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleDisconnect,
                        className: "text-sm px-4 py-1.5 rounded-lg border font-medium transition-all hover:bg-slate-50",
                        style: {
                            color: '#5472a0',
                            borderColor: '#e2e8f0'
                        },
                        children: "Disconnect"
                    }, void 0, false, {
                        fileName: "[project]/app/app/page.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/app/page.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 px-4 md:px-8 py-6 max-w-4xl mx-auto w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-1 mb-6 bg-white rounded-xl p-1 w-fit shadow-sm border border-slate-200",
                        children: [
                            [
                                'rfp',
                                'RFP Proposal'
                            ],
                            [
                                'wallet',
                                'Wallet'
                            ]
                        ].map(([tab, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab(tab),
                                className: "px-5 py-2 rounded-lg text-sm font-semibold transition-all",
                                style: activeTab === tab ? {
                                    background: '#2563eb',
                                    color: '#ffffff'
                                } : {
                                    color: '#5472a0'
                                },
                                children: label
                            }, tab, false, {
                                fileName: "[project]/app/app/page.tsx",
                                lineNumber: 85,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/app/page.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    activeTab === 'rfp' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RFPViewer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RFPViewer"], {}, void 0, false, {
                            fileName: "[project]/app/app/page.tsx",
                            lineNumber: 103,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/app/page.tsx",
                        lineNumber: 102,
                        columnNumber: 11
                    }, this),
                    activeTab === 'wallet' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WalletCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WalletCard"], {
                                contractId: contractId,
                                balance: balance,
                                loading: balanceLoading
                            }, void 0, false, {
                                fileName: "[project]/app/app/page.tsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col gap-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-semibold uppercase tracking-widest block mb-2",
                                                style: {
                                                    color: '#94a3b8'
                                                },
                                                children: "Balance"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/page.tsx",
                                                lineNumber: 114,
                                                columnNumber: 17
                                            }, this),
                                            balanceLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-10 w-40 rounded-lg animate-pulse bg-slate-100"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/page.tsx",
                                                lineNumber: 116,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-4xl font-bold",
                                                style: {
                                                    color: '#1a2e5c'
                                                },
                                                children: [
                                                    balance ?? '—',
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xl",
                                                        style: {
                                                            color: '#5472a0'
                                                        },
                                                        children: "XLM"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/page.tsx",
                                                        lineNumber: 119,
                                                        columnNumber: 38
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/page.tsx",
                                                lineNumber: 118,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/page.tsx",
                                        lineNumber: 113,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowTransfer(true),
                                                className: "px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all shadow-sm",
                                                style: {
                                                    background: '#2563eb'
                                                },
                                                children: "Send XLM"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/page.tsx",
                                                lineNumber: 125,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>fetchBalance(contractId),
                                                className: "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-slate-50",
                                                style: {
                                                    color: '#5472a0',
                                                    borderColor: '#e2e8f0'
                                                },
                                                children: "Refresh"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/page.tsx",
                                                lineNumber: 132,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs px-2.5 py-1 rounded-full border font-medium",
                                                style: {
                                                    color: '#2563eb',
                                                    borderColor: 'rgba(37,99,235,0.3)',
                                                    background: '#eff6ff'
                                                },
                                                children: "Testnet"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/page.tsx",
                                                lineNumber: 139,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/page.tsx",
                                        lineNumber: 124,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/page.tsx",
                                lineNumber: 112,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/page.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/app/page.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            showTransfer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TransferModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransferModal"], {
                onClose: ()=>setShowTransfer(false),
                onTransfer: handleTransfer
            }, void 0, false, {
                fileName: "[project]/app/app/page.tsx",
                lineNumber: 149,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/app/page.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_s(AppPage, "cyulcaItX4pAlKoC6ejzamsFE7c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AppPage;
var _c;
__turbopack_context__.k.register(_c, "AppPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0u01yam._.js.map