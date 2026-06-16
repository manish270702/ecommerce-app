import { useState } from "react";
import { useForm } from "react-hook-form";

function AddressUpdateForm() {
  const [isEditing, setIsEditing] = useState(false);

  // Data from API
  const address = {
    _id: "123",
    pincode: "302012",
    state: "Rajasthan",
    city: "Jaipur",
    area: "Vaishali Nagar",
    landmark: "Near National Handloom",
    addresstype: "Home",
    isDefaultaddresstype: true,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: address,
  });

  const onSubmit = async (data) => {
    console.log(data);

    // await axios.put(`/api/address/${address._id}`, data)

    setIsEditing(false);
  };

  const handleCancel = () => {
    reset(address);
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl mt-6 p-6">

      <div className="flex justify-between  items-center mb-6">
        <h2 className="text-2xl font-bold">
          Address Details
        </h2>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 bg-black text-white rounded-lg"
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
            className={`w-full border rounded-lg p-2 ${
              !isEditing
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
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
            className={`w-full border rounded-lg p-2 ${
              !isEditing
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
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
            className={`w-full border rounded-lg p-2 ${
              !isEditing
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
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
            className={`w-full border rounded-lg p-2 ${
              !isEditing
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
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
            className={`w-full border rounded-lg p-2 resize-none ${
              !isEditing
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
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
            className={`w-full border rounded-lg p-2 ${
              !isEditing
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
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
              className="bg-gray-300 px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}

      </form>
    </div>
  );
}

export default AddressUpdateForm;