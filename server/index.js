import express from 'express';
import cors from 'cors';
import { Vulnerability } from './api_connect.js';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to get the records
app.get('/cveslist', (req, res) => {
  Vulnerability.find()
    .then(cves => res.json(cves))
    .catch(err => res.json(err));
});

// Endpoint to get the cvedetails
app.get('/cveslist/:id', (req, res) => {
    
    const { id } = req.params;
  
    Vulnerability.findOne({id})
      .then(cve => {
        // Check if the CVE exists
        if (!cve) {
          // If the CVE is not found, return a 404 Not Found response
          return res.status(404).json({ error: 'CVE not found' });
        }
        // If the CVE is found, return it in the response
        res.json(cve);
      })
      .catch(err => {
        // If an error occurs, return a 500 Internal Server Error response
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });


// Start the server
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});





  