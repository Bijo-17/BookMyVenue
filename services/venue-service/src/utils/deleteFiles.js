
const fs = require('fs/promises');
const path = require('path');

const deleteFiles = async (files = [])=> {
 
     if(!files.length) return;

     await Promise.all(
        files.map(async (file)=> {
             try {

                const filePath = path.join(
                    process.cwd(),
                    file.path
                )

                await fs.unlink(filePath);
                
             } catch (error) {
                console.log('unable to delete'+file.filename+' '+error)
             }
        })
     )
}

module.exports = deleteFiles;