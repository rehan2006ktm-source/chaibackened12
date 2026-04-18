import {Router} from 'express'


import  {
    publishVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js"

import {verifyJWT} from "../middlewares/auth.middlewares.js"
import {upload} from "../middlewares/multer.middlewares.js"
const router=Router()

router.get("/", getAllVideos)

router.get("/:videoId", getVideoById)

router.post(
    "/",
    verifyJWT,
    upload.fields([
        {
            name:"videoFile",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),
    publishVideo
)

router.patch(
    "/:videoId",
    verifyJWT,
    upload.fields([
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),
    updateVideo
)

router.delete("/:videoId", verifyJWT, deleteVideo)

router.patch("/toggle/publish/:videoId", verifyJWT, togglePublishStatus)

export default router

