// =======================================================
// SECTION 1 : IMPORTS
// =======================================================

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getEventById,
  registerForEvent,
} from "../services/eventService";
import { toast } from "react-toastify";

// =======================================================
// SECTION 2 : COMPONENT
// =======================================================

function EventDetails() {

  // =======================================================
  // SECTION 3 : STATES
  // =======================================================
  const user = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [eventFull, setEventFull] = useState(false);
  // =======================================================
  // SECTION 4 : FETCH EVENT
  // =======================================================

  useEffect(() => {

    async function loadEvent() {

      try {

        const data = await getEventById(id);

        setEvent(data);
        const user = JSON.parse(localStorage.getItem("user"));

if (user) {

  const response = await fetch(

    `https://campusconnect-backend-3hba.onrender.com/api/registrations/user/${user.id}`

  );

  const registrations = await response.json();

  const registered = registrations.some(

    (r) => r.eventId?._id === data._id

  );

  setAlreadyRegistered(registered);

}

const response = await fetch(

  `https://campusconnect-backend-3hba.onrender.com/api/registrations/participants/${data._id}`

);

const participants = await response.json();

if (

  participants.length >= data.maxParticipants

) {

  setEventFull(true);

}

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }

    loadEvent();

  }, [id]);

  // =======================================================
  // SECTION 5 : REGISTER EVENT
  // =======================================================

  function handleRegister() {

  if (!user) {

    toast.error("Please login first");

    return;

  }

  navigate("/payment", {

    state: {

      event,

      user

    }

  });

}

  async function handleDelete() {

  const confirmDelete = window.confirm(

    "Delete this event?"

  );

  if (!confirmDelete) return;

  try {

    const response = await fetch(

      `https://campusconnect-backend-3hba.onrender.com/api/events/${id}`,

      {

        method: "DELETE"

      }

    );

    const data = await response.json();

    if (response.ok) {

      toast.success(data.message);

      navigate("/events");

    }

    else {

      toast.error(data.message);

    }

  }

  catch {

    toast.error("Delete Failed");

  }

}
  // =======================================================
  // SECTION 6 : LOADING
  // =======================================================

  if (loading) {

    return (

      <div className="text-center text-3xl mt-20">
        Loading...
      </div>

    );

  }

  // =======================================================
  // SECTION 7 : EVENT NOT FOUND
  // =======================================================

  if (!event) {

    return (

      <div className="text-center text-3xl mt-20">
        Event Not Found
      </div>

    );

  }

  // =======================================================
  // SECTION 8 : UI
  // =======================================================

  return (

    <div className="min-h-screen bg-pink-50 py-10">

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* ===================================================
            SECTION 9 : BANNER IMAGE
        =================================================== */}

        <img
  src={
    event.image
      ? `https://campusconnect-backend-3hba.onrender.com/uploads/${event.image}`
      : "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200"
  }
  alt={event.title}
  className="w-full h-80 object-cover"
/>

        {/* ===================================================
            SECTION 10 : EVENT INFO
        =================================================== */}

        <div className="p-8">

          <Link
            to="/events"
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Back to Events
          </Link>

          <h1 className="text-5xl font-bold mt-5">

            {event.title}

          </h1>

          <div className="flex flex-wrap gap-4 mt-6 text-gray-700">

  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
    {event.category}
  </span>

  <span>
    📅 {event.date}
  </span>

  <span>
    📍 {event.venue}
  </span>

</div>

<hr className="my-6" />

<div className="bg-gray-50 border rounded-xl p-5">

  <h3 className="text-xl font-bold text-pink-600 mb-3">
    👨‍💼 Event Coordinator
  </h3>

  <p className="text-gray-700 mb-2">
    <strong>Name:</strong> {event.coordinatorName}
  </p>

  <p className="text-gray-700">
    <strong>Email:</strong>{" "}
    <a
      href={`mailto:${event.coordinatorEmail}`}
      className="text-blue-600 hover:underline"
    >
      {event.coordinatorEmail}
    </a>
  </p>

</div>
          {/* ===================================================
              SECTION 11 : DESCRIPTION
          =================================================== */}

          <div className="mt-8">

            <h2 className="text-2xl font-semibold mb-3">

              About this Event

            </h2>

            <p className="text-gray-600 leading-8">

              {event.description}

            </p>

          </div>

          {/* ===================================================
              SECTION 12 : REGISTER BUTTON
          =================================================== */}
          {user?.role === "admin" && (

<div className="flex gap-4 mt-10">

<Link

to={`/edit-event/${event._id}`}

className="flex-1 bg-yellow-500 text-white py-4 rounded-xl text-center hover:bg-yellow-600"

>

✏ Edit

</Link>

<button

onClick={handleDelete}

className="flex-1 bg-red-600 text-white rounded-xl hover:bg-red-700"

>

🗑 Delete

</button>

</div>

)}
          {alreadyRegistered ? (

  <button
    disabled
    className="mt-10 w-full bg-green-600 text-white py-4 rounded-xl text-lg"
  >
    ✅ Already Registered
  </button>

) : eventFull ? (

  <button
    disabled
    className="mt-10 w-full bg-red-600 text-white py-4 rounded-xl text-lg"
  >
    ❌ Event Full
  </button>

) : (

  <button
    onClick={handleRegister}
    disabled={registering}
    className="mt-10 w-full bg-pink-600 text-white py-4 rounded-xl text-lg hover:bg-pink-700 transition"
  >
    {registering ? "Registering..." : "Register Now"}
  </button>

)}

        </div>

      </div>

    </div>

  );

}

// =======================================================
// SECTION 13 : EXPORT
// =======================================================

export default EventDetails;