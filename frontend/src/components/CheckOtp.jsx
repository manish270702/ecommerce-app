import { useForm } from "react-hook-form";
import axios from "axios";

function VerifyOtp() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/verify-otp",
                {
                    otp: Number(data.otp)
                }
            );

            console.log(response.data);
        } catch (error) {
            console.log(error.response?.data?.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter OTP"
                {...register("otp", {
                    required: "OTP is required",
                    pattern: {
                        value: /^[0-9]{6}$/,
                        message: "OTP must be 6 digits"
                    }
                })}
            />

            {errors.otp && (
                <p>{errors.otp.message}</p>
            )}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>

        </form>
    );
}

export default VerifyOtp;