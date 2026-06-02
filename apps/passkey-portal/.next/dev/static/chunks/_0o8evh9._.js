(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/SealLogo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SealLogo",
    ()=>SealLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function SealLogo({ size = 220, bgColor = '#0a1840', ringColor = '#ffffff', textColor = '#ffffff' }) {
    const cx = 110;
    const cy = 110;
    const outerR = 107;
    const innerR = 77;
    const topTextR = 88 // ascenders go outward → baseline closer to center
    ;
    const bottomTextR = 96 // ascenders go inward  → baseline closer to outer ring
    ;
    const dotR = 92 // decorative dots at band centre
    ;
    const imageR = 74;
    const topArc = `M ${cx - topTextR},${cy} A ${topTextR},${topTextR} 0 0,1 ${cx + topTextR},${cy}`;
    const bottomArc = `M ${cx - bottomTextR},${cy} A ${bottomTextR},${bottomTextR} 0 0,0 ${cx + bottomTextR},${cy}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 220 220",
        width: size,
        height: size,
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                        id: "sealImgClip",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: cx,
                            cy: cy,
                            r: imageR
                        }, void 0, false, {
                            fileName: "[project]/components/SealLogo.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/SealLogo.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        id: "sealTopArc",
                        d: topArc
                    }, void 0, false, {
                        fileName: "[project]/components/SealLogo.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        id: "sealBottomArc",
                        d: bottomArc
                    }, void 0, false, {
                        fileName: "[project]/components/SealLogo.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SealLogo.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: cx,
                cy: cy,
                r: outerR,
                fill: bgColor
            }, void 0, false, {
                fileName: "[project]/components/SealLogo.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: cx,
                cy: cy,
                r: outerR - 2,
                fill: "none",
                stroke: ringColor,
                strokeWidth: "0.8",
                strokeOpacity: "0.25",
                strokeDasharray: "4 3"
            }, void 0, false, {
                fileName: "[project]/components/SealLogo.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: cx,
                cy: cy,
                r: innerR,
                fill: "none",
                stroke: ringColor,
                strokeWidth: "1.2",
                strokeOpacity: "0.35"
            }, void 0, false, {
                fileName: "[project]/components/SealLogo.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("image", {
                href: "/logo1.jpeg",
                x: cx - imageR,
                y: cy - imageR,
                width: imageR * 2,
                height: imageR * 2,
                clipPath: "url(#sealImgClip)",
                preserveAspectRatio: "xMidYMid slice"
            }, void 0, false, {
                fileName: "[project]/components/SealLogo.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: cx - dotR,
                cy: cy,
                r: "2.5",
                fill: textColor,
                fillOpacity: "0.6"
            }, void 0, false, {
                fileName: "[project]/components/SealLogo.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: cx + dotR,
                cy: cy,
                r: "2.5",
                fill: textColor,
                fillOpacity: "0.6"
            }, void 0, false, {
                fileName: "[project]/components/SealLogo.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                fill: textColor,
                fontSize: "11.5",
                fontWeight: "700",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: "2.5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textPath", {
                    href: "#sealTopArc",
                    startOffset: "50%",
                    textAnchor: "middle",
                    children: "SEALPASS · SMART WALLET"
                }, void 0, false, {
                    fileName: "[project]/components/SealLogo.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/SealLogo.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                fill: textColor,
                fontSize: "10",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: "2",
                fillOpacity: "0.75",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textPath", {
                    href: "#sealBottomArc",
                    startOffset: "50%",
                    textAnchor: "middle",
                    children: "· BUILT ON STELLAR ·"
                }, void 0, false, {
                    fileName: "[project]/components/SealLogo.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/SealLogo.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/SealLogo.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c = SealLogo;
var _c;
__turbopack_context__.k.register(_c, "SealLogo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
            background: 'linear-gradient(135deg, #3b82f6, #1e40af, #060d1f)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl p-6 flex flex-col gap-4",
            style: {
                background: 'linear-gradient(135deg, #0a1628 0%, #0d1f45 100%)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs font-semibold uppercase tracking-widest",
                            style: {
                                color: 'rgba(255,255,255,0.3)'
                            },
                            children: "Smart Account"
                        }, void 0, false, {
                            fileName: "[project]/components/WalletCard.tsx",
                            lineNumber: 27,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs px-2.5 py-0.5 rounded-full font-medium border",
                            style: {
                                color: '#3b82f6',
                                borderColor: 'rgba(59,130,246,0.35)',
                                background: 'rgba(59,130,246,0.1)'
                            },
                            children: "Testnet"
                        }, void 0, false, {
                            fileName: "[project]/components/WalletCard.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/WalletCard.tsx",
                    lineNumber: 26,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-mono text-xs flex-1 truncate",
                            style: {
                                color: 'rgba(255,255,255,0.55)'
                            },
                            children: contractId
                        }, void 0, false, {
                            fileName: "[project]/components/WalletCard.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleCopy,
                            className: "text-xs px-2.5 py-1 rounded-lg border transition-all shrink-0 font-medium",
                            style: {
                                color: copied ? '#3b82f6' : 'rgba(255,255,255,0.4)',
                                borderColor: 'rgba(255,255,255,0.1)'
                            },
                            children: copied ? 'Copied!' : 'Copy'
                        }, void 0, false, {
                            fileName: "[project]/components/WalletCard.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/WalletCard.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs block mb-1",
                            style: {
                                color: 'rgba(255,255,255,0.3)'
                            },
                            children: "Balance"
                        }, void 0, false, {
                            fileName: "[project]/components/WalletCard.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-8 w-32 rounded-lg animate-pulse",
                            style: {
                                background: 'rgba(255,255,255,0.06)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/WalletCard.tsx",
                            lineNumber: 50,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-3xl font-bold text-white",
                            children: [
                                balance ?? '—',
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-lg",
                                    style: {
                                        color: 'rgba(255,255,255,0.4)'
                                    },
                                    children: "XLM"
                                }, void 0, false, {
                                    fileName: "[project]/components/WalletCard.tsx",
                                    lineNumber: 53,
                                    columnNumber: 32
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/WalletCard.tsx",
                            lineNumber: 52,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/WalletCard.tsx",
                    lineNumber: 47,
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
                className: "absolute inset-0 backdrop-blur-sm",
                style: {
                    background: 'rgba(6,13,31,0.85)'
                },
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/components/TransferModal.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 rounded-2xl p-6 w-full max-w-md shadow-2xl border",
                style: {
                    background: '#0a1628',
                    borderColor: 'rgba(59,130,246,0.25)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-white",
                                children: "Send XLM"
                            }, void 0, false, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "text-xl leading-none",
                                style: {
                                    color: 'rgba(255,255,255,0.3)'
                                },
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/TransferModal.tsx",
                        lineNumber: 40,
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
                                lineNumber: 47,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-bold text-lg mb-1 text-white",
                                children: "Transfer submitted"
                            }, void 0, false, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 48,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm",
                                style: {
                                    color: 'rgba(255,255,255,0.45)'
                                },
                                children: "Transaction signed and sent to the network"
                            }, void 0, false, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 49,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "mt-6 w-full py-2.5 rounded-xl font-bold text-white transition-all",
                                style: {
                                    background: '#3b82f6'
                                },
                                children: "Done"
                            }, void 0, false, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/TransferModal.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "flex flex-col gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs font-semibold mb-1.5 uppercase tracking-wide",
                                        style: {
                                            color: 'rgba(255,255,255,0.3)'
                                        },
                                        children: "Recipient Address"
                                    }, void 0, false, {
                                        fileName: "[project]/components/TransferModal.tsx",
                                        lineNumber: 61,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: recipient,
                                        onChange: (e)=>setRecipient(e.target.value),
                                        placeholder: "G… or C…",
                                        required: true,
                                        className: "w-full rounded-xl px-3 py-2.5 font-mono text-sm text-white outline-none border",
                                        style: {
                                            background: 'rgba(255,255,255,0.05)',
                                            borderColor: 'rgba(255,255,255,0.1)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/TransferModal.tsx",
                                        lineNumber: 64,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 60,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs font-semibold mb-1.5 uppercase tracking-wide",
                                        style: {
                                            color: 'rgba(255,255,255,0.3)'
                                        },
                                        children: "Amount (XLM)"
                                    }, void 0, false, {
                                        fileName: "[project]/components/TransferModal.tsx",
                                        lineNumber: 76,
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
                                        className: "w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none border",
                                        style: {
                                            background: 'rgba(255,255,255,0.05)',
                                            borderColor: 'rgba(255,255,255,0.1)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/TransferModal.tsx",
                                        lineNumber: 79,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs px-3 py-2 rounded-lg border",
                                style: {
                                    color: '#fca5a5',
                                    background: 'rgba(239,68,68,0.1)',
                                    borderColor: 'rgba(239,68,68,0.25)'
                                },
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 93,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: status === 'pending',
                                className: "w-full py-2.5 rounded-xl font-bold text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all",
                                style: {
                                    background: '#3b82f6'
                                },
                                children: status === 'pending' ? 'Signing with passkey…' : '🔑 Sign with Passkey'
                            }, void 0, false, {
                                fileName: "[project]/components/TransferModal.tsx",
                                lineNumber: 98,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/TransferModal.tsx",
                        lineNumber: 59,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/TransferModal.tsx",
                lineNumber: 36,
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
"[project]/lib/session.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearSession",
    ()=>clearSession,
    "getSession",
    ()=>getSession,
    "isAuthed",
    ()=>isAuthed,
    "markAuthed",
    ()=>markAuthed,
    "setSession",
    ()=>setSession
]);
const WALLET_KEY = 'passkey-portal:wallet';
const AUTH_KEY = 'passkey-portal:authed';
function getSession() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const raw = localStorage.getItem(WALLET_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch  {
        return null;
    }
}
function setSession(session) {
    localStorage.setItem(WALLET_KEY, JSON.stringify(session));
    localStorage.setItem(AUTH_KEY, '1');
}
function isAuthed() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return localStorage.getItem(AUTH_KEY) === '1';
}
function markAuthed() {
    localStorage.setItem(AUTH_KEY, '1');
}
function clearSession() {
    localStorage.removeItem(AUTH_KEY);
}
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@stellar/stellar-sdk/dist/stellar-sdk.min.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SealLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SealLogo.tsx [app-client] (ecmascript)");
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
            background: 'radial-gradient(ellipse at 50% 0%, #1e3a8a 0%, #0a1628 45%, #060d1f 100%)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex items-center justify-between px-4 md:px-8 py-3 border-b",
                style: {
                    background: 'rgba(6,13,31,0.8)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SealLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SealLogo"], {
                                size: 34,
                                bgColor: "#060d1f",
                                ringColor: "rgba(59,130,246,0.6)",
                                textColor: "rgba(255,255,255,0.8)"
                            }, void 0, false, {
                                fileName: "[project]/app/app/page.tsx",
                                lineNumber: 75,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-bold tracking-wide text-white hidden md:block",
                                children: "SEALPASS"
                            }, void 0, false, {
                                fileName: "[project]/app/app/page.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/page.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleDisconnect,
                        className: "text-sm px-4 py-1.5 rounded-lg border font-medium transition-all",
                        style: {
                            color: 'rgba(255,255,255,0.5)',
                            borderColor: 'rgba(255,255,255,0.1)'
                        },
                        children: "Disconnect"
                    }, void 0, false, {
                        fileName: "[project]/app/app/page.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/app/page.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 px-4 md:px-8 py-6 max-w-4xl mx-auto w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-1 mb-6 rounded-xl p-1 w-fit border",
                        style: {
                            background: 'rgba(255,255,255,0.04)',
                            borderColor: 'rgba(255,255,255,0.08)'
                        },
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
                                    background: '#3b82f6',
                                    color: '#ffffff'
                                } : {
                                    color: 'rgba(255,255,255,0.4)'
                                },
                                children: label
                            }, tab, false, {
                                fileName: "[project]/app/app/page.tsx",
                                lineNumber: 94,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/app/page.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    activeTab === 'rfp' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl p-6 md:p-8 border",
                        style: {
                            background: 'rgba(255,255,255,0.03)',
                            borderColor: 'rgba(255,255,255,0.08)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RFPViewer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RFPViewer"], {}, void 0, false, {
                            fileName: "[project]/app/app/page.tsx",
                            lineNumber: 114,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/app/page.tsx",
                        lineNumber: 110,
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
                                lineNumber: 120,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl p-6 border flex flex-col gap-5",
                                style: {
                                    background: 'rgba(255,255,255,0.03)',
                                    borderColor: 'rgba(255,255,255,0.08)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-semibold uppercase tracking-widest block mb-2",
                                                style: {
                                                    color: 'rgba(255,255,255,0.25)'
                                                },
                                                children: "Balance"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/page.tsx",
                                                lineNumber: 127,
                                                columnNumber: 17
                                            }, this),
                                            balanceLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-10 w-40 rounded-lg animate-pulse",
                                                style: {
                                                    background: 'rgba(255,255,255,0.06)'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/page.tsx",
                                                lineNumber: 129,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-4xl font-bold text-white",
                                                children: [
                                                    balance ?? '—',
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xl",
                                                        style: {
                                                            color: 'rgba(255,255,255,0.4)'
                                                        },
                                                        children: "XLM"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/page.tsx",
                                                        lineNumber: 132,
                                                        columnNumber: 38
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/page.tsx",
                                                lineNumber: 131,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/page.tsx",
                                        lineNumber: 126,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowTransfer(true),
                                                className: "px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all",
                                                style: {
                                                    background: '#3b82f6'
                                                },
                                                children: "Send XLM"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/page.tsx",
                                                lineNumber: 138,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>fetchBalance(contractId),
                                                className: "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                                                style: {
                                                    color: 'rgba(255,255,255,0.5)',
                                                    borderColor: 'rgba(255,255,255,0.1)'
                                                },
                                                children: "Refresh"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/page.tsx",
                                                lineNumber: 145,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs px-2.5 py-1 rounded-full border font-medium",
                                                style: {
                                                    color: '#3b82f6',
                                                    borderColor: 'rgba(59,130,246,0.4)',
                                                    background: 'rgba(59,130,246,0.1)'
                                                },
                                                children: "Testnet"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/page.tsx",
                                                lineNumber: 152,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/page.tsx",
                                        lineNumber: 137,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/page.tsx",
                                lineNumber: 122,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/page.tsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/app/page.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            showTransfer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TransferModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransferModal"], {
                onClose: ()=>setShowTransfer(false),
                onTransfer: handleTransfer
            }, void 0, false, {
                fileName: "[project]/app/app/page.tsx",
                lineNumber: 165,
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

//# sourceMappingURL=_0o8evh9._.js.map