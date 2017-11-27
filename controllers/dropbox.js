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

exports.process = async () => {
  let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN })
  
  // TODO: Implement file deletion logic when removing a file from dropbox
  
  let files = await dbx.filesListFolder({ path: '/Boostnote/notes' })
  let csonFiles = await files.entries.filter(entry => {
    if (entry.path_lower.endsWith('.cson')) { return true }
  })
  csonFiles.forEach(async file => {
    
    let data = await dbx.filesDownload({ path: file.path_lower })
    
    base('Raw Notes').select({
    
      maxRecords: 1,
      view: 'Raw Data',
      filterByFormula: `({id}='${data.id}')`
    
    }).firstPage((err, records) => {
      
      if (err) { console.error(err); return; }
      
       if (records.length === 0) {
         base('Raw Notes').create(data, (err, record) => {
      
           if (err) { console.error(err); return; }
             console.info('Record created:', record.getid())
           })
         
       } else {
           
         records.forEach(record => {
           let id = record.getId()
           let rev = record.fields['rev']

           console.info(`${id} rev is ${rev}. ${file.path_lower} rev is ${data.rev}`)

           if (rev !== data.rev) {
             console.info('Existing record ID:', id)

             base('Raw Notes').replace(id, data, (err, record) => {
               if(err) { console.error(err); return; }
                 console.info('Record updated:', id)
               })  
           }
             
          })
           
         }
    })
    
  })
}