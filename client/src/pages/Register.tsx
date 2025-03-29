import { Mail, User, Lock, EyeOff, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServerResponse, UserSignUp, UserSignUpSchema } from "../types";
import { registerUser } from "../utils/auth";
import toast from "react-hot-toast";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(() => {
      return new AbortController();
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (signUpData: UserSignUp) => {
    const res: ServerResponse = await registerUser(signUpData, abortController);
    if (res.status === "error") {
      toast.error(res.message ?? "Sign up failed. Try again later.");
      reset();
      return;
    }

    toast.success("You are successfully signed up.");
    reset();
  };

  useEffect(() => {
    return () => {
      abortController?.abort();
      setAbortController(null);
    };
  }, [abortController]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold mt-2">Create Account</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset bg-base-200 border border-base-300 p-4 rounded-box space-y-6">
            <div>
              <label className="fieldset-label mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute left-1 top-2 pr-2 pointer-events-none z-1">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  {...register("username")}
                  type="text"
                  className="input w-full pl-8"
                  placeholder="Full Name"
                />
              </div>
              {errors.username && (
                <p className="my-2 text-sm text-red-500">{`${errors.username.message}`}</p>
              )}
            </div>

            <div>
              <label className="fieldset-label mb-2">Email</label>
              <div className="relative">
                <div className="absolute left-1 top-2 pr-2 pointer-events-none z-1">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  className="input w-full pl-8"
                  placeholder="Email"
                />
              </div>
              {errors.email && (
                <p className="my-2 text-sm text-red-500">{`${errors.email.message}`}</p>
              )}
            </div>

            <div>
              <label className="fieldset-label mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-1 top-2 pr-2 pointer-events-none z-1">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="input w-full pl-8"
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute right-1 top-2 hover:cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="my-2 text-sm text-red-500">{`${errors.password.message}`}</p>
              )}
            </div>

            <div>
              <label className="fieldset-label mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-1 top-2 pr-2 pointer-events-none z-1">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  {...register("passwordConfirm")}
                  type={showConfirmPassword ? "text" : "password"}
                  className="input w-full pl-8"
                  placeholder="Password Confirm"
                />
                <button
                  type="button"
                  className="absolute right-1 top-2 hover:cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
              {errors.passwordConfirm && (
                <p className="my-2 text-sm text-red-500">{`${errors.passwordConfirm.message}`}</p>
              )}
            </div>

            <button
              className="btn btn-primary mt-4"
              type="submit"
              disabled={isSubmitting}
            >
              Sign Up
            </button>
          </fieldset>
        </form>

        <div className="text-center">
          <p className="text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
