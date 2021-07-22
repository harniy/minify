const express = require('express')
const fs = require('fs')
const cors = require('cors')
const minify = require('minify');


const app = express()

app.use(cors())
app.use(express.json())



app.post('/', async function (req, res) {
    const userCode = req.body.userCode
    let fileExtension = ''
    let fileName = ''
    console.log(userCode)
    if (userCode.includes('base64')) {
        const userCodeSort = userCode.split('base64')

        // file name
        fileExtension = userCodeSort[0].split('/')[1] == 'javascript;' ? 'js' : userCodeSort[0].split('/')[1]
        fileName = `${Date.now()}.min.${fileExtension.replace(';', '')}`


        const buff = Buffer.from(userCodeSort[1], 'base64');

        const str = buff.toString('utf-8');



        new Promise(res => {
            fs.writeFile(`minify/${fileName}`, str, (e) => {
                if (e) throw e
                console.log('Write Complete!~~~')
                res()
            })
        }).then(() => {
            minimize()
        })


    }

    else {
        
        fileExtension = req.body.selectFormat
        fileName = `${Date.now()}.min.${fileExtension}`


        new Promise(res => {
            fs.writeFile(`minify/${fileName}`, userCode, (e) => {
                if (e) throw e
                console.log('Write Complete!~~~')
                res()
            })
        }).then(() => {
            minimize()
        })
    }

    const options = {
        html: {
            removeAttributeQuotes: false,
            removeOptionalTags: false,
        },
    };

    let minimize = () => {
        minify(`./minify/${fileName}`, options)
            .then((data => {
                setMinifyData(data)
                
                fs.unlink(`minify/${fileName}`, (e) => {
                    if (e) throw e
                    console.log('Delete file~~~')
                })
            }))
            .catch(console.error)
    }

    function setMinifyData(data) {
        res.json({
            format: fileExtension,
            minify: data,
            url: fileName
        })
    }


})


app.listen(1000, () => {
    console.log("Server start on 1000 PORT")
})


