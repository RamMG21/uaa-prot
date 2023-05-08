const express = require('express');
const router = express.Router();
const {PythonShell} = require('python-shell')
const path = require('path');
const fs = require('fs');
var multer  = require('multer');
const {zip} = require('zip-a-folder');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = __dirname+`/..`
    fs.mkdirSync(path, { recursive: true })
    return cb(null, path)
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + '-' + file.originalname.toLowerCase().split(' ').join('-') ) //originalName
  }
})
const upload = multer({ storage: storage })

router.get("/", (req, res) => {
  res.render("index", {Titulo: "Titulo Index"});
});

router.get("/home", (req, res) => {
    res.render("home", {Titulo: "mi titulo dinamico"});
  });

  router.get("/registro", (req, res) => {
    res.render("registro", {Titulo: "Titulo Registro"});
  });
  
router.get('/servicios', (req, res) => {
      res.render('servicios', {TituloServicios:"Este es el titulo de los servicios"});
  })
  
router.get('/ayuda', (req, res) => {
    res.render('ayuda');
  })
  
router.get('/acerca_de', (req, res) => {
  
    res.render('acerca_de');
  })
  
  router.get('/contacto', (req, res) => {
  
    res.render('contacto');
  })

  router.get('/procesamiento', (req, res) => {
  
    res.render('procesamiento');
  })

  router.post('/api/python', upload.single('file'), (req, res) => {
    if(!req.file) {
      console.log("No files")
      res.status(500).send({message: "No Files"})
    } else {
      console.log("File in req")
      console.log(req.file)    
     
      const filename = req.file.filename.split('.').slice(0, -1).join('.')
      const directory = path.resolve(__dirname, '../'+filename+'/');
      const file = path.resolve(__dirname, '../'+filename+'.zip');

      //Here are the option object in which arguments can be passed for the python_test.js.
      let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
          scriptPath: 'python_files', //If you are having python_test.py script in same folder, then it's optional.
        args: ['shubhamk314'] //An argument which can be accessed in the script using sys.argv[1]
      };
        
      var pyshell = new PythonShell('main.py', options);
      pyshell.on('message', function (message) { 
        // received a message sent from the Python script (a simple "print" statement)  
        console.log(message); 
      });
        
      pyshell.send(req.file.filename);
      pyshell.send(filename);
      pyshell.send('2');
      pyshell.send('1');
        
      pyshell.end(async function (err,code,signal) {
        if (err) throw err;
        console.log('The exit code was: ' + code);
        console.log('The exit signal was: ' + signal);            

        await zip(directory, file);      

        deleteFolderRecursive(directory) 
        console.log("removed", directory)          

        res.sendFile(file, function (err) {
          if (err) {
            console.error(err)
            return
          } else {
            fs.unlink(file, (err) => {
              if (err) {
                console.error(err)
                return
              }
              
              console.log("removed", file)
              fs.unlink(req.file.path, (err) => {
                if (err) {
                  console.error(err)
                  return
                }
                
                console.log("removed", req.file.path)
                console.log('finished');  
                //file removed
              })
              //file removed
            })
          }
        });          
      });
    }
  })

  router.get('/api/cpp', (req, res) => {
    const filename = 'cpp-files'    
    const file = path.resolve(__dirname, '../'+filename+'.zip');
    
    res.sendFile(file)
  })
  
  module.exports = router;

  const deleteFolderRecursive = function (directoryPath) {
    if (fs.existsSync(directoryPath)) {
      fs.readdirSync(directoryPath).forEach((file, index) => {
        const curPath = path.join(directoryPath, file);
        if (fs.lstatSync(curPath).isDirectory()) {
           // recurse
          deleteFolderRecursive(curPath);
        } else {
          // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(directoryPath);
    }
  };