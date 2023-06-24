const uploadMiddleware = require('../middleware/multerMiddleware')
const UploadController = require('../controllers/upload.controller')

module.exports = app => {
    app.get("/api/get", UploadController.findAllUploads)
    app.post("/api/save", uploadMiddleware.single('photo'), UploadController.createUpload)
}

