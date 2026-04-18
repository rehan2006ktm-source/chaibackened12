import { useState, useEffect, useCallback } from "react";
import { getAllVideos } from "@/services/videoService";

/**
 * Hook that fetches paginated/filtered videos.
 * @param {object} params - API query params (page, limit, query, sortBy, sortType, userId)
 */
export const useVideos = (params = {}) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVideos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllVideos(params);
            // data may be an array or paginated object
            setVideos(Array.isArray(data) ? data : (data?.docs || data?.videos || []));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load videos.");
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(params)]);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    return { videos, loading, error, refetch: fetchVideos };
};
