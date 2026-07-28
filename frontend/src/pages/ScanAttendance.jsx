// =======================================================
// IMPORTS
// =======================================================

import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "react-toastify";

// =======================================================
// COMPONENT
// =======================================================

function ScanAttendance() {

  // =======================================================
  // STATES
  // =======================================================

  const [ticketId, setTicketId] = useState("");

  // =======================================================
  // MANUAL ATTENDANCE
  // =======================================================

  async function markAttendanceManual() {

    if (!ticketId.trim()) {

      toast.error("Please enter Ticket ID");
      return;

    }

    try {

      const response = await fetch(
        "https://campusconnect-backend-3hba.onrender.com/api/registrations/attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ticketId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        toast.success(data.message);
        setTicketId("");

      } else {

        toast.error(data.message);

      }

    } catch {

      toast.error("Something went wrong");

    }

  }

  // =======================================================
  // QR SCANNER
  // =======================================================

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
            qrbox: 250,
          },

          async (decodedText) => {

            try {

              const qrData = JSON.parse(decodedText);

              const response = await fetch(
                "https://campusconnect-backend-3hba.onrender.com/api/registrations/attendance",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    ticketId: qrData.ticketId,
                  }),
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

      html5QrCode
        .stop()
        .then(() => html5QrCode.clear())
        .catch(() => {});

    };

  }, []);

  // =======================================================
  // UI
  // =======================================================

  return (

    <div className="min-h-screen bg-pink-50 flex justify-center items-center">

      <div className="bg-white p-8 rounded-3xl shadow-xl w-[500px]">

        <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">

          📷 Scan Attendance

        </h1>

        <div id="reader"></div>

        <div className="my-8">

          <p className="text-center font-semibold text-gray-500 mb-4">

            OR

          </p>

          <input
            type="text"
            placeholder="Enter Ticket ID"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <button
            onClick={markAttendanceManual}
            className="w-full bg-blue-600 text-white py-3 rounded-xl mt-4 hover:bg-blue-700"
          >

            Mark Attendance

          </button>

        </div>

        <p className="text-center text-gray-500">

          Scan Student QR Ticket or Enter Ticket ID

        </p>

      </div>

    </div>

  );

}

// =======================================================
// EXPORT
// =======================================================

export default ScanAttendance;