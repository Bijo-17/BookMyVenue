


import React, { useRef, useState, useCallback } from 'react'
import { ArrowLeft, Layers, Star, Tag, Clock, Users, Upload, Car, Wifi, Tv, Utensils, Shield, Trash2, Check, RefreshCw, Plus, Crop, X, AlertCircle } from 'lucide-react'
import { BASE_URL }  from '../../utils/constants'
import Cropper from 'react-easy-crop'
import axios from 'axios'

import { useToast } from '../../context/ToastContext'

const FACILITIES = [
    { name: "Parking", icon: Car },
    { name: "WiFi", icon: Wifi },
    { name: "AC", icon: Tv },
    { name: "Projector", icon: Layers },
    { name: "Stage", icon: Layers },
    { name: "Sound System", icon: Layers },
    { name: "Catering", icon: Utensils },
    { name: "Power Backup", icon: Shield }
];

const IDEAL_FOR = [
    "Reception", "Wedding", "Birthday", "Meeting", "Conference", "Party", "Corporate Event"
];

const VENUE_TYPES = [
    "Banquet hall",
    "Rooftop venue",
    "Lawn / garden",
    "Conference hall",
    "Resort",
    "Restaurant / cafe",
    "Auditorium",
    "Farmhouse",
    "Convention center",
];

async function getCroppedImg(src, cropPixels) {
    const image = await new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
    const canvas = document.createElement("canvas")
    canvas.width = cropPixels.width
    canvas.height = cropPixels.height
    const ctx = canvas.getContext("2d")
    ctx.drawImage(
        image,
        cropPixels.x,
        cropPixels.y,
        cropPixels.width,
        cropPixels.height,
        0,
        0,
        cropPixels.width,
        cropPixels.height,
    )
    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => resolve({ url: URL.createObjectURL(blob), blob }),
            "image/jpeg",
            0.9,
        )
    })
}

const EditVenue = ({ formData, onCancel, onSaveSuccess }) => {


    const [submitting, setSumbitting] = useState(false);

    const [editForm, setEditForm] = useState({
        ...formData,
        images: formData.images || []
    });

    const fileRef = useRef(null);
    const [photoError, setPhotoError] = useState("");
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Drag and Drop States
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    // Replace Image State Tracker
    const [replaceIndex, setReplaceIndex] = useState(null);

    // Crop Modal States
    const [cropState, setCropState] = useState(null); // { queue: [], src, originalFile }
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [cropPixels, setCropPixels] = useState(null);

    const [cropping, setCropping] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 4000);
    };

    // const { showToast } = useToast();

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setEditForm(prev => ({ ...prev, [id]: value }));
    }

    const handlePhotoUpload = () => {
        setReplaceIndex(null);
        fileRef.current?.click();
    };

    const handleFacilityToggle = (facilityName) => {
        setEditForm(prev => {
            const current = prev.facilities;
            const updated = current.includes(facilityName)
                ? current.filter(f => f !== facilityName)
                : [...current, facilityName];
            return { ...prev, facilities: updated };
        });
    };


    const handleIdealForToggle = (tag) => {
        setEditForm(prev => {
            const current = prev.idealFor;
            const updated = current.includes(tag)
                ? current.filter(t => t !== tag)
                : [...current, tag];
            return { ...prev, idealFor: updated };
        });
    };

    const handleStatusToggle = (status) => {
        setEditForm(prev => ({ ...prev, isAvailable: status }));
    };

    
    // Photo uploads constraints
    const MAX_PHOTOS = 10;
    const MAX_SIZE = 5 * 1024 * 1024;

    const queueFiles = (fileList) => {
        setPhotoError("");
        const files = Array.from(fileList);

        // Handle image replacement flow
        if (replaceIndex !== null) {
            const file = files[0];
            if (!file) return;
            if (!/^image\/(jpeg|png)$/.test(file.type)) {
                setPhotoError("Only JPG or PNG images are allowed.");
                return;
            }
            if (file.size > MAX_SIZE) {
                setPhotoError("Each photo must be 5MB or smaller.");
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setCropState({ queue: [], src: reader.result, originalFile: file });
                setCrop({ x: 0, y: 0 });
                setZoom(1);
            };
            reader.readAsDataURL(file);
            return;
        }

        // Handle standard upload new images flow
        const room = MAX_PHOTOS - editForm.images.length;
        if (room <= 0) {
            setPhotoError(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
            return;
        }

        const validFiles = [];
        for (const file of files.slice(0, room)) {
            if (!/^image\/(jpeg|png)$/.test(file.type)) {
                setPhotoError("Only JPG or PNG images are allowed.");
                continue;
            }
            if (file.size > MAX_SIZE) {
                setPhotoError("Each photo must be 5MB or smaller.");
                continue;
            }
            validFiles.push(file);
        }

        if (!validFiles.length) return;

        Promise.all(
            validFiles.map(
                (file) =>
                    new Promise((res) => {
                        const reader = new FileReader();
                        reader.onload = () => res({ src: reader.result, originalFile: file });
                        reader.readAsDataURL(file);
                    })
            )
        ).then((results) => {
            const [first, ...rest] = results;
            setCropState({
                queue: rest,
                src: first.src,
                originalFile: first.originalFile
            });
            setCrop({ x: 0, y: 0 });
            setZoom(1);
        });
    };

    const onCropComplete = useCallback((_, areaPixels) => setCropPixels(areaPixels), []);

    const confirmCrop = async () => {
        if (!cropState || !cropPixels) return;
        setCropping(true);
        try {
            const cropped = await getCroppedImg(cropState.src, cropPixels);
            const croppedFile = new File([cropped.blob], cropState.originalFile.name, { type: cropState.originalFile.type });

            if (replaceIndex !== null) {
                const updatedImages = [...editForm.images];
                updatedImages[replaceIndex] = {
                    url: cropped.url,
                    file: croppedFile,
                    originalFile: cropState.originalFile,
                    isNew: true,
                    isPrimary: replaceIndex === 0
                };
                setEditForm(prev => ({ ...prev, images: updatedImages }));
                setReplaceIndex(null);
                setCropState(null);
                setCropPixels(null);

            } else {
                setEditForm(prev => ({
                    ...prev,
                    images: [
                        ...prev.images,
                        {
                            url: cropped.url,
                            file: croppedFile,
                            originalFile: cropState.originalFile,
                            isNew: true,
                            isPrimary: prev.images.length === 0
                        }
                    ]
                }));

                const [next, ...rest] = cropState.queue;
                if (next) {
                    setCropState({
                        queue: rest,
                        src: next.src,
                        originalFile: next.originalFile
                    });
                    setCrop({ x: 0, y: 0 });
                    setZoom(1);
                    setCropPixels(null);
                } else {
                    setCropState(null);
                    setCropPixels(null);
                }
            }
        } catch (err) {
            console.error("Cropping failed:", err);
            setPhotoError("Failed to crop image. Please try again.");
            setCropState(null);
            setCropping(false);
        } finally {
            setCropping(false);
        }
    };

    const skipCrop = () => {
        setReplaceIndex(null);
        setCropping(false)
        if (!cropState) return;
        const [next, ...rest] = cropState.queue;
        if (next) {
            setCropState({
                queue: rest,
                src: next.src,
                originalFile: next.originalFile
            });
            setCrop({ x: 0, y: 0 });
            setZoom(1);
        } else {
            setCropState(null);
        }
    };

    const handleDeletePhoto = (idx) => {
        setEditForm(prev => {
            const updated = prev.images.filter((_, i) => i !== idx);
            const reordered = updated.map((img, i) => ({
                ...img,
                isPrimary: i === 0
            }));
            return { ...prev, images: reordered };
        });
    };

     const handleReplaceClick = (idx) => {
        setReplaceIndex(idx);
        fileRef.current?.click();
    };

     // Drag and Drop implementation
    const handleDragStart = (e, idx) => {
        setDraggedIndex(idx);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, idx) => {
        e.preventDefault();
        if (draggedIndex === idx) return;
        setDragOverIndex(idx);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDrop = (e, targetIdx) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === targetIdx) return;

        setEditForm(prev => {
            const updated = [...prev.images];
            const [moved] = updated.splice(draggedIndex, 1);
            updated.splice(targetIdx, 0, moved);

            const finalImages = updated.map((img, i) => ({
                ...img,
                isPrimary: i === 0
            }));

            return { ...prev, images: finalImages };
        });

        setDraggedIndex(null);
        setDragOverIndex(null);
    };


    const handleFormSubmit = async (e) => {

         if (e) e.preventDefault();

        // Front-end Validations
        if (!editForm.venueName?.trim()) {
            showToast("Venue name is required", "error");
            return;
        }
        if (!editForm.venueType) {
            showToast("Venue type is required", "error");
            return;
        }
        if (!editForm.capacity || Number(editForm.capacity) < 5) {
            showToast("Minimum capacity should be 5 person", "error");
            return;
        }
        if (!editForm.pricePerHour && !editForm.pricePerDay) {
            showToast("Please provide at least one pricing rate", "error");
            return;
        }
        if (editForm.images.length === 0) {
            showToast("Please upload at least one photo of the venue", "error");
            return;
        }
         if(!editForm.description.trim()){
            showToast("Enter the description of the Venue");
            return;
         }
          if(!editForm.facilities.length){
             showToast("Select the venue facilities");
             return;
          }
          if(!editForm.idealFor.length){
             showToast("Select Ideal for events");
             return;
          }

        setSumbitting(true);

         const formDataPayload = new FormData();

        formDataPayload.append("venueName", editForm.venueName || "");
        formDataPayload.append("venueType", editForm.venueType || "");
        formDataPayload.append("description", editForm.description || "");
        formDataPayload.append("address", editForm.address || "");
        formDataPayload.append("city", editForm.city || "");
        formDataPayload.append("pincode", editForm.pincode || "");
        formDataPayload.append("capacity", editForm.capacity || "");
        formDataPayload.append("pricePerHour", editForm.pricePerHour || "");
        formDataPayload.append("pricePerDay", editForm.pricePerDay || "");
        formDataPayload.append("isAvailable", editForm.isAvailable);
        formDataPayload.append("venuePhone", editForm.venuePhone);

        formDataPayload.append("facilities",  JSON.stringify(editForm.facilities));
        formDataPayload.append("idealFor", JSON.stringify(editForm.idealFor));


      // Creating images metadata 
        let newPhotoIdx = 0;
        const imagesMetadata = editForm.images.map((img, idx) => {
            if (img.isNew) {
                const meta = {
                    type: "new",
                    fileIndex: newPhotoIdx,
                    isPrimary: idx === 0
                };
                newPhotoIdx++;
                return meta;
            } else {
                return {
                    type: "existing",
                    filename: img.filename,
                    isPrimary: idx === 0,
                };
            }
        });

         formDataPayload.append("imagesMetadata", JSON.stringify(imagesMetadata));

         editForm.images.forEach(img => {
            if (img.isNew && img.file) {
                formDataPayload.append("newPhotos", img.file);
                // if (img.originalFile) {
                //     formDataPayload.append("originalPhotos", img.originalFile);
                // }
            }
        });

        try {

            const venueId = formData._id;
            const res = await axios.put(`${BASE_URL}/api/venues/venue/editVenue/${venueId}`, formDataPayload, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (res.data.success) {
                showToast("Venue updated successfully!", "success");
                onSaveSuccess(res.data.venue);
              
            } else {
                throw new Error(res.data.message || "Failed to update venue");
            }

            
        } catch (error) {

            showToast(error?.response?.data || "Something went wrong while saving.", "error");
            
        } finally {
            setSumbitting(false);
        }
    }

    return (

        <div className="w-full pb-20 md:pb-0">

              {/* Toast Feedback Notification */}
            {toast.show && (
                <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-[#FCFBF8] border border-[#2D3436]/10 px-5 py-3 rounded-2xl shadow-xl animate-fade-in transition-all">
                    {toast.type === 'success' ? (
                        <Check className="h-5 w-5 text-emerald-600 animate-bounce" />
                    ) : (
                        <AlertCircle className="h-5 w-5 text-[#990302] animate-pulse" />
                    )}
                    <span className="text-sm font-semibold text-[#2D3436]">{toast.message}</span>
                    <button onClick={() => setToast(prev => ({ ...prev, show: false }))}>
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                </div>
            )}

            {/* Navigation & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-[#2D3436]/10 pb-6">
                <div>
                    <button
                        onClick={onCancel}
                        className="inline-flex items-center text-[#2D3436]/60 hover:text-[#990302] font-semibold text-sm mb-2 transition-colors duration-200"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1.5" />
                        Back to Venues
                    </button>
                    <h2 className="font-bold text-3xl text-[#2D3436] leading-tight">Edit Venue</h2>
                    <p className="text-[#2D3436]/60 text-sm mt-1">Update details for "{formData.venueName || 'Untitled Venue'}"</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Status Control Toggle */}
                    <div className="flex items-center gap-3 bg-[#FCFBF8] px-4 py-2 rounded-2xl border border-[#2D3436]/10">
                        <span className="text-xs font-bold text-[#2D3436]/60 uppercase tracking-wider">Status</span>
                        <div className="flex items-center bg-gray-100 p-0.5 rounded-full border border-gray-200">
                            <button
                                type="button"
                                onClick={() => handleStatusToggle(true)}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all duration-200 ${editForm.isAvailable
                                    ? 'bg-[#990302] text-white shadow-sm'
                                    : 'text-[#2D3436]/60 hover:text-[#990302]'
                                    }`}
                            >
                                Active
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusToggle(false)}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all duration-200 ${!editForm.isAvailable
                                    ? 'bg-[#990302] text-white shadow-sm'
                                    : 'text-[#2D3436]/60 hover:text-[#990302]'
                                    }`}
                            >
                                Paused
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl bg-white border border-[#2D3436]/15 text-[#2D3436] font-semibold text-sm hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleFormSubmit}
                        disabled={submitting}
                        className="px-5 py-2.5 rounded-xl bg-[#990302] text-white font-semibold text-sm hover:bg-[#800201] transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Form Grid (Bento style) */}
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Left Column (Primary Details) */}
                <div className="xl:col-span-7 space-y-8">

                    {/* General Information */}
                    <section className="bg-[#FCFBF8] rounded-2xl border border-[#2D3436]/10 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="p-2 bg-[#990302]/10 rounded-lg text-[#990302]">
                                <Layers className="h-5 w-5" />
                            </span>
                            <h3 className="text-lg font-bold text-[#2D3436]">General Information</h3>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[#2D3436]/70 mb-1.5 uppercase tracking-wider" htmlFor="name">Venue Name</label>
                                <input
                                    id="venueName"
                                    type="text"
                                    value={editForm.venueName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full h-12 rounded-xl px-4 text-[#2D3436] bg-[#FCFBF8] border border-[#2D3436]/15 focus:border-[#990302] focus:ring-0 focus:outline-none transition-all duration-200 placeholder:text-[#2D3436]/40 focus:shadow-[0_0_0_4px_#9903022e]"
                                    placeholder="Enter the name of your venue"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#2D3436]/70 mb-1.5 uppercase tracking-wider" htmlFor="type">Venue Type</label>
                                <select
                                    id="venueType"
                                    value={editForm.venueType}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full h-12 rounded-xl px-4 text-[#2D3436] bg-[#FCFBF8] border border-[#2D3436]/15 focus:border-[#990302] focus:ring-0 focus:outline-none transition-all duration-200 focus:shadow-[0_0_0_4px_#9903022e]"
                                >
                                    <option value="" disabled>Select venue type</option>
                                    {VENUE_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#2D3436]/70 mb-1.5 uppercase tracking-wider" htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    rows="4"
                                    value={editForm.description}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full rounded-xl px-4 py-3 text-[#2D3436] bg-[#FCFBF8] border border-[#2D3436]/15 focus:border-[#990302] focus:ring-0 focus:outline-none transition-all duration-200 resize-none placeholder:text-[#2D3436]/40 focus:shadow-[0_0_0_4px_#9903022e]"
                                    placeholder="Provide a detailed description of the space..."
                                />
                            </div>

                            {/* Location Address Block */}
                            <div>
                                <label className="block text-xs font-bold text-[#2D3436]/70 mb-1.5 uppercase tracking-wider">Address Details</label>
                                <div className="space-y-3">
                                    <input
                                        id="address"
                                        type="text"
                                        value={editForm.address}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Street address or Area"
                                        className="w-full h-12 rounded-xl px-4 text-[#2D3436] bg-[#FCFBF8] border border-[#2D3436]/15 focus:border-[#990302] focus:ring-0 focus:outline-none transition-all duration-200 placeholder:text-[#2D3436]/40 focus:shadow-[0_0_0_4px_#9903022e]"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            id="city"
                                            type="text"
                                            value={editForm.city}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="City"
                                            className="w-full h-12 rounded-xl px-4 text-[#2D3436] bg-[#FCFBF8] border border-[#2D3436]/15 focus:border-[#990302] focus:ring-0 focus:outline-none transition-all duration-200 placeholder:text-[#2D3436]/40 focus:shadow-[0_0_0_4px_#9903022e]"
                                        />
                                        <input
                                            id="pincode"
                                            type="text"
                                            value={editForm.pincode}
                                            onChange={handleInputChange}
                                            placeholder="Zip/Pincode"
                                            className="w-full h-12 rounded-xl px-4 text-[#2D3436] bg-[#FCFBF8] border border-[#2D3436]/15 focus:border-[#990302] focus:ring-0 focus:outline-none transition-all duration-200 placeholder:text-[#2D3436]/40 focus:shadow-[0_0_0_4px_#9903022e]"
                                        />
                                    </div>
                                    <input
                                            id="venuePhone"
                                            type="text"
                                            value={editForm.venuePhone}
                                            onChange={handleInputChange}
                                            placeholder="phone number"
                                            className="w-full h-12 rounded-xl px-4 text-[#2D3436] bg-[#FCFBF8] border border-[#2D3436]/15 focus:border-[#990302] focus:ring-0 focus:outline-none transition-all duration-200 placeholder:text-[#2D3436]/40 focus:shadow-[0_0_0_4px_#9903022e]"
                                        />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Amenities (Checklist Grid) */}
                    <section className="bg-[#FCFBF8] rounded-2xl border border-[#2D3436]/10 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="p-2 bg-[#990302]/10 rounded-lg text-[#990302]">
                                <Star className="h-5 w-5" />
                            </span>
                            <h3 className="text-lg font-bold text-[#2D3436]">Amenities & Features</h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {FACILITIES.map(facility => {
                                const FacilityIcon = facility.icon;
                                const isChecked = editForm.facilities.includes(facility.name);
                                return (
                                    <label
                                        key={facility.name}
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${isChecked
                                            ? 'border-[#990302] bg-[#990302]/5 text-[#990302]'
                                            : 'border-[#2D3436]/10 bg-white text-[#2D3436] hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleFacilityToggle(facility.name)}
                                            className="hidden"
                                        />
                                        <FacilityIcon className="h-4.5 w-4.5" />
                                        <span className="text-sm font-medium">{facility.name}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </section>

                    {/* Ideal For Tags */}
                    <section className="bg-[#FCFBF8] rounded-2xl border border-[#2D3436]/10 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="p-2 bg-[#990302]/10 rounded-lg text-[#990302]">
                                <Tag className="h-5 w-5" />
                            </span>
                            <h3 className="text-lg font-bold text-[#2D3436]">Ideal For Events</h3>
                        </div>
                        <p className="text-xs text-[#2D3436]/60 mb-4">Select event types suited for this venue.</p>

                        <div className="flex flex-wrap gap-2.5">
                            {IDEAL_FOR.map(tag => {
                                const isChecked = editForm.idealFor.includes(tag);
                                return (
                                    <button
                                        type="button"
                                        key={tag}
                                        onClick={() => handleIdealForToggle(tag)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${isChecked
                                            ? 'bg-[#990302] border-[#990302] text-white'
                                            : 'bg-white border-[#2D3436]/10 text-[#2D3436] hover:bg-gray-50'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Right Column (Logistics & Media) */}
                <div className="xl:col-span-5 space-y-8">

                    {/* Logistics & Pricing */}
                    <section className="bg-[#FCFBF8] rounded-2xl border border-[#2D3436]/10 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="p-2 bg-[#990302]/10 rounded-lg text-[#990302]">
                                <Clock className="h-5 w-5" />
                            </span>
                            <h3 className="text-lg font-bold text-[#2D3436]">Logistics & Pricing</h3>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[#2D3436]/70 mb-1.5 uppercase tracking-wider" htmlFor="capacity">Max Capacity</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Users className="h-4.5 w-4.5" />
                                    </span>
                                    <input
                                        id="capacity"
                                        type="number"
                                        value={editForm.capacity}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Max guest capacity"
                                        className="w-full h-12 rounded-xl pl-12 pr-4 text-[#2D3436] bg-[#FCFBF8] border border-[#2D3436]/15 focus:border-[#990302] focus:ring-0 focus:outline-none transition-all duration-200 focus:shadow-[0_0_0_4px_#9903022e]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#2D3436]/70 mb-1.5 uppercase tracking-wider" htmlFor="pricePerHour">Price Per Hour</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">₹</span>
                                        <input
                                            id="pricePerHour"
                                            type="number"
                                            value={editForm.pricePerHour}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Hourly rate"
                                            className="w-full h-12 rounded-xl pl-8 pr-4 text-[#2D3436] bg-[#FCFBF8] border border-[#2D3436]/15 focus:border-[#990302] focus:ring-0 focus:outline-none transition-all duration-200 focus:shadow-[0_0_0_4px_#9903022e]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#2D3436]/70 mb-1.5 uppercase tracking-wider" htmlFor="pricePerDay">Price Per Day</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">₹</span>
                                        <input
                                            id="pricePerDay"
                                            type="number"
                                            value={editForm.pricePerDay}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Daily rate"
                                            className="w-full h-12 rounded-xl pl-8 pr-4 text-[#2D3436] bg-[#FCFBF8] border border-[#2D3436]/15 focus:border-[#990302] focus:ring-0 focus:outline-none transition-all duration-200 focus:shadow-[0_0_0_4px_#9903022e]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

              {/* Media Gallery */}
               <section className="bg-[#FCFBF8] rounded-2xl border border-[#2D3436]/10 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="p-2 bg-[#990302]/10 rounded-lg text-[#990302]">
                                    <Upload className="h-5 w-5" />
                                </span>
                                <h3 className="text-lg font-bold text-[#2D3436]">Media Gallery</h3>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D3436]/60 bg-gray-100 px-2 py-1 rounded-full">
                                {editForm.images.length} / {MAX_PHOTOS} photos
                            </span>
                        </div>

                        {photoError && (
                            <div className="mb-4 text-xs font-semibold text-[#990302] bg-[#990302]/5 border border-[#990302]/20 p-3 rounded-xl flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>{photoError}</span>
                            </div>
                        )}

                        {/* Upload Dropzone / Button */}
                        {editForm.images.length < MAX_PHOTOS ? (
                            <div
                                onClick={handlePhotoUpload}
                                className="border-2 border-dashed border-[#2D3436]/20 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-white hover:bg-gray-50 transition-colors cursor-pointer mb-6"
                            >
                                <Upload className="h-8 w-8 text-[#2D3436]/40 mb-2" />
                                <p className="text-sm font-bold text-[#990302] mb-0.5">Click to upload photo</p>
                                <p className="text-xs text-[#2D3436]/60">Supports PNG, JPG (max. 5MB). Drag and drop below to rearrange.</p>
                                <input
                                    ref={fileRef}
                                    type='file'
                                    accept="image/jpeg,image/png"
                                    className='hidden'
                                    multiple
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            queueFiles(e.target.files);
                                        }
                                        e.target.value = "";
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="border border-[#2D3436]/10 rounded-xl p-4 text-center bg-gray-50 mb-6">
                                <p className="text-xs text-[#2D3436]/50">Maximum of {MAX_PHOTOS} photos uploaded. Delete or replace existing photos to make changes.</p>
                                <input
                                    ref={fileRef}
                                    type='file'
                                    accept="image/jpeg,image/png"
                                    className='hidden'
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            queueFiles(e.target.files);
                                        }
                                        e.target.value = "";
                                    }}
                                />
                            </div>
                        )}

                        {/* Media Grid with Drag and Drop */}
                        {editForm.images.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {editForm.images.map((photo, idx) => (
                                    <div
                                        key={idx}
                                        draggable={true}
                                        onDragStart={(e) => handleDragStart(e, idx)}
                                        onDragOver={(e) => handleDragOver(e, idx)}
                                        onDragEnd={handleDragEnd}
                                        onDrop={(e) => handleDrop(e, idx)}
                                        className={`aspect-square rounded-2xl overflow-hidden relative group border transition-all duration-300 ${draggedIndex === idx
                                            ? 'opacity-40 scale-95 border-dashed border-[#2D3436]/20'
                                            : dragOverIndex === idx
                                                ? 'border-2 border-dashed border-[#990302] scale-105 shadow-md'
                                                : 'border-[#2D3436]/10 hover:shadow-lg bg-[#FCFBF8]'
                                            }`}
                                    >
                                        <img
                                            src={photo.isNew ? photo.url : (photo.url.startsWith('http') ? photo.url : `${BASE_URL}${photo.url}`)}
                                            alt={`Venue workspace upload preview ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                                        />

                                        {/* Hover Overlay Menu */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleReplaceClick(idx)}
                                                title="Replace this image"
                                                className="bg-white p-2 rounded-full text-[#2D3436] hover:text-[#990302] hover:scale-110 transition-transform shadow-md"
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeletePhoto(idx)}
                                                title="Delete this image"
                                                className="bg-white p-2 rounded-full text-[#990302] hover:bg-red-50 hover:scale-110 transition-transform shadow-md"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Drag Indicator (Visual feedback) */}
                                        <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm p-1 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <Plus className="h-3 w-3 rotate-45" />
                                        </div>

                                        {/* Primary Cover Badge */}
                                        {idx === 0 && (
                                            <span className="absolute top-2 left-2 bg-[#990302] text-white px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider shadow-md">
                                                Cover
                                            </span>
                                        )}

                                        {/* Newly Added Badge */}
                                        {photo.isNew && (
                                            <span className="absolute bottom-2 left-2 bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider shadow-md">
                                                New
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-[#2D3436]/10 rounded-xl bg-gray-50">
                                <p className="text-xs text-[#2D3436]/50">No photos uploaded yet.</p>
                            </div>
                        )}
                    </section>
                </div>
            </form>

            {/* Sticky Mobile Actions Bar */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#FCFBF8] border-t border-[#2D3436]/10 p-4 flex gap-3 z-40 shadow-lg">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-xl bg-white border border-[#2D3436]/15 text-[#2D3436] font-semibold text-sm cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleFormSubmit}
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl bg-[#990302] text-white font-semibold text-sm shadow-sm active:bg-[#800201] disabled:opacity-50"
                >
                    {submitting ? 'Saving...' : 'Save'}
                </button>
            </div>

           {/* Image Crop Modal */}
            {cropState && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#2D3436]/10">
                        <div className="flex items-center justify-between border-b border-[#2D3436]/10 px-5 py-4">
                            <h3 className="flex items-center gap-2 font-bold text-[#2D3436]">
                                <Crop className="h-5 w-5 text-[#990302]" />
                                Crop Photo
                            </h3>
                            <button type="button" onClick={() => { setCropState(null); setReplaceIndex(null); }} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="relative h-72 w-full bg-[#EBE2E0]">
                            <Cropper
                                image={cropState.src}
                                crop={crop}
                                zoom={zoom}
                                aspect={4 / 3}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        <div className="px-5 py-5 bg-[#FCFBF8]">
                            <label className="mb-4 flex items-center gap-3">
                                <span className="text-xs font-bold text-[#2D3436]/70 uppercase tracking-wider">Zoom</span>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.01}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="flex-1 accent-[#990302] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </label>
                            <div className="flex items-center justify-between gap-3">
                                {cropState.queue && cropState.queue.length > 0 ? (
                                    <span className="text-xs font-semibold text-[#2D3436]/60">
                                        {cropState.queue.length} more photo{cropState.queue.length > 1 ? 's' : ''} in queue
                                    </span>
                                ) : (
                                    <span />
                                )}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={skipCrop}
                                        className="px-4 py-2 border border-[#2D3436]/15 hover:bg-gray-100 rounded-xl text-sm font-semibold text-[#2D3436] cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={confirmCrop}
                                        disabled={cropping}
                                        className="px-4 py-2 bg-[#990302] hover:bg-[#800201] text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:hover:bg-[#990302]"
                                    >
                                        <Check className="h-4 w-4" />
                                        {cropping ? 'Cropping...' : 'Crop & Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             )}
 

        </div>

    )
}

export default EditVenue;
