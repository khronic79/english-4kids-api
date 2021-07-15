import fileUpload from 'express-fileupload';
import {Router} from 'express';

export const routerFiles = Router();

routerFiles.post('/img', async (req, res) => {

    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
        // accessing the file
    const myFile = req.files.file as fileUpload.UploadedFile;

    //  mv() method places the file inside public directory
    myFile.mv(`${__dirname}/wwwroot/img/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        return res.send({name: myFile.name, path: `/${myFile.name}`});
    });
  });

routerFiles.post('/audio', async (req, res) => {

    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
        // accessing the file
    const myFile = req.files.file as fileUpload.UploadedFile;

    //  mv() method places the file inside public directory
    myFile.mv(`${__dirname}/wwwroot/audio/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        return res.send({name: myFile.name, path: `/${myFile.name}`});
    });
});