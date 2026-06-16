import { useState } from "react";
import { useForm } from "react-hook-form";

function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);

  // Example user data from API
  const user = {
    name: "Manish Yadav",
    email: "manish@gmail.com",
    phone: "9876543210",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500",
    isVerified: true,
    wishlist: ["1", "2", "3"],
    addresses: ["1", "2"],
  };

  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  const onSubmit = async (data) => {
    console.log("Updated Data:", data);

    // API Call
    // await axios.put("/api/user/update", data);

    setIsEditing(false);
  };

  const handleCancel = () => {
    reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });

    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-5">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            My Profile
          </h1>

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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* Avatar */}

          <div className="flex flex-col items-center gap-4">
            <img
              src={user.avatar}
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
            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              disabled={!isEditing}
              {...register("name")}
              className={`w-full border rounded-lg p-3 ${
                !isEditing
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-white"
              }`}
            />
          </div>

          {/* Email */}

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              disabled
              {...register("email")}
              className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Phone */}

          <div>
            <label className="block mb-2 font-medium">
              Phone Number
            </label>

            <input
              type="text"
              disabled={!isEditing}
              {...register("phone")}
              className={`w-full border rounded-lg p-3 ${
                !isEditing
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-white"
              }`}
            />
          </div>

          {/* Role */}

          {/* <div>
            <label className="block mb-2 font-medium">
              Role
            </label>

            <input
              type="text"
              value={user.role}
              disabled
              readOnly
              className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
            />
          </div> */}

          {/* Verification */}

          {/* <div>
            <label className="block mb-2 font-medium">
              Verification Status
            </label>

            <input
              type="text"
              value={user.isVerified ? "Verified" : "Not Verified"}
              disabled
              readOnly
              className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
            />
          </div> */}

          {/* Wishlist Count */}

          {/* <div>
            <label className="block mb-2 font-medium">
              Wishlist Items
            </label>

            <input
              type="text"
              value={user.wishlist.length}
              disabled
              readOnly
              className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
            />
          </div> */}

          {/* Address Count */}

          {/* <div>
            <label className="block mb-2 font-medium">
              Saved Addresses
            </label>

            <input
              type="text"
              value={user.addresses.length}
              disabled
              readOnly
              className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
            />
          </div> */}

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