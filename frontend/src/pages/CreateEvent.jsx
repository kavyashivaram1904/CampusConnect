// =======================================================
// SECTION 1 : IMPORTS
// =======================================================

import { useState } from "react";
import { toast } from "react-toastify";

// =======================================================
// SECTION 2 : COMPONENT
// =======================================================

function CreateEvent() {

  // =======================================================
  // SECTION 3 : STATES
  // =======================================================

  const [event, setEvent] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    venue: "",
    registrationFee: "",
    maxParticipants: "",
    image: null
  });

  // =======================================================
  // SECTION 4 : HANDLE INPUT CHANGE
  // =======================================================

  const handleChange = (e) => {

    if (e.target.name === "image") {

      setEvent({
        ...event,
        image: e.target.files[0]
      });

    }

    else {

      setEvent({
        ...event,
        [e.target.name]: e.target.value
      });

    }

  };

  // =======================================================
  // SECTION 5 : HANDLE SUBMIT
  // =======================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {

      toast.error("Please login first");

      return;

    }

    try {

      const formData = new FormData();

      formData.append("title", event.title);
      formData.append("description", event.description);
      formData.append("category", event.category);
      formData.append("date", event.date);
      formData.append("venue", event.venue);
      formData.append("registrationFee", event.registrationFee);
      formData.append("maxParticipants", event.maxParticipants);

      // Coordinator Details

      formData.append("createdBy", user.id);
      formData.append("coordinatorName", user.name);
      formData.append("coordinatorEmail", user.email);

      if (event.image) {

        formData.append("image", event.image);

      }

      const response = await fetch(

        "https://campusconnect-backend-3hba.onrender.com/api/events/create",

        {
          method: "POST",
          body: formData
        }

      );

      const data = await response.json();

      if (response.ok) {

        toast.success("Event Created Successfully 🎉");

        setEvent({

          title: "",
          description: "",
          category: "",
          date: "",
          venue: "",
          registrationFee: "",
          maxParticipants: "",
          image: null

        });

      }

      else {

        toast.error(data.message);

      }

    }

    catch (error) {

      console.log(error);

      toast.error("Something went wrong");

    }

  };

  // =======================================================
  // SECTION 6 : UI
  // =======================================================

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-10">

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl">

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">

          Create Event

        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="title"
            placeholder="Event Name"
            value={event.title}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={event.description}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <select
            name="category"
            value={event.category}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          >

            <option value="">Select Category</option>
            <option value="Technical">Technical</option>
            <option value="Workshop">Workshop</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>

          </select>

          <input
            type="date"
            name="date"
            value={event.date}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="venue"
            placeholder="Venue"
            value={event.venue}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="number"
            name="registrationFee"
            placeholder="Registration Fee (₹)"
            value={event.registrationFee}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="number"
            name="maxParticipants"
            placeholder="Maximum Participants"
            value={event.maxParticipants}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          {/* ===================================================
              SECTION 7 : IMAGE UPLOAD
          =================================================== */}

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >

            Create Event

          </button>

        </form>

      </div>

    </div>

  );

}

// =======================================================
// SECTION 8 : EXPORT
// =======================================================

export default CreateEvent;