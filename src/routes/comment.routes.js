import {Router} from 'express'


import  {addComment,
    updateComment,
    deleteComment,
    getVideoComment} from "../controllers/comment.controller.js"

import {verifyJWT} from "../middlewares/auth.middlewares.js"
const router=Router()

router.use(verifyJWT)
// router.route("/:commentId").post(addComment)

// router.route("/c/:commentId").patch(updateComment)

// router.route("/:videoId").get(getVideoComment)

// router.route("/:commentId").post(deleteComment)

//router.route("/c/:videoId").post(addComment)
// video ke comments
router.route("/:videoId")
  .get(getVideoComment)
  .post(addComment)

// single comment actions
router.route("/c/:commentId")
  .patch(updateComment)
  .delete(deleteComment)




export default router

