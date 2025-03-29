import { z } from "zod";

export const UserSignUpSchema = z
  .object({
    username: z.string().trim().min(1, "Name is required"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Email is required")
      .email({ message: "Email is not valid" }),
    password: z
      .string()
      .trim()
      .min(6, "Password is required")
      .max(100, "Password is too long"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords must match",
    path: ["passwordConfirm"],
  });

export type UserSignUp = z.infer<typeof UserSignUpSchema>;

export const UserSignInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email({ message: "Email is not valid" }),
  password: z
    .string()
    .trim()
    .min(6, "Password is required")
    .max(100, "Password is too long"),
});

export type UserSignIn = z.infer<typeof UserSignInSchema>;

export type ServerResponse = {
  status: "success" | "error";
  message?: string;
  user?: User;
};

export type User = {
  id: string;
  username: string;
  email: string;
  accessToken?: string;
  createdAt: string;
  updatedAt: string;
};
