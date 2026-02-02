"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { IconX, IconPhoto, IconLink, IconVideo, IconTxt, IconBold, IconGridDots, IconPlus, IconTrash } from "@tabler/icons-react";
import { literals } from "@/literals";
import { cn } from "@/lib/utils";
import { useThemeStyles } from "@/app/theme/ThemeProvider";
import { createItinerary, uploadFileToStorage, updateItinerary } from "@/lib/firebaseHelper";
import type { ContentBlock, ItineraryModel, ItineraryStep } from "@/types";
import { nanoid } from "nanoid";

interface CreateItineraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    editItinerary?: ItineraryModel | null;
}

export const CreateItineraryModal = ({ isOpen, onClose, editItinerary }: CreateItineraryModalProps) => {
    const { styles } = useThemeStyles();
    const [isProcessing, setIsProcessing] = useState(false);

    // Global Fields
    const [title, setTitle] = useState("");
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerUrl, setBannerUrl] = useState<string>(""); // For existing banner

    // Steps
    const [steps, setSteps] = useState<ItineraryStep[]>([]);

    // Files map: stepId -> blockId -> File
    const [filesMap, setFilesMap] = useState<Record<string, Record<string, File>>>({});

    const bannerInputRef = useRef<HTMLInputElement>(null);

    // Pre-populate form when editing
    useEffect(() => {
        if (editItinerary) {
            setTitle(editItinerary.title);
            if (editItinerary.banner) {
                setBannerUrl(editItinerary.banner);
            }
            setSteps(editItinerary.steps || []);
        } else {
            // Reset form for create mode
            setTitle("");
            setBannerFile(null);
            setBannerUrl("");
            setSteps([]);
            setFilesMap({});
        }
    }, [editItinerary, isOpen]);

    // --- Step Management ---
    const handleAddStep = () => {
        const newStep: ItineraryStep = {
            id: nanoid(),
            order: steps.length + 1,
            content: []
        };
        setSteps([...steps, newStep]);
    };

    const handleRemoveStep = (stepId: string) => {
        setSteps(prev => prev.filter(s => s.id !== stepId));
        // Cleanup files map
        const newMap = { ...filesMap };
        delete newMap[stepId];
        setFilesMap(newMap);
    };

    // --- Block Management within Step ---
    const handleAddBlockToStep = (stepId: string, type: ContentBlock["type"]) => {
        setSteps(prev => prev.map(step => {
            if (step.id !== stepId) return step;
            return {
                ...step,
                content: [
                    ...step.content,
                    {
                        id: nanoid(),
                        type,
                        value: "",
                        order: step.content.length + 1
                    }
                ]
            };
        }));
    };

    const handleRemoveBlockFromStep = (stepId: string, blockId: string) => {
        setSteps(prev => prev.map(step => {
            if (step.id !== stepId) return step;
            return {
                ...step,
                content: step.content.filter(b => b.id !== blockId)
            };
        }));
        // Cleanup files
        if (filesMap[stepId]?.[blockId]) {
            const newStepFiles = { ...filesMap[stepId] };
            delete newStepFiles[blockId];
            setFilesMap(prev => ({ ...prev, [stepId]: newStepFiles }));
        }
    };

    const handleUpdateBlockInStep = (stepId: string, blockId: string, value: string) => {
        setSteps(prev => prev.map(step => {
            if (step.id !== stepId) return step;
            return {
                ...step,
                content: step.content.map(b => b.id === blockId ? { ...b, value } : b)
            };
        }));
    };

    const handleFileSelect = (stepId: string, blockId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFilesMap(prev => ({
                ...prev,
                [stepId]: {
                    ...(prev[stepId] || {}),
                    [blockId]: file
                }
            }));
            handleUpdateBlockInStep(stepId, blockId, URL.createObjectURL(file));
        }
    };

    const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBannerFile(e.target.files[0]);
        }
    };

    // --- Save Logic ---
    const handleSave = async () => {
        if (!title) return alert("Title is required");
        setIsProcessing(true);
        try {
            const slug = editItinerary?.slug || title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
            const basePath = `itineraries/${slug}`;

            // 1. Upload Global Banner
            let finalBannerUrl = bannerUrl; // Keep existing if no new file
            if (bannerFile) {
                finalBannerUrl = await uploadFileToStorage(bannerFile, `${basePath}/banner/${bannerFile.name}`);
            }

            // 2. Process Steps and Blocks
            const finalSteps = await Promise.all(steps.map(async (step, stepIndex) => {
                const processedContent = await Promise.all(step.content.map(async (block, blockIndex) => {
                    // If it's a file block and we have a file
                    if ((block.type === "image" || block.type === "video") && filesMap[step.id]?.[block.id]) {
                        const file = filesMap[step.id][block.id];
                        const folder = block.type === "image" ? "images" : "videos";
                        const downloadUrl = await uploadFileToStorage(file, `${basePath}/steps/${step.id}/${folder}/${file.name}`);
                        return { ...block, value: downloadUrl, order: blockIndex + 1 };
                    }
                    return { ...block, order: blockIndex + 1 };
                }));

                return {
                    ...step,
                    order: stepIndex + 1,
                    content: processedContent
                };
            }));

            const itineraryData: Omit<ItineraryModel, "id"> = {
                title,
                slug,
                banner: finalBannerUrl,
                steps: finalSteps,
                date: editItinerary?.date || new Date().toISOString(),
            };

            if (editItinerary) {
                // Update existing itinerary
                await updateItinerary(editItinerary.id, itineraryData);
            } else {
                // Create new itinerary
                await createItinerary(itineraryData);
            }

            onClose();

            // Reset
            setTitle("");
            setBannerFile(null);
            setBannerUrl("");
            setSteps([]);
            setFilesMap({});
        } catch (e) {
            console.error(e);
            alert(editItinerary ? "Error updating itinerary" : "Error creating itinerary");
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
                        className="relative flex h-full w-[95%] max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
                        style={{ maxHeight: "95vh" }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b p-4 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-10">
                            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                                {editItinerary ? "Editar Itinerario" : literals.itineraryCreation.modalTitle}
                            </h2>
                            <button onClick={onClose} className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <IconX size={24} className="text-neutral-500" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-neutral-50 dark:bg-black/20">
                            {/* Global Info */}
                            <div className="mb-8 grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                        {literals.itineraryCreation.inputs.title}
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full rounded-lg border p-3 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white focus:ring-2 outline-none"
                                        style={{ borderColor: styles.brand.primary }}
                                        placeholder="Ruta por los Alpes..."
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                        {literals.itineraryCreation.inputs.banner}
                                    </label>
                                    <div className="flex gap-4 items-center">
                                        <input
                                            ref={bannerInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleBannerSelect}
                                            className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-neutral-800 dark:file:text-neutral-300"
                                        />
                                        {(bannerFile || bannerUrl) && (
                                            <div className="h-12 w-20 rounded overflow-hidden">
                                                <img
                                                    src={bannerFile ? URL.createObjectURL(bannerFile) : bannerUrl}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>

                            <hr className="mb-8 border-neutral-200 dark:border-neutral-800" />

                            {/* Steps List */}
                            <h3 className="mb-4 text-xl font-bold dark:text-white">Pasos del Itinerario</h3>

                            <Reorder.Group axis="y" values={steps} onReorder={setSteps} className="flex flex-col gap-6">
                                {steps.map((step, index) => (
                                    <Reorder.Item
                                        key={step.id}
                                        value={step}
                                        whileDrag={{ opacity: 0.7, scale: 1.01 }}
                                        className="relative rounded-2xl border bg-white p-6 shadow-sm dark:bg-neutral-900 dark:border-neutral-700"
                                    >
                                        {/* Step Header */}
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-600">
                                                    <IconGridDots size={24} />
                                                </div>
                                                <h4 className="text-lg font-bold text-neutral-800 dark:text-white">
                                                    {literals.itineraryCreation.step} {index + 1}
                                                </h4>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveStep(step.id)}
                                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                                            >
                                                <IconTrash size={20} />
                                            </button>
                                        </div>

                                        {/* Tag Menu for Step */}
                                        <div className="mb-4 flex flex-wrap gap-2">
                                            <TagButton label="Texto" icon={<IconTxt size={16} />} onClick={() => handleAddBlockToStep(step.id, "text")} />
                                            <TagButton label="Destacado" icon={<IconBold size={16} />} onClick={() => handleAddBlockToStep(step.id, "accent")} />
                                            <TagButton label="Enlace" icon={<IconLink size={16} />} onClick={() => handleAddBlockToStep(step.id, "link")} />
                                            <TagButton label="Imagen" icon={<IconPhoto size={16} />} onClick={() => handleAddBlockToStep(step.id, "image")} />
                                            <TagButton label="Video" icon={<IconVideo size={16} />} onClick={() => handleAddBlockToStep(step.id, "video")} />
                                        </div>

                                        {/* Blocks in Step */}
                                        <Reorder.Group
                                            axis="y"
                                            values={step.content}
                                            onReorder={(newContent) => {
                                                setSteps(prev => prev.map(s => s.id === step.id ? { ...s, content: newContent } : s));
                                            }}
                                            className="flex flex-col gap-3 pl-4 border-l-2 border-neutral-100 dark:border-neutral-800"
                                        >
                                            {step.content.map((block) => (
                                                <Reorder.Item
                                                    key={block.id}
                                                    value={block}
                                                    whileDrag={{ opacity: 0.7 }}
                                                    className="relative rounded-lg border bg-neutral-50 p-3 dark:bg-neutral-800 dark:border-neutral-700"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-2 cursor-grab active:cursor-grabbing text-neutral-400">
                                                            <IconGridDots size={16} />
                                                        </div>

                                                        <div className="flex-1">
                                                            {block.type === "text" && (
                                                                <textarea
                                                                    className="w-full rounded bg-transparent p-2 outline-none dark:text-white"
                                                                    placeholder="Descripción del paso..."
                                                                    value={block.value}
                                                                    onChange={(e) => handleUpdateBlockInStep(step.id, block.id, e.target.value)}
                                                                />
                                                            )}
                                                            {block.type === "image" && (
                                                                <div>
                                                                    <input
                                                                        type="file"
                                                                        className="mb-2 block w-full text-sm text-neutral-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700"
                                                                        onChange={(e) => handleFileSelect(step.id, block.id, e)}
                                                                    />
                                                                    {block.value && <img src={block.value} className="h-32 rounded object-cover" />}
                                                                </div>
                                                            )}
                                                            {/* Add other types as needed, simplifying for brevity */}
                                                            {(block.type === "accent" || block.type === "link" || block.type === "video") && (
                                                                <input
                                                                    type="text"
                                                                    className="w-full rounded bg-transparent p-2 outline-none dark:text-white border-b border-neutral-200 dark:border-neutral-600 focus:border-blue-500"
                                                                    placeholder={`Contenido para ${block.type}...`}
                                                                    value={block.value}
                                                                    onChange={(e) => handleUpdateBlockInStep(step.id, block.id, e.target.value)}
                                                                />
                                                            )}
                                                        </div>

                                                        <button
                                                            onClick={() => handleRemoveBlockFromStep(step.id, block.id)}
                                                            className="text-neutral-400 hover:text-red-500"
                                                        >
                                                            <IconX size={16} />
                                                        </button>
                                                    </div>
                                                </Reorder.Item>
                                            ))}
                                        </Reorder.Group>

                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>

                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={handleAddStep}
                                    className="flex items-center gap-2 rounded-full border-2 border-dashed border-neutral-300 px-6 py-3 font-bold text-neutral-500 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-500 transition-colors dark:border-neutral-700 dark:hover:bg-neutral-800"
                                >
                                    <IconPlus size={20} />
                                    {literals.itineraryCreation.addStep}
                                </button>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-4 border-t p-4 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-10">
                            <button
                                onClick={onClose}
                                className="rounded-lg bg-red-500 px-6 py-2 font-bold text-white transition hover:bg-red-600"
                            >
                                {literals.itineraryCreation.buttons.cancel}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isProcessing}
                                className="rounded-lg px-6 py-2 font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                                style={{ backgroundColor: styles.brand.primary }}
                            >
                                {isProcessing ? literals.common.loading : (editItinerary ? "Guardar Cambios" : literals.itineraryCreation.buttons.accept)}
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
            className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition hover:shadow-md dark:border-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800"
            style={{
                borderColor: styles.brand.primary,
            }}
        >
            <span style={{ color: styles.brand.primary }}>{icon}</span>
            {label}
        </button>
    )
}
