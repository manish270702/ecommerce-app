import { useForm } from "react-hook-form";
import axios from "axios";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function VerifyOtp() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm();

    const navigate = useNavigate();

    const user = useSelector((state) => state.user.value);

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/verify-otp",
                {
                    otp: Number(data.otp),
                    email: user.email

                }
            );

            if (response.status===200) navigate("/home");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="Enter OTP"
                {...register("otp", {
                    required: "OTP is required",
                    pattern: {
                        value: /^[0-9]{4}$/,
                        message: "OTP must be 4 digits"
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