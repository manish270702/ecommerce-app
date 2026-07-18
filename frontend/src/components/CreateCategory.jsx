import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { mountCategory } from "../store/reducers/Category.Slice";

function CreateCategory() {

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const token = useSelector((state) => state.token.value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const image = watch("image");

  const getCategories = async () => {
    const res = await axios.get("http://localhost:3002/api/category/allCategory", {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(mountCategory(res.data.unique_category));
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },

    multiple: false,

    onDrop: (acceptedFiles) => {
      setValue("image", acceptedFiles[0]);
    },
  });


  useEffect(() => {
    if (token) {
      getCategories();
    }
  }, [token]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError("");
      setSubmitSuccess(false);

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("description", data.description);
      formData.append("isActive", data.isActive);

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await axios.post(
        "http://localhost:3002/api/category/createCategory",
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        reset();
        await getCategories();
        setSubmitSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.message || err.message || "Unable to create category");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-3xl font-bold mb-8">
          Create Category
        </h1>

        {isSubmitting && (
          <div className="mb-6 rounded-lg bg-yellow-100 border border-yellow-300 p-4 text-yellow-800">
            Uploading category image. Please wait...
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* Name */}
          <div>
            <label className="font-medium">
              Category Name
            </label>

            <input
              {...register("name", {
                required: "Category name is required",
              })}
              className="w-full border p-3 rounded-lg mt-2"
              placeholder="Perfumes"
            />

            {errors.name && (
              <p className="text-red-500 text-sm">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="font-medium">
              Slug
            </label>

            <input
              {...register("slug", {
                required: "Slug is required",
              })}
              className="w-full border p-3 rounded-lg mt-2"
              placeholder="perfumes"
            />

            {errors.slug && (
              <p className="text-red-500 text-sm">
                {errors.slug.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="font-medium">
              Description
            </label>

            <textarea
              rows={5}
              {...register("description")}
              className="w-full border p-3 rounded-lg mt-2"
              placeholder="Category Description..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="font-medium">
              Category Image
            </label>

            <div
              {...getRootProps()}
              className="border-2 border-dashed p-10 rounded-xl mt-2 text-center cursor-pointer"
            >
              <input {...getInputProps()} />

              <p>
                Drag & Drop image here
              </p>
            </div>

            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt=""
                className="w-40 h-40 object-cover rounded-lg mt-4"
              />
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("isActive")}
              defaultChecked
            />

            <label>
              Active Category
            </label>
          </div>

          {submitError && (
            <p className="text-red-500 text-sm">
              {submitError}
            </p>
          )}

          {submitSuccess && (
            <p className="text-green-600 text-sm">
              Category created successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-white ${isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-black"}`}
          >
            {isSubmitting ? "Creating category..." : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCategory;