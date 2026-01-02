"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { literals } from "@/literals";
import Link from "next/link";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconArticle,
    IconMap,
    IconEye,
    IconAbc,
    IconComponents,
} from "@tabler/icons-react";
import { motion } from "framer-motion"; // Changed from motion/react to framer-motion based on package.json
import { cn } from "@/lib/utils";
import { useThemeStyles } from "@/app/theme/ThemeProvider";
import {
    DashboardView,
    BlogsView,
    ItinerariosView,
    SettingsView,
    VisualizationView,
    LiteralsView,
    ComponentsView,
} from "@/components/admin/views/AdminViews";

type AdminViewType =
    | "Dashboard"
    | "Blogs"
    | "Itinerarios"
    | "Ajustes"
    | "Visualizacion"
    | "Literals"
    | "Componentes";

export default function AdminPage() {
    const { styles } = useThemeStyles();
    const [activeView, setActiveView] = useState<AdminViewType>("Dashboard");
    const [open, setOpen] = useState(false);

    const links = [
        {
            label: "Dashboard",
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            view: "Dashboard" as const,
        },
        {
            label: "Blogs",
            icon: (
                <IconArticle className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            view: "Blogs" as const,
        },
        {
            label: "Itinerarios",
            icon: (
                <IconMap className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            view: "Itinerarios" as const,
        },
        {
            label: "Ajustes",
            icon: (
                <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            view: "Ajustes" as const,
        },
        {
            label: "Visualización",
            icon: (
                <IconEye className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            view: "Visualizacion" as const,
        },
        {
            label: "Literals",
            icon: (
                <IconAbc className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            view: "Literals" as const,
        },
        {
            label: "Componentes",
            icon: (
                <IconComponents className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            view: "Componentes" as const,
        },
    ];

    const renderContent = () => {
        switch (activeView) {
            case "Dashboard":
                return <DashboardView />;
            case "Blogs":
                return <BlogsView />;
            case "Itinerarios":
                return <ItinerariosView />;
            case "Ajustes":
                return <SettingsView />;
            case "Visualizacion":
                return <VisualizationView />;
            case "Literals":
                return <LiteralsView />;
            case "Componentes":
                return <ComponentsView />;
            default:
                return <DashboardView />;
        }
    };

    return (
        <div
            className={cn(
                "flex w-full flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                "h-screen"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => {
                                const isActive = activeView === link.view;
                                const activeColor = styles.brand.primary;

                                return (
                                    <SidebarLink
                                        key={idx}
                                        link={{
                                            label: link.label,
                                            href: "#", // Dummy href
                                            icon: React.cloneElement(link.icon as React.ReactElement<{ style?: React.CSSProperties; className?: string }>, {
                                                style: { color: isActive ? activeColor : undefined },
                                                className: cn(
                                                    "h-5 w-5 shrink-0",
                                                    !isActive && "text-neutral-700 dark:text-neutral-200"
                                                )
                                            })
                                        }}
                                        labelStyle={{
                                            color: isActive ? activeColor : undefined
                                        }}
                                        onClick={() => setActiveView(link.view)}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <div>
                        <Link href="/">
                            <SidebarLink
                                link={{
                                    label: literals.admin.exit,
                                    href: "/",
                                    icon: (
                                        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                                    ),
                                }}
                            />
                        </Link>
                    </div>
                </SidebarBody>
            </Sidebar>
            <div className="flex flex-1 p-4 md:p-10 h-full overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
}

export const Logo = () => {
    return (
        <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-pre text-black dark:text-white"
            >
                Admin Panel
            </motion.span>
        </div>
    );
};

export const LogoIcon = () => {
    return (
        <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
        </div>
    );
};