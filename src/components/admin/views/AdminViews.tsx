import { cn } from "@/lib/utils";

// Dummy dashboard component
export const DashboardView = () => {
    return (
        <div className="h-full w-full p-4 rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Dashboard management</h2>
            <p className="dark:text-neutral-300">Content for Dashboard will go here.</p>
        </div>
    );
};

export const BlogsView = () => (
    <div className="h-full w-full p-4 rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Blogs Management</h2>
        <p className="dark:text-neutral-300">Content for Blogs will go here.</p>
    </div>
);

export const ItinerariosView = () => (
    <div className="h-full w-full p-4 rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Itinerarios Management</h2>
        <p className="dark:text-neutral-300">Content for Itinerarios will go here.</p>
    </div>
);

export const SettingsView = () => (
    <div className="h-full w-full p-4 rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Ajustes</h2>
        <p className="dark:text-neutral-300">Content for Settings will go here.</p>
    </div>
);

export const VisualizationView = () => (
    <div className="h-full w-full p-4 rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Visualización</h2>
        <p className="dark:text-neutral-300">Content for Visualization will go here.</p>
    </div>
);

export const LiteralsView = () => (
    <div className="h-full w-full p-4 rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Literals</h2>
        <p className="dark:text-neutral-300">Content for Literals will go here.</p>
    </div>
);

export const ComponentsView = () => (
    <div className="h-full w-full p-4 rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Componentes</h2>
        <p className="dark:text-neutral-300">Content for Components will go here.</p>
    </div>
);
