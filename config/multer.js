// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/productsImages/')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() 
//       cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
//   })

// let upload=multer({
//     storage: storage
// })

// const multipleUpload = upload.fields([{ name: 'main_image', maxCount: 1 },{ name: 'sub_image', maxCount: 3 }])

// modul.exports ={
//     multipleUpload,ids
// }