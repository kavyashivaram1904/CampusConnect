// =======================================================
// IMPORTS
// =======================================================

import { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "react-toastify";

// =======================================================
// COMPONENT
// =======================================================

function ScanAttendance() {

  useEffect(() => {

    const html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras()
      .then((devices) => {

        if (!devices || devices.length === 0) {
          toast.error("No Camera Found");
          return;
        }

        html5QrCode.start(

          devices[0].id,

          {
            fps: 10,
            qrbox: 250
          },

          async (decodedText) => {

            try {

              const qrData = JSON.parse(decodedText);

              const response = await fetch(
                "https://campusconnect-backend-3hba.onrender.com/api/registrations/attendance",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    ticketId: qrData.ticketId
                  })
                }
              );

              const data = await response.json();

              if (response.ok) {
                toast.success(data.message);
              } else {
                toast.error(data.message);
              }

            } catch {
              toast.error("Invalid QR Code");
            }

          },

          () => {}

        );

      })

      .catch(() => {

        toast.error("Camera Permission Denied");

      });

    return () => {

      html5QrCode.stop().catch(() => {});
      html5QrCode.clear().catch(() => {});

    };

  }, []);

  return (

    <div className="min-h-screen bg-pink-50 flex justify-center items-center">

      <div className="bg-white p-8 rounded-3xl shadow-xl w-[500px]">

        <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">

          📷 Scan Attendance

        </h1>

        <div id="reader"></div>

        <p className="text-center mt-6 text-gray-500">

          Scan Student QR Ticket

        </p>

      </div>

    </div>

  );

}

export default ScanAttendance;