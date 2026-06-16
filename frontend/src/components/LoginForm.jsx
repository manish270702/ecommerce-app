import { useForm } from "react-hook-form";
import { FiLock, FiMail, FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";

function LoginForm() {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

                {/* Header */}

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold">
                        Welcome Back
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Login to continue shopping
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >

                    {/* Email / Phone */}

                    <div>

                        <label className="text-sm font-medium">
                            Email or Phone Number
                        </label>

                        <div className="relative mt-1">

                            <FiMail
                                size={18}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Email or Phone"
                                className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-black"
                                {...register("loginId", {
                                    required:
                                        "Email or phone number is required"
                                })}
                            />

                        </div>

                        {errors.loginId && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.loginId.message}
                            </p>
                        )}

                    </div>

                    {/* Password */}

                    <div>

                        <label className="text-sm font-medium">
                            Password
                        </label>

                        <div className="relative mt-1">

                            <FiLock
                                size={18}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            <input
                                type="password"
                                placeholder="********"
                                className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-black"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Password must be at least 6 characters"
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

                    {/* Remember + Forgot */}

                    <div className="flex justify-between items-center text-sm">

                        <label className="flex items-center gap-2 cursor-pointer">

                            <input
                                type="checkbox"
                                {...register("rememberMe")}
                            />

                            Remember Me

                        </label>

                        <Link
                            to="/forgot-password"
                            className="text-blue-600 hover:underline"
                        >
                            Forgot Password?
                        </Link>

                    </div>

                    {/* Submit */}

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
                    >
                        Login
                    </button>

                    {/* Register */}

                    <div className="text-center text-sm">

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            Create Account
                        </Link>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default LoginForm;