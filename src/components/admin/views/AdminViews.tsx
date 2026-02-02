import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CreateCard } from "@/components/admin/CreateCard";
import { CreateModal } from "@/components/admin/CreateModal";
import { BlogCard } from "@/components/admin/BlogCard";
import { CreateItineraryModal } from "@/components/admin/CreateItineraryModal";
import { ItineraryCard } from "@/components/admin/ItineraryCard";
import {
    getBlogPosts,
    deleteBlogPost,
    getFeaturedBlogIds,
    toggleFeaturedBlog,
    getItineraries,
    deleteItinerary,
    getFeaturedItineraryIds,
    toggleFeaturedItinerary
} from "@/lib/firebaseHelper";
import type { PostModel, ItineraryModel } from "@/types";

// Dummy dashboard component
export const DashboardView = () => {
    return (
        <div className="h-full w-full p-4 rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Dashboard management</h2>
            <p className="dark:text-neutral-300">Content for Dashboard will go here.</p>
        </div>
    );
};

export const BlogsView = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [featuredIds, setFeaturedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<PostModel | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [postsData, featuredData] = await Promise.all([
                getBlogPosts(),
                getFeaturedBlogIds()
            ]);
            setPosts(postsData);
            setFeaturedIds(new Set(featuredData));
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de que quieres eliminar este post?")) {
            await deleteBlogPost(id);
            await fetchData();
        }
    };

    const handleToggleFeatured = async (id: string) => {
        const isFeatured = featuredIds.has(id);
        try {
            await toggleFeaturedBlog(id, isFeatured);
            // Optimistic update
            const newSet = new Set(featuredIds);
            if (isFeatured) newSet.delete(id);
            else newSet.add(id);
            setFeaturedIds(newSet);
        } catch (e) {
            console.error(e);
            alert("Error updating featured status");
        }
    };

    const handleEdit = (post: PostModel) => {
        setEditingPost(post);
        setIsCreateOpen(true);
    };

    return (
        <div className="h-full w-full p-4">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold dark:text-white">Blog Management</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-20">
                <CreateCard onClick={() => setIsCreateOpen(true)} />

                {posts.map((post) => (
                    <BlogCard
                        key={post.id}
                        post={post}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isFeatured={featuredIds.has(post.id)}
                        onToggleFeatured={handleToggleFeatured}
                    />
                ))}
            </div>

            <CreateModal
                isOpen={isCreateOpen}
                editPost={editingPost}
                onClose={() => {
                    setIsCreateOpen(false);
                    setEditingPost(null);
                    fetchData();
                }}
            />
        </div>
    );
};

export const ItinerariosView = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [itineraries, setItineraries] = useState<ItineraryModel[]>([]);
    const [featuredIds, setFeaturedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [editingItinerary, setEditingItinerary] = useState<ItineraryModel | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [data, featuredData] = await Promise.all([
                getItineraries(),
                getFeaturedItineraryIds()
            ]);
            setItineraries(data);
            setFeaturedIds(new Set(featuredData));
        } catch (error) {
            console.error("Error fetching itineraries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de que quieres eliminar este itinerario?")) {
            await deleteItinerary(id);
            await fetchData();
        }
    };

    const handleToggleFeatured = async (id: string) => {
        const isFeatured = featuredIds.has(id);
        try {
            await toggleFeaturedItinerary(id, isFeatured);
            // Optimistic update
            const newSet = new Set(featuredIds);
            if (isFeatured) newSet.delete(id);
            else newSet.add(id);
            setFeaturedIds(newSet);
        } catch (e) {
            console.error(e);
            alert("Error updating featured status");
        }
    };

    const handleEdit = (itinerary: ItineraryModel) => {
        setEditingItinerary(itinerary);
        setIsCreateOpen(true);
    };

    return (
        <div className="h-full w-full p-4">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold dark:text-white">Itineraries Management</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-20">
                <CreateCard onClick={() => setIsCreateOpen(true)} />

                {itineraries.map((itinerary) => (
                    <ItineraryCard
                        key={itinerary.id}
                        itinerary={itinerary}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isFeatured={featuredIds.has(itinerary.id)}
                        onToggleFeatured={handleToggleFeatured}
                    />
                ))}
            </div>

            <CreateItineraryModal
                isOpen={isCreateOpen}
                editItinerary={editingItinerary}
                onClose={() => {
                    setIsCreateOpen(false);
                    setEditingItinerary(null);
                    fetchData();
                }}
            />
        </div>
    );
};

export const SettingsView = () => (
    <div className="h-full w-full p-4 rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Ajustes</h2>
        <p className="dark:text-neutral-300">Content for Settings will go here.</p>
    </div>
);

import { VisualizationView as VisualizationComponent } from "@/components/admin/views/VisualizationView";

export const VisualizationView = () => (
    <VisualizationComponent />
);

export const LiteralsView = () => (
    <div className="h-full w-full p-4 rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Literals</h2>
        <p className="dark:text-neutral-300">Content for Literals will go here.</p>
    </div>
);

import { ComponentsView as ComponentsViewComponent } from "@/components/admin/views/ComponentsView";

export const ComponentsView = () => (
    <ComponentsViewComponent />
);
