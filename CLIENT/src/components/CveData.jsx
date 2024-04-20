import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CveData = () => {
  const { id } = useParams(); 
  console.log(id);
  const [cveData, setCveData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/cveslist/${id}`) 
      .then(response => setCveData(response.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!cveData) {
    return <div>Loading...</div>;
  }

  return (
    <div class=" col text-start ">
      <h2 className='text-primary'>{cveData.id}</h2>
      <p><b>Description: </b>{cveData.descriptions.find(desc => desc.lang === 'en')?.value}</p>
      <h4>CVSS V2 Metrices:</h4>
      <p><b>Vector string: </b>{cveData.metrics.cvssMetricV2[0]?.cvssData.vectorString}</p>
      <table className="table table-striped table-bordered  ">
        <thead>
        <tr>
            <th>Access Vector</th>
            <th>Access Complexity</th>
            <th>Authentication</th>
            <th>Confidentiality Impact</th>
            <th>Integrity Impact</th>
            <th>Availability Impact</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>{cveData.metrics.cvssMetricV2[0]?.cvssData.accessVector}</td>
            <td>{cveData.metrics.cvssMetricV2[0]?.cvssData.accessComplexity}</td>
            <td>{cveData.metrics.cvssMetricV2[0]?.cvssData.authentication}</td>
            <td>{cveData.metrics.cvssMetricV2[0]?.cvssData.confidentialityImpact}</td>
            <td>{cveData.metrics.cvssMetricV2[0]?.cvssData.integrityImpact}</td>
            <td>{cveData.metrics.cvssMetricV2[0]?.cvssData.availabilityImpact}</td>
        </tr>
        </tbody>
    </table>

    <h4>Scores:</h4>
    <p><b>Exploitability Score: </b>{cveData.metrics.cvssMetricV2[0]?.exploitabilityScore}</p>
    <p><b>Impact Score:</b> {cveData.metrics.cvssMetricV2[0]?.impactScore}</p>

    <h4>CPE:</h4>

    <table className="table table-striped table-bordered ">
      <thead>
        <tr>
          <th>Criteria</th>
          <th>Match Criteria</th>
          <th>Vulnerable</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{cveData.configurations[0].nodes[0].cpeMatch[0].criteria}</td>
          <td>{cveData.configurations[0].nodes[0].cpeMatch[0].matchCriteriaId}</td>
          <td>{cveData.configurations[0].nodes[0].cpeMatch[0].vulnerable.toString()}</td>
        </tr>
      </tbody>
    </table>



     
      
    </div>
  );
}

export default CveData;
