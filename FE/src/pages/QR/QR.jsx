import React, { useState } from 'react';
import QRCode from 'qrcode';
import { QrReader } from 'react-qr-reader';

function QR() {

  const [scanResultFile, setScanResultFile] = useState('');




  const handleScanFile = async (result) => {
    if (result) {
      setScanResultFile(result.text);
      if (result.text) {
        try {
          const response = await fetch(`https://localhost:7055/api/Order/CheckInSerivces?orderId=${result.text}`, {
            method: 'PUT',
          });
          if (response.status === 200) {
            alert('Check-In Successfully');
          } else {
            console.log('Check-In Failed', response.status);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handleErrorFile = (error) => {
    console.log(error);
  };


  return (
    <div className="container mx-auto mt-10">
      <div className="bg-blue-600 text-white p-5 text-center rounded-md">
        <h2 className="text-2xl">Generate, Download & Scan QR Code with React</h2>
      </div>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
       
          <QrReader
            delay={300}
            onError={handleErrorFile}
            onResult={handleScanFile}
            constraints={{ facingMode: 'environment' }}
          />
          <h3 className="mt-2">Scanned Code: {scanResultFile}</h3>
        </div>
      </div>
    </div>
  );
}

export default QR;
