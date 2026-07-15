import axios from 'axios';
import { useForm } from "react-hook-form";
import { FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { mountUser } from "../store/reducers/User.Slice";
import { Link } from "react-router-dom"
import { mountToken } from "../store/reducers/Token.Slice";

function RegisterForm() {

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm();

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value)

    const password = watch("password");

    const onSubmit = async (data) => {
        try {
            console.log("Sending data:", data);
            const res = await axios.post("http://localhost:3000/api/auth/register", data, {
                withCredentials: true,
            });
            console.log("Success response:", res.data);

            dispatch(mountUser(res.data.user))
            dispatch(mountToken(res.data.accessToken))


            // Handle successful login here (e.g., redirect user)
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            // Handle error UI here (e.g., show "Invalid credentials" alert)
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">
                        Create Account
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Join us and start shopping
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-3"
                >

                    {/* Name */}

                    <div>
                        <label className="text-sm font-medium">
                            Full Name
                        </label>

                        <div className="relative mt-1">
                            <FiUser className="absolute left-4 top-4 text-gray-400" />

                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full border rounded-xl pl-12 pr-4 py-3 outline-none focus:border-black"
                                {...register("name", {
                                    required: "Name is required"
                                })}
                            />
                        </div>

                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}

                    <div>
                        <label className="text-sm font-medium">
                            Email
                        </label>

                        <div className="relative mt-1">
                            <FiMail className="absolute left-4 top-4 text-gray-400" />

                            <input
                                type="email"
                                placeholder="john@example.com"
                                className="w-full border rounded-xl pl-12 pr-4 py-3 outline-none focus:border-black"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value:
                                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message:
                                            "Invalid email"
                                    }
                                })}
                            />
                        </div>

                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Phone */}

                    <div>
                        <label className="text-sm font-medium">
                            Phone Number
                        </label>

                        <div className="relative mt-1">
                            <FiPhone className="absolute left-4 top-4 text-gray-400" />

                            <input
                                type="tel"
                                placeholder="9876543210"
                                className="w-full border rounded-xl pl-12 pr-4 py-3 outline-none focus:border-black"
                                {...register("phone", {
                                    required:
                                        "Phone number is required",
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message:
                                            "Enter valid phone number"
                                    }
                                })}
                            />
                        </div>

                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                    {/* Avatar */}

                    {/* <div>
                        <label className="text-sm font-medium">
                            Profile Picture
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            className="w-full border rounded-xl p-3 mt-1"
                            {...register("avatar")}
                        />
                    </div> */}

                    {/* Password */}

                    <div>
                        <label className="text-sm font-medium">
                            Password
                        </label>

                        <div className="relative mt-1">
                            <FiLock className="absolute left-4 top-4 text-gray-400" />

                            <input
                                type="password"
                                placeholder="********"
                                className="w-full border rounded-xl pl-12 pr-4 py-3 outline-none focus:border-black"
                                {...register("password", {
                                    required:
                                        "Password is required",
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Minimum 6 characters"
                                    }
                                })}
                            />
                        </div>

                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}

                    <div>
                        <label className="text-sm font-medium">
                            Confirm Password
                        </label>

                        <div className="relative mt-1">
                            <FiLock className="absolute left-4 top-4 text-gray-400" />

                            <input
                                type="password"
                                placeholder="********"
                                className="w-full border rounded-xl pl-12 pr-4 py-3 outline-none focus:border-black"
                                {...register("confirmPassword", {
                                    required:
                                        "Confirm your password",
                                    validate: value =>
                                        value === password ||
                                        "Passwords do not match"
                                })}
                            />
                        </div>

                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
                    >
                        Create Account
                    </button>



                </form>

                <div className="text-center text-sm">

                    Already have an account?{" "}

                    <Link
                        to="/"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Login Account
                    </Link>

                </div>
            </div>

        </div>
    );
}

export default RegisterForm;