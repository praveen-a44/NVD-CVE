import fetch from "node-fetch";
import { connect, Schema, model } from "mongoose";

// Define a dynamic schema for the vulnerability
const vulnerabilitySchema = new Schema({
    id: String // Specify the id field explicitly
   
}, { strict: false });

// Create a Mongoose model using the dynamic schema
export const Vulnerability = model('Vulnerability', vulnerabilitySchema);

export async function getPosts() {
    try {
        // Connect to MongoDB
        await connect("mongodb://0.0.0.0:27017/NVD", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process if unable to connect to MongoDB
    }
}

async function saveVulnerabilities() {
    try {
        // Connect to MongoDB
        await getPosts();

        const mypost = await fetch("https://services.nvd.nist.gov/rest/json/cves/2.0");
        const response = await mypost.json();
        const vulnerabilities = response.vulnerabilities;

        // Iterate over each vulnerability and save it to MongoDB
        for (const vulnerabilityData of vulnerabilities) {
            // Modify the id field to match the structure of the response
            const originalId = vulnerabilityData.cve.id;
            const idParts = originalId.split('-');
            const formattedId = `CVE-${idParts[1]}-${idParts[2]}`; // Reformat the id
            vulnerabilityData.cve.id = formattedId;
            
            const vulnerability = new Vulnerability(vulnerabilityData.cve);
            await vulnerability.save();
            console.log(`Vulnerability ${vulnerability.id} saved to MongoDB`);
        }

        // No need to disconnect from MongoDB here
        console.log("All vulnerabilities saved to MongoDB");
    } catch (error) {
        console.error('Error:', error);
    }
}

saveVulnerabilities();
