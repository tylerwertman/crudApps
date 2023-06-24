const uploadModel = require("../models/upload.model")

module.exports.findAllUploads = async (req, res) => {
    const allPhotos = await uploadModel.find().sort({ createdAt: "descending" })
        res.status(200).send(allPhotos)
}
module.exports.createUpload = (req, res) => {
    const photo = req.file.filename
        uploadModel.create({ photo })
            .then((data) => {
                console.log("upload success", data)
                res.send(data)
            })
            .catch((err) => console.log("err", err))
}