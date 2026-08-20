import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"
import { mountUser } from "../store/reducers/User.Slice";
import { useNavigate } from "react-router-dom";

function AddressUpdateForm() {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Data from API
  const user = useSelector(state => state.user.value)
  const token = useSelector(state => state.token.value)


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    values: user?.address || {
      pincode: "",
      state: "",
      city: "",
      area: "",
      landmark: "",
      addresstype: "Home",
      isDefaultaddresstype: true,
    }
  });

  const dark = useSelector((state) => state.Dark.value)
  console.log(dark)

  const onSubmit = async (data) => {
    try {

      ;
      const updatedAddress = {
        ...user.address,
        ...data
      };
      const res = await axios.post(
        "http://localhost:3000/api/auth/update-address",
        { address: updatedAddress },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (res.status === 200) {
        dispatch(mountUser(res.data.user));
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update Failed:", error);
    }
  };
  // console.log("Updated User:", user);

  const handleCancel = () => {
    reset(user.address);
    setIsEditing(false);
  };

  return (
    <div className={`"max-w-3xl  ${dark? "bg-zinc-950 text-white" :"bg-white "} p-5 shadow-lg flex items-center justify-center"`}>
      <div className="w-1/2 min-h-screen p-5 mx-auto border rounded-lg shadow-md">

        <div onClick={() => navigate(-1)} className={`px-5 py-2 mb-3 w-fit ${dark ? "bg-zinc-800 text-white border" : "bg-black text-white"} rounded-lg`}>
          Back
        </div>
        <div className="flex justify-between  items-center mb-6">

          <h2 className="text-2xl font-bold">
            Address Details
          </h2>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={`px-5 py-2 rounded-lg ${dark ? "bg-zinc-800 text-white border" : "bg-black text-white"}`}
            >
              Edit Address
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3"
        >

          {/* Pincode */}

          <div>
            <label className="block mb-2 font-medium">
              Pincode
            </label>

            <input
              type="text"
              disabled={!isEditing}
              {...register("pincode", {
                required: "Pincode is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Enter valid pincode",
                },
              })}
              className={`w-full border rounded-lg p-2 ${!isEditing
                ? "bg-gray-100 cursor-not-allowed"
                : ""
                }  ${dark ? "bg-zinc-950 text-white" : "bg-white text-black"}`}
            />

            {errors.pincode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pincode.message}
              </p>
            )}
          </div>

          {/* State */}

          <div>
            <label className="block mb-2 font-medium">
              State
            </label>

            <input
              type="text"
              disabled={!isEditing}
              {...register("state", {
                required: "State is required",
              })}
              className={`w-full border rounded-lg p-2 ${!isEditing
                ? "bg-gray-100 cursor-not-allowed"
                : ""
                } ${dark ? "bg-zinc-950 text-white" : "bg-white text-black"}`}
            />
          </div>

          {/* City */}

          <div>
            <label className="block mb-2 font-medium">
              City
            </label>

            <input
              type="text"
              disabled={!isEditing}
              {...register("city", {
                required: "City is required",
              })}
              className={`w-full border rounded-lg p-2 ${!isEditing
                ? "bg-gray-100 cursor-not-allowed"
                : ""
                }  ${dark ? "bg-zinc-950 text-white" : "bg-white text-black"}`}
            />
          </div>

          {/* Area */}

          <div>
            <label className="block mb-2 font-medium">
              Area / Locality
            </label>

            <input
              type="text"
              disabled={!isEditing}
              {...register("area", {
                required: "Area is required",
              })}
              className={`w-full border rounded-lg p-2 ${!isEditing
                ? "bg-gray-100 cursor-not-allowed"
                : ""
                }  ${dark ? "bg-zinc-950 text-white" : "bg-white text-black"  }`}
            />
          </div>

          {/* Landmark */}

          <div>
            <label className="block mb-2 font-medium">
              Landmark
            </label>

            <textarea
              rows={3}
              disabled={!isEditing}
              {...register("landmark", {
                required: "Landmark is required",
              })}
              className={`w-full border rounded-lg p-2 resize-none ${!isEditing
                ? "bg-gray-100 cursor-not-allowed"
                : ""
                } ${dark ? "bg-zinc-950 text-white" : "bg-white text-black"}`}
            />
          </div>

          {/* Address Type */}

          <div>
            <label className="block mb-2 font-medium">
              Address Type
            </label>

            <select
              disabled={!isEditing}
              {...register("addresstype")}
              className={`w-full border rounded-lg p-2 ${!isEditing
                ? "bg-gray-100 cursor-not-allowed"
                : ""
                } ${dark ? "bg-zinc-950 text-white" : "bg-white text-black"}`}
            >
              <option value="Home">Home</option>
              <option value="Office">Office</option>
            </select>
          </div>

          {/* Default Address */}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              disabled={!isEditing}
              {...register("isDefaultaddresstype")}
            />

            <label>
              Set as Default Address
            </label>
          </div>

          {/* Buttons */}

          {isEditing && (
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className={`bg-gray-300 px-6 py-2 ${dark ? "bg-zinc-700 text-white" : ""} rounded-lg`}
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

export default AddressUpdateForm;