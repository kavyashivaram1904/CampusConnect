// =======================================================
// SECTION 1 : IMPORTS
// =======================================================

import { useEffect, useState } from "react";
import { getMyRegistrations } from "../services/eventService";
import { Link } from "react-router-dom";

// =======================================================
// SECTION 2 : COMPONENT
// =======================================================

function MyRegistrations() {

  // =======================================================
  // SECTION 3 : STATES
  // =======================================================

  const [registrations, setRegistrations] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // =======================================================
  // SECTION 4 : FETCH DATA
  // =======================================================

  useEffect(() => {

    async function loadRegistrations() {

      try {

        if (!user) return;

        const data = await getMyRegistrations(user.id);

        setRegistrations(data);

      } catch (error) {

        console.error(error);

      }

    }

    loadRegistrations();

  }, []);

  // =======================================================
  // SECTION 5 : UI
  // =======================================================

  return (

    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">

          My Registrations

        </h1>

        {registrations.length === 0 ? (

          <div className="bg-white rounded-xl shadow-md p-8 text-center">

            <h2 className="text-2xl font-bold">

              No Registrations Yet

            </h2>

          </div>

        ) : (

          registrations.map((registration) => (

            <div
              key={registration._id}
              className="bg-white rounded-xl shadow-md p-6 mb-6"
            >

              <h2 className="text-2xl font-bold">

                {registration.eventId.title}

              </h2>

              <p className="mt-3">

                📅 {registration.eventId.date}

              </p>

              <p>

                📍 {registration.eventId.venue}

              </p>

              <Link
                to="/ticket"
                state={{
                  registration
                }}
                className="inline-block mt-4 bg-pink-600 text-white px-5 py-2 rounded-xl hover:bg-pink-700"
              >

                🎟 View Ticket

              </Link>

              <span className="inline-block mt-4 ml-3 bg-green-100 text-green-700 px-3 py-1 rounded-full">

                Registered

              </span>

              {/* =======================================================
                  ATTENDANCE STATUS
              ======================================================= */}

              <div className="mt-5">

                {registration.attendance ? (

                  <div>

                    <p className="text-green-600 font-bold text-lg">

                      ✅ Attendance Marked

                    </p>

                    <p className="text-gray-500">

                      {new Date(
                        registration.attendanceTime
                      ).toLocaleString()}

                    </p>

                  </div>

                ) : (

                  <p className="text-red-600 font-bold text-lg">

                    ❌ Attendance Pending

                  </p>

                )}

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default MyRegistrations;