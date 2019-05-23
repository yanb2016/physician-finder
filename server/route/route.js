const express = require('express');
const router = express.Router();
const formatName = require ('../formatName');
const Physician = require('../models/Physician');

// find physician 
router.get('/physician/:firstName/:middleName/:lastName', (req, response) => {
  const firstName = req.params['firstName'];
  const middleName = req.params['middleName'];
  const lastName = req.params['lastName'];

  const formatFirName = formatName(firstName);
  const formatLstName = formatName(lastName);
  const formatMidName = formatName(middleName);
  // user may don't input middlename,  so just use fist and last name to query
  // if user used middle, can filter it later if get duplicate results

  Physician.find({firstname: formatFirName, lastname: formatLstName}, (err, res) => {
    if (err) {
      console.log('err!');
    } else {
      // for this case study, I used two params to find physician, in real case, I may need other 
      //accurate  params to query physician
      if(res.length === 0) {
        response.status(400).send('Physician Not in Database')
        return
      }
      console.log(res)
      if(res.length > 1) {
        for(let i = 0; i < res.length; i++) {
          if(formatMidName.indexOf(res[i].middlename) > -1) {
            response.json(res[i]);
            return;
          }
        }
      }
      // if just returned one physician, return it directly
      response.json(res[0])
    }
  })
});
module.exports = router;
