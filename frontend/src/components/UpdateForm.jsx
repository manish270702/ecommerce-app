import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux';

function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector(state => state.user.value); 

  console.log("Current Redux User:", user);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    // 1. Swapping "defaultValues" with "values" enables reactive async binding
    values: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Updated Data:", data);
    // await axios.put("/api/user/update", data);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // 2. Prevent application crash by safely reading data values
    reset({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  // 3. Fallback visual state while Redux hydration takes place
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-xl font-semibold animate-pulse text-gray-600">
          Loading user profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-5">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-black text-white px-5 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={user?.avatar || "https://placeholder.com"}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                {...register("avatar")}
                className="text-sm"
              />
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block mb-2 font-medium">Full Name</label>
            <input
              type="text"
              disabled={!isEditing}
              {...register("name")}
              className={`w-full border rounded-lg p-3 ${
                !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              disabled
              {...register("email")}
              className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 font-medium">Phone Number</label>
            <input
              type="text"
              disabled={!isEditing}
              {...register("phone")}
              className={`w-full border rounded-lg p-3 ${
                !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
              }`}
            />
          </div>

          {/* Buttons */}
          {isEditing && (
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 px-6 py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}

export default ProfileForm;
