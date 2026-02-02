import { useState, useEffect, useContext } from "react";
import { styles as defaultStyles, getThemeStyles } from "@/styles/styles";
import { saveThemeSettings, getThemeSettings } from "@/lib/firebaseHelper";
import { PageBlocksRenderer } from "@/features/PageBlockRenderer";
import type { PageKey, Theme } from "@/types/types";
import { IconDeviceFloppy, IconReload, IconPalette } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { ThemeContext } from "@/app/theme/ThemeProvider"; // Now exported

const PAGES: PageKey[] = ["home", "blog", "itinerary", "services", "admin"];

export const VisualizationView = () => {
    const [selectedPage, setSelectedPage] = useState<PageKey>("home");
    const [themeOverrides, setThemeOverrides] = useState<Record<string, any>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");

    // Initial fetch
    useEffect(() => {
        getThemeSettings().then((settings: Record<string, any> | null) => {
            if (settings) setThemeOverrides(settings);
        });
    }, []);

    // Helper to update state deeply
    const handleColorChange = (mode: "light" | "dark", category: string, key: string, value: string) => {
        setThemeOverrides(prev => {
            const newOverrides = { ...prev };
            if (!newOverrides[mode]) newOverrides[mode] = {};
            if (!newOverrides[mode][category]) newOverrides[mode][category] = {};
            newOverrides[mode][category][key] = value;
            return newOverrides;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveThemeSettings(themeOverrides);
            alert("Theme saved successfully!");
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert("Error saving theme");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDiscard = async () => {
        if (confirm("Discard unsaved changes?")) {
            const settings = await getThemeSettings();
            setThemeOverrides(settings || {});
        }
    };

    // Render a color row
    const renderColorRow = (mode: "light" | "dark", category: string, key: string, label: string) => {
        const override = themeOverrides[mode]?.[category]?.[key];
        const defaultValue = (defaultStyles.theme as any)[mode][category][key];
        const currentValue = override || defaultValue;

        return (
            <div key={`${mode}-${category}-${key}`} className="flex items-center justify-between gap-4 border-b border-neutral-100 p-3 dark:border-neutral-800">
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-neutral-500 uppercase">{category}</span>
                    <span className="text-sm font-bold dark:text-neutral-200">{label}</span>
                </div>

                <div className="flex items-center gap-2">
                    <div
                        className="h-8 w-8 rounded-full border shadow-sm"
                        style={{ backgroundColor: currentValue }}
                    />
                    <input
                        type="color"
                        value={currentValue}
                        onChange={(e) => handleColorChange(mode, category, key, e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded border-none bg-transparent p-0"
                    />
                    <input
                        type="text"
                        value={currentValue}
                        onChange={(e) => handleColorChange(mode, category, key, e.target.value)}
                        className="w-24 rounded border p-1 text-xs uppercase font-mono dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
                    />
                </div>
            </div>
        );
    };

    const renderModeEditor = (mode: "light" | "dark") => {
        const source = (defaultStyles.theme as any)[mode];
        return (
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold capitalize flex items-center gap-2 dark:text-white">
                    {mode === 'light' ? '☀️' : '🌙'} {mode} Mode
                </h3>
                <div className="rounded-xl border bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
                    {Object.keys(source).map(category => (
                        <div key={category} className="p-0">
                            {typeof source[category] === 'object' && Object.keys(source[category]).map(key =>
                                renderColorRow(mode, category, key, key)
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Construct merged styles for previews (Memoize this if perf issues arise)
    const getPreviewStyles = (mode: "light" | "dark") => {
        const defaults = getThemeStyles(mode);
        const overrides = themeOverrides[mode] || {};
        return mergeDeep(defaults, overrides);
    };

    return (
        <div className="flex h-full w-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-white px-6 py-4 dark:bg-neutral-900 dark:border-neutral-800">
                <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                    <IconPalette size={24} /> Theme Editor
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleDiscard}
                        className="flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2 text-sm font-bold text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                        <IconReload size={16} /> Discard
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-lg bg-black px-6 py-2 text-sm font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-black"
                    >
                        <IconDeviceFloppy size={16} /> {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Split Editor */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {renderModeEditor("light")}
                {renderModeEditor("dark")}
            </div>

            {/* Preview Section */}
            <div className="border-t bg-neutral-50 p-6 dark:bg-black dark:border-neutral-800">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold dark:text-white">Live Preview</h3>
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 rounded-lg p-1 border border-neutral-200 dark:border-neutral-700">
                            <button
                                onClick={() => setPreviewTheme("light")}
                                className={cn(
                                    "flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                                    previewTheme === "light"
                                        ? "bg-black text-white dark:bg-white dark:text-black"
                                        : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
                                )}
                            >
                                ☀️ Light
                            </button>
                            <button
                                onClick={() => setPreviewTheme("dark")}
                                className={cn(
                                    "flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                                    previewTheme === "dark"
                                        ? "bg-black text-white dark:bg-white dark:text-black"
                                        : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
                                )}
                            >
                                🌙 Dark
                            </button>
                        </div>

                        {/* Page Selector */}
                        <div className="flex gap-2">
                            {PAGES.map(page => (
                                <button
                                    key={page}
                                    onClick={() => setSelectedPage(page)}
                                    className={cn(
                                        "rounded-lg px-3 py-1 text-xs font-medium transition-colors border",
                                        selectedPage === page
                                            ? "bg-black text-white dark:bg-white dark:text-black border-transparent"
                                            : "text-neutral-500 border-neutral-200 hover:border-black dark:border-neutral-700 dark:text-neutral-400"
                                    )}
                                >
                                    {page.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Single Preview */}
                <div className="max-w-4xl mx-auto">
                    <MockThemeProvider theme={previewTheme} styles={getPreviewStyles(previewTheme)}>
                        <div className={cn(
                            "border rounded-xl overflow-hidden shadow-lg min-h-[500px]",
                            previewTheme === "dark" ? "bg-black dark" : "bg-white"
                        )}>
                            <div
                                className="w-full overflow-y-auto"
                                style={{
                                    backgroundColor: getPreviewStyles(previewTheme).background.primary,
                                    color: previewTheme === "dark" ? 'white' : undefined
                                }}
                            >
                                <PageBlocksRenderer page={selectedPage} />
                            </div>
                        </div>
                    </MockThemeProvider>
                </div>
            </div>
        </div>
    );
};

// Mock Provider to inject local styles into components
const MockThemeProvider = ({ theme, styles, children }: { theme: Theme, styles: any, children: React.ReactNode }) => {
    return (
        <ThemeContext.Provider value={{
            theme,
            styles,
            setTheme: () => { },
            toggleTheme: () => { },
            themeOverrides: {} // Not needed for preview
        }}>
            {children}
        </ThemeContext.Provider>
    );
};


function mergeDeep(target: any, source: any) {
    const output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = mergeDeep(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

function isObject(item: any) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
