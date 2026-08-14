import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { mountUser } from "../store/reducers/User.Slice";
import { useNavigate } from "react-router-dom";

function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value);
  const token = useSelector((state) => state.token.value);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // Update form whenever Redux user changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  const dark = useSelector((state) => state.Dark.value)

  const onSubmit = async (data) => {
    try {
      const formData = {};

      formData.name = data.name;
      formData.phone = data.phone;

      if (data.avatar && data.avatar.length > 0) {
        formData.avatar = data.avatar[0];
      }

      const res = await axios.patch(
        "http://localhost:3000/api/auth/update",
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Updated User:", res.data.user);

      if (res.status === 200) {
        dispatch(mountUser(res.data.user));
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update Failed:", error);
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });

    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold animate-pulse">
          Loading Profile...
        </h2>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${dark ? "bg-zinc-950 text-white" : "bg-gray-100 text-black"} flex justify-center items-center p-5`}>
      <div className={`w-full max-w-2xl ${dark ? "bg-zinc-800" : "bg-white"} rounded-2xl shadow-lg p-8`}>
        <div onClick={() => navigate(-1)} className={`px-5 py-2 mb-3 w-fit ${dark ? "bg-zinc-700 text-white" : "bg-black text-white"} rounded-lg`} >Back</div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={`px-5 py-2 rounded-lg ${dark ? "bg-zinc-700 text-white" : "bg-black text-white"}`}
            >
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* <div className="flex flex-col items-center gap-4">
            <img
              src={
                user.avatar ||
                "https://placehold.co/150x150"
              }
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border"
            />

            {isEditing && (
              <input
                type="file"
                accept="image/*"
                {...register("avatar")}
              />
            )}
          </div> */}

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
              } ${dark ? "bg-zinc-700 text-white" : "bg-black text-white"}`}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              disabled
              {...register("email")}
              className={`w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed ${dark ? "bg-zinc-700 text-white" : "bg-black text-white"}`}
            />
          </div>

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
              } ${dark ? "bg-zinc-700 text-white" : "bg-black text-white"}`}
            />
          </div>

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