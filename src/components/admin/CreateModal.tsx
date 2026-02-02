"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { IconX, IconPhoto, IconLink, IconVideo, IconTxt, IconBold, IconGridDots } from "@tabler/icons-react";
import { literals } from "@/literals";
import { cn } from "@/lib/utils";
import { useThemeStyles } from "@/app/theme/ThemeProvider";
import { createBlogPost, uploadFileToStorage, updateBlogPost } from "@/lib/firebaseHelper";
import type { ContentBlock, PostModel } from "@/types";
import { nanoid } from "nanoid";

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    editPost?: PostModel | null;
}

export const CreateModal = ({ isOpen, onClose, editPost }: CreateModalProps) => {
    const { styles } = useThemeStyles();
    const [isProcessing, setIsProcessing] = useState(false);
    const [title, setTitle] = useState("");
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerUrl, setBannerUrl] = useState<string>(""); // For existing banner
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);

    const bannerInputRef = useRef<HTMLInputElement>(null);

    // Pre-populate form when editing
    useEffect(() => {
        if (editPost) {
            setTitle(editPost.title);
            // Find banner block
            const bannerBlock = editPost.content?.find(b => b.type === "banner");
            if (bannerBlock?.value) {
                setBannerUrl(bannerBlock.value);
            }
            // Load other blocks (excluding banner)
            const contentBlocks = editPost.content?.filter(b => b.type !== "banner") || [];
            setBlocks(contentBlocks);
        } else {
            // Reset form for create mode
            setTitle("");
            setBannerFile(null);
            setBannerUrl("");
            setBlocks([]);
        }
    }, [editPost, isOpen]);

    const handleAddBlock = (type: ContentBlock["type"]) => {
        const newBlock: ContentBlock = {
            id: nanoid(),
            type,
            value: "",
            order: blocks.length + 1, // Start ordering from 1, reserved 0 for banner
        };
        setBlocks([...blocks, newBlock]);
    };

    const handleRemoveBlock = (id: string) => {
        setBlocks((prev) => prev.filter((b) => b.id !== id));
    };

    const handleUpdateBlock = (id: string, value: string) => {
        setBlocks((prev) =>
            prev.map((b) => (b.id === id ? { ...b, value } : b))
        );
    };

    const [blockFiles, setBlockFiles] = useState<Record<string, File>>({});

    const handleFileSelect = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setBlockFiles(prev => ({ ...prev, [id]: file }));
            handleUpdateBlock(id, URL.createObjectURL(file));
        }
    };

    const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBannerFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        if (!title) return alert("Title is required");
        setIsProcessing(true);
        try {
            const slug = editPost?.slug || title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
            const basePath = `blogs/${slug}`;

            const finalBlocks: ContentBlock[] = [];

            // 1. Handle Banner (Type "banner", Order 0)
            let bannerBlock: ContentBlock | null = null;
            if (bannerFile) {
                // New banner uploaded
                const uploadedBannerUrl = await uploadFileToStorage(bannerFile, `${basePath}/banner/${bannerFile.name}`);
                bannerBlock = {
                    id: nanoid(),
                    type: "banner",
                    value: uploadedBannerUrl,
                    order: 0
                };
                finalBlocks.push(bannerBlock);
            } else if (bannerUrl) {
                // Keep existing banner
                bannerBlock = {
                    id: nanoid(),
                    type: "banner",
                    value: bannerUrl,
                    order: 0
                };
                finalBlocks.push(bannerBlock);
            }

            // 2. Process other blocks
            const processedBlocks = await Promise.all(blocks.map(async (block, index) => {
                if ((block.type === "image" || block.type === "video") && blockFiles[block.id]) {
                    const file = blockFiles[block.id];
                    const folder = block.type === "image" ? "images" : "videos";
                    const downloadUrl = await uploadFileToStorage(file, `${basePath}/${folder}/${file.name}`);
                    return { ...block, value: downloadUrl, order: bannerBlock ? index + 1 : index };
                }
                return { ...block, order: bannerBlock ? index + 1 : index };
            }));

            finalBlocks.push(...processedBlocks);

            const postData: Omit<PostModel, "id"> = {
                title,
                slug,
                excerpt: blocks.find(b => b.type === "text")?.value.substring(0, 100) || "",
                coverImage: "", // Deprecated, using content blocks
                date: editPost?.date || new Date().toISOString(),
                tags: editPost?.tags || [],
                authors: editPost?.authors || ["Admin"],
                content: finalBlocks
            };

            if (editPost) {
                // Update existing post
                await updateBlogPost(editPost.id, postData);
            } else {
                // Create new post
                await createBlogPost(postData);
            }

            onClose();

            // Reset state
            setTitle("");
            setBannerFile(null);
            setBannerUrl("");
            setBlocks([]);
            setBlockFiles({});
        } catch (e) {
            console.error(e);
            alert(editPost ? "Error updating post" : "Error creating post");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative flex h-full w-[90%] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
                        style={{ maxHeight: "100vh" }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b p-4 dark:border-neutral-800">
                            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                                {editPost ? "Editar Blog" : literals.blogCreation.modalTitle}
                            </h2>
                            <button onClick={onClose} className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <IconX size={24} className="text-neutral-500" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Title Input */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                    {literals.blogCreation.inputs.title}
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-lg border p-3 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white focus:ring-2 outline-none"
                                    style={{ borderColor: styles.brand.primary }}
                                    placeholder="Mi increíble viaje..."
                                />
                            </div>

                            {/* Banner Input */}
                            <div className="mb-8">
                                <label className="mb-2 block text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                    {literals.blogCreation.inputs.banner}
                                </label>
                                <div className="flex flex-col gap-2">
                                    <input
                                        ref={bannerInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBannerSelect}
                                        className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-neutral-800 dark:file:text-neutral-300"
                                    />
                                    {(bannerFile || bannerUrl) && (
                                        <div className="mt-2 h-40 w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                            <img
                                                src={bannerFile ? URL.createObjectURL(bannerFile) : bannerUrl}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tag Menu (Block Adder) */}
                            <div className="mb-6 flex flex-wrap gap-2 rounded-lg border p-2 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                                <TagButton label={literals.blogCreation.tagsMenu.text} icon={<IconTxt size={18} />} onClick={() => handleAddBlock("text")} />
                                <TagButton label={literals.blogCreation.tagsMenu.accent} icon={<IconBold size={18} />} onClick={() => handleAddBlock("accent")} />
                                <TagButton label={literals.blogCreation.tagsMenu.link} icon={<IconLink size={18} />} onClick={() => handleAddBlock("link")} />
                                <TagButton label={literals.blogCreation.tagsMenu.image} icon={<IconPhoto size={18} />} onClick={() => handleAddBlock("image")} />
                                <TagButton label={literals.blogCreation.tagsMenu.video} icon={<IconVideo size={18} />} onClick={() => handleAddBlock("video")} />
                            </div>

                            {/* Blocks List */}
                            <Reorder.Group axis="y" values={blocks} onReorder={setBlocks} className="flex flex-col gap-4">
                                {blocks.map((block) => (
                                    <Reorder.Item
                                        key={block.id}
                                        value={block}
                                        whileDrag={{ opacity: 0.7, scale: 1.02 }}
                                        className="relative rounded-lg border p-4 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm group"
                                    >
                                        {/* Drag Handle & Type Label */}
                                        <div className="mb-2 flex items-center justify-between">
                                            <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing text-neutral-400">
                                                <IconGridDots size={16} />
                                                <span className="text-xs font-bold uppercase">{block.type}</span>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveBlock(block.id)}
                                                className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 hover:bg-red-500 hover:text-white transition-colors dark:bg-neutral-800 dark:text-neutral-400"
                                                title="Eliminar bloque"
                                            >
                                                <IconX size={14} />
                                            </button>
                                        </div>

                                        {block.type === "text" && (
                                            <textarea
                                                className="w-full rounded-md bg-transparent p-2 outline-none dark:text-white border-none focus:ring-0 resize-y min-h-[100px]"
                                                placeholder={literals.blogCreation.placeholders.text}
                                                value={block.value}
                                                onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                                            />
                                        )}

                                        {block.type === "accent" && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-neutral-400 font-mono">@@</span>
                                                <input
                                                    type="text"
                                                    className="w-full bg-transparent p-2 outline-none dark:text-white font-bold"
                                                    placeholder={literals.blogCreation.placeholders.accent}
                                                    value={block.value}
                                                    onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                                                />
                                                <span className="text-neutral-400 font-mono">@@</span>
                                            </div>
                                        )}

                                        {block.type === "link" && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-neutral-400 font-mono">##</span>
                                                <input
                                                    type="text"
                                                    className="w-full bg-transparent p-2 outline-none dark:text-blue-400 underline"
                                                    placeholder={literals.blogCreation.placeholders.link}
                                                    value={block.value}
                                                    onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                                                />
                                                <span className="text-neutral-400 font-mono">##</span>
                                            </div>
                                        )}

                                        {(block.type === "image" || block.type === "video") && (
                                            <div>
                                                <input
                                                    type="file"
                                                    accept={block.type === "image" ? "image/*" : "video/*"}
                                                    onChange={(e) => handleFileSelect(block.id, e)}
                                                    className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-neutral-800 dark:file:text-neutral-300"
                                                />
                                                {block.value && (
                                                    <div className="mt-2 rounded-lg overflow-hidden border dark:border-neutral-700 bg-black/5">
                                                        {block.type === "image" ? (
                                                            <img src={block.value} className="max-h-60 w-auto mx-auto" />
                                                        ) : (
                                                            <video src={block.value} controls className="max-h-60 w-auto mx-auto" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-4 border-t p-4 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                            <button
                                onClick={onClose}
                                className="rounded-lg bg-red-500 px-6 py-2 font-bold text-white transition hover:bg-red-600"
                            >
                                {literals.blogCreation.buttons.cancel}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isProcessing}
                                className="rounded-lg px-6 py-2 font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                                style={{ backgroundColor: styles.brand.primary }}
                            >
                                {isProcessing ? literals.common.loading : (editPost ? "Guardar Cambios" : literals.blogCreation.buttons.accept)}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const TagButton = ({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) => {
    const { styles } = useThemeStyles();
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:shadow-md dark:border-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800"
            style={{
                borderColor: styles.brand.primary,
            }}
        >
            <span style={{ color: styles.brand.primary }}>{icon}</span>
            {label}
        </button>
    )
}
