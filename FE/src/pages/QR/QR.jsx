import React, { useState, useRef } from 'react';
import QRCode from 'qrcode';
import { QrReader } from 'react-qr-reader';

function QR() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scanResultFile, setScanResultFile] = useState('');
  const [scanResultWebCam, setScanResultWebCam] = useState('');

  const generateQrCode = async () => {
    try {
      const response = await QRCode.toDataURL(text);
      setImageUrl(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setScanResultFile(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanFile = (result) => {
    if (result) {
      setScanResultFile(result.text);
    }
  };

  const handleErrorFile = (error) => {
    console.log(error);
  };

  const handleScanWebCam = (result) => {
    if (result) {
      setScanResultWebCam(result.text);
    }
  };

  const handleErrorWebCam = (error) => {
    console.log(error);
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="bg-blue-600 text-white p-5 text-center rounded-md">
        <h2 className="text-2xl">Generate, Download & Scan QR Code with React</h2>
      </div>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            type="text"
            placeholder="Enter Text Here"
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="w-full mt-2 p-2 bg-blue-500 text-white rounded-md"
            onClick={generateQrCode}
          >
            Generate
          </button>
          {imageUrl && (
            <div className="mt-4">
              <a href={imageUrl} download>
                <img src={imageUrl} alt="QR Code" className="mx-auto" />
              </a>
            </div>
          )}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            className="w-full mt-2 p-2"
            onChange={handleFileChange}
          />
          <QrReader
            delay={300}
            onError={handleErrorFile}
            onResult={handleScanFile}
            constraints={{ facingMode: 'environment' }}
          />
          <h3 className="mt-2">Scanned Code: {scanResultFile}</h3>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Qr Code Scan by Web Cam</h3>
          <QrReader
            delay={300}
            onError={handleErrorWebCam}
            onResult={handleScanWebCam}
            style={{ width: '100%' }}
          />
          <h3 className="mt-2">Scanned By WebCam Code: {scanResultWebCam}</h3>
        </div>
      </div>
    </div>
  );
}

export default QR;