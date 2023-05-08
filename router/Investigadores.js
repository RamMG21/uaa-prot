const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("investigadores",{
        arrayInvestigadores: [
            {id:'001', nombre:'Jose', descripcion:'Aqui esta la descripcion'},
            {id:'001', nombre:'Jose', descripcion:'Aqui esta la descripcion'}
        ]
    })
})

module.exports = router;