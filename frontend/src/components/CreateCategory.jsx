import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";

function CreateCategory() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const image = watch("image");

  // Example Parent Categories
  const parentCategories = [
    {
      _id: "1",
      name: "Fashion",
    },
    {
      _id: "2",
      name: "Electronics",
    },
  ];

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },

    multiple: false,

    onDrop: (acceptedFiles) => {
      setValue("image", acceptedFiles[0]);
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("description", data.description);
    formData.append("isActive", data.isActive);

    if (data.parentCategory) {
      formData.append(
        "parentCategory",
        data.parentCategory
      );
    }

    if (data.image) {
      formData.append("image", data.image);
    }

    console.log(data);

    // axios.post("/api/category/create", formData)
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-3xl font-bold mb-8">
          Create Category
        </h1>

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

          {/* Parent Category */}
          <div>
            <label className="font-medium">
              Parent Category
            </label>

            <select
              {...register("parentCategory")}
              className="w-full border p-3 rounded-lg mt-2"
            >
              <option value="">
                None
              </option>

              {parentCategories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              ))}
            </select>
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

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg"
          >
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCategory;