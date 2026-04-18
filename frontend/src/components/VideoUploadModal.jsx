import React, { useState } from "react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Loader2, Upload, Video as VideoIcon, Image as ImageIcon, CheckCircle2 } from "lucide-react";

const VideoUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        videoFile: null,
        thumbnail: null
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.videoFile || !formData.thumbnail) {
            setError("Both video and thumbnail are required.");
            return;
        }

        setError("");
        setLoading(true);

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("videoFile", formData.videoFile);
        data.append("thumbnail", formData.thumbnail);

        try {
            await api.post("/videos", data);
            setSuccess(true);
            setTimeout(() => {
                onUploadSuccess();
                onClose();
                setSuccess(false);
                setFormData({ title: "", description: "", videoFile: null, thumbnail: null });
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to upload video. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl overflow-hidden p-0">
                <DialogHeader className="p-6 bg-muted/30">
                    <DialogTitle className="text-xl font-black">Upload a video</DialogTitle>
                    <DialogDescription>
                        Drag and drop video files to upload
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold">Upload Successful!</h3>
                        <p className="text-muted-foreground italic text-sm">Your video is being processed and will be live soon.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg font-medium border border-destructive/20">{error}</div>}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold pl-1 uppercase tracking-wider text-muted-foreground text-[10px]">Video File</label>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors border-primary/20">
                                    <VideoIcon className="w-8 h-8 text-primary mb-2" />
                                    <span className="text-xs font-medium text-muted-foreground truncate max-w-[300px]">
                                        {formData.videoFile ? formData.videoFile.name : "Select video file"}
                                    </span>
                                    <input type="file" className="hidden" accept="video/*" onChange={(e) => setFormData({ ...formData, videoFile: e.target.files[0] })} />
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold pl-1 uppercase tracking-wider text-muted-foreground text-[10px]">Thumbnail</label>
                                <label className="flex items-center gap-4 p-4 border-2 border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors border-primary/20">
                                    <ImageIcon className="w-6 h-6 text-primary" />
                                    <span className="text-xs font-medium text-muted-foreground truncate">
                                        {formData.thumbnail ? formData.thumbnail.name : "Choose a thumbnail"}
                                    </span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files[0] })} />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold pl-1">Title</label>
                                <Input
                                    placeholder="Enter a catchy title"
                                    className="bg-muted/30 h-11"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold pl-1">Description</label>
                                <textarea
                                    placeholder="Tell viewers about your video"
                                    className="w-full min-h-[100px] bg-muted/30 border rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="submit" disabled={loading} className="w-full rounded-full h-11 font-bold">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                Upload Video
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default VideoUploadModal;
