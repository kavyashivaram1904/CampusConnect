// =======================================================
// IMPORTS
// =======================================================

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// =======================================================
// COMPONENT
// =======================================================

function Participants() {

    // =======================================================
    // STATES
    // =======================================================

    const { eventId } = useParams();

    const [participants, setParticipants] = useState([]);
    const [search, setSearch] = useState("");

    // =======================================================
    // FETCH PARTICIPANTS
    // =======================================================

    useEffect(() => {

        async function loadParticipants() {

            try {

                const response = await fetch(
                    `https://campusconnect-backend-3hba.onrender.com/api/registrations/participants/${eventId}`
                );

                const data = await response.json();

                setParticipants(data);

            }

            catch (error) {

                console.log(error);

            }

        }

        loadParticipants();

    }, [eventId]);

    // =======================================================
    // FILTER PARTICIPANTS
    // =======================================================

    const filteredParticipants = participants.filter((student) => {

        return (

            student.studentName
                .toLowerCase()
                .includes(search.toLowerCase())

            ||

            student.studentEmail
                .toLowerCase()
                .includes(search.toLowerCase())

        );

    });

    // =======================================================
    // UI
    // =======================================================

    return (

        <div className="min-h-screen bg-pink-50 p-10">

            <h1 className="text-4xl font-bold mb-8">

               🔥Event Participants

            </h1>

            {/* =======================================================
                SEARCH
            ======================================================= */}

            <input

                type="text"

                placeholder="🔍 Search by Name or Email..."

                value={search}

                onChange={(e) => setSearch(e.target.value)}

                className="w-full md:w-96 p-3 mb-6 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"

            />

            {/* =======================================================
                TABLE
            ======================================================= */}

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                <table className="w-full">

                    <thead className="bg-pink-500 text-white">

                        <tr>

                            <th className="p-4">Student</th>

                            <th className="p-4">Email</th>

                            <th className="p-4">Payment</th>

                            <th className="p-4">Attendance</th>

                            <th className="p-4">Attendance Time</th>

                            <th className="p-4">Registration Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredParticipants.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="text-center p-8 text-gray-500"
                                >

                                    No matching participants found.

                                </td>

                            </tr>

                        ) : (

                            filteredParticipants.map((student) => (

                                <tr
                                    key={student._id}
                                    className="border-b hover:bg-pink-50 transition"
                                >

                                    <td className="p-4 font-medium">

                                        {student.studentName}

                                    </td>

                                    <td className="p-4">

                                        {student.studentEmail}

                                    </td>

                                    <td className="p-4">

                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">

                                            {student.paymentStatus}

                                        </span>

                                    </td>

                                    <td className="p-4">

                                        {student.attendance ? (

                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">

                                                ✅ Present

                                            </span>

                                        ) : (

                                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">

                                                ❌ Pending

                                            </span>

                                        )}

                                    </td>

                                    <td className="p-4">

                                        {student.attendanceTime

                                            ? new Date(
                                                student.attendanceTime
                                            ).toLocaleString()

                                            : "-"}

                                    </td>

                                    <td className="p-4">

                                        {student.registrationDate

                                            ? new Date(
                                                student.registrationDate
                                            ).toLocaleDateString()

                                            : "-"}

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Participants;