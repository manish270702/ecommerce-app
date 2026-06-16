import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function CreateProduct() {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      brand: "",
      category: "",
      price: "",
      discountPercentage: "",
      stock: "",
      images: [],
    },
  });

  // Dummy categories
  const categories = [
    {
      _id: "1",
      name: "Perfume",
    },
    {
      _id: "2",
      name: "Shoes",
    },
    {
      _id: "3",
      name: "Clothing",
    },
  ];

  const images = watch("images");

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setValue("images", acceptedFiles, {
        shouldValidate: true,
      });
    },
  });

  const nextStep = async () => {
    let valid = false;

    if (step === 1) {
      valid = await trigger([
        "title",
        "description",
        "brand",
        "category",
      ]);
    }

    if (step === 2) {
      valid = await trigger([
        "price",
        "stock",
      ]);
    }

    if (valid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    console.log(data);

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("brand", data.brand);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append(
      "discountPercentage",
      data.discountPercentage || 0
    );
    formData.append("stock", data.stock);

    data.images.forEach((image) => {
      formData.append("images", image);
    });

    // axios request
    // await axios.post("/api/products/create", formData)

    console.log("Ready to send");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-8">
          Create Product
        </h1>

        {/* Progress Bar */}
        <div className="flex gap-3 mb-10">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-3 flex-1 rounded-full transition-all
              ${
                step >= item
                  ? "bg-black"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">
                Product Details
              </h2>

              <div>
                <label className="font-medium">
                  Product Title
                </label>

                <input
                  {...register("title", {
                    required: "Title is required",
                  })}
                  className="w-full border p-3 rounded-lg mt-2"
                  placeholder="Enter product title"
                />

                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-medium">
                  Description
                </label>

                <textarea
                  rows={5}
                  {...register("description", {
                    required: "Description required",
                  })}
                  className="w-full border p-3 rounded-lg mt-2"
                />

                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-medium">
                  Brand
                </label>

                <input
                  {...register("brand", {
                    required: "Brand required",
                  })}
                  className="w-full border p-3 rounded-lg mt-2"
                />

                {errors.brand && (
                  <p className="text-red-500 text-sm">
                    {errors.brand.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-medium">
                  Category
                </label>

                <select
                  {...register("category", {
                    required: "Category required",
                  })}
                  className="w-full border p-3 rounded-lg mt-2"
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>

                {errors.category && (
                  <p className="text-red-500 text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">
                Pricing & Inventory
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="font-medium">
                    Price
                  </label>

                  <input
                    type="number"
                    {...register("price", {
                      required: "Price required",
                      min: 1,
                    })}
                    className="w-full border p-3 rounded-lg mt-2"
                  />

                  {errors.price && (
                    <p className="text-red-500 text-sm">
                      Price is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-medium">
                    Discount %
                  </label>

                  <input
                    type="number"
                    {...register("discountPercentage")}
                    className="w-full border p-3 rounded-lg mt-2"
                  />
                </div>

                <div>
                  <label className="font-medium">
                    Stock
                  </label>

                  <input
                    type="number"
                    {...register("stock", {
                      required: "Stock required",
                      min: 0,
                    })}
                    className="w-full border p-3 rounded-lg mt-2"
                  />

                  {errors.stock && (
                    <p className="text-red-500 text-sm">
                      Stock is required
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-5">
                Product Images
              </h2>

              <div
                {...getRootProps()}
                className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer"
              >
                <input {...getInputProps()} />

                <p className="text-gray-500">
                  Drag & Drop Images Here
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  or click to browse
                </p>
              </div>

              {images?.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {images.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="h-40 w-full object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-10">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 border rounded-lg"
              >
                <FaArrowLeft />
                Previous
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg"
              >
                Next
                <FaArrowRight />
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-green-600 text-white rounded-lg"
              >
                Create Product
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;