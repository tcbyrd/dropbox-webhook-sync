// controllers/dropbox.js
'use strict';

const Dropbox = require('dropbox');
var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_API_BASE);

exports.index = (req, res) => {
  let token = req.session.token;
  if (!token) {
    res.redirect('/auth/new');
  }
  
  var dbx = new Dropbox({ accessToken: token });
  dbx.filesListFolder({ path: '/Boostnote/notes' })
    .then((response) => {
      let entries = response.entries.filter(entry => {
        if (entry.path_lower.endsWith('.cson')) { return true }
      })
      res.render('index', { entries: entries });
    })
    .catch(function(error) {
      res.render('index', { error: error });
    });
};

exports.process = () => {
  let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN })
  
  // TODO: Implement file deletion logic when removing a file from dropbox
  
  dbx.filesListFolder({ path: '/Boostnote/notes' })
   .then((response) => {
      let markdownFiles = response.entries.filter(entry => {
        if (entry.path_lower.endsWith('.cson')) { return true }
      })
      markdownFiles.forEach(file => {
       dbx.filesDownload({ path: file.path_lower})
       .then(blob => {
          base('Raw Notes').select({
            maxRecords: 1,
            view: 'Raw Data',
            filterByFormula: `({id}='${blob.id}')`
          }).firstPage((err, records) => {
            if(err) { console.error(err); return; }
            if(records.length === 0) {
              console.info('Record does not exist yet, creating...')
              base('Raw Notes').create(blob, (err, record) => {
                if(err) { console.error(err); return; }
                console.info('Record created:', record.getId())
              })
            } else {
              records.forEach(record => {
                let id = record.getId()
                let rev = record.fields['rev']
                
                console.info(`${record.getId()} rev is ${rev}. ${file.path_lower} rev is ${blob.rev}`)
                
                if (rev !== blob.rev) {
                  console.info('Existing record ID:', id)
                  base('Raw Notes').replace(id, blob, (err, record) => {
                    if(err) { console.error(err); return; }
                    console.info('Record updated:', id)
                  })  
                }
                
              })
            }
            
          })
        })
        
      })   
   })  
   
}