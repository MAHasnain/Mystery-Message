import z from "zod";

export const usernameValidation = z
 .string()
 .min(2, { message: "Username must be at least 2 characters" })
 .max(20, { message: "Username must be no more than 20" })
 .regex(/^[a-zA-Z0-9_]+$/, {
  message: "Username must not contain special character",
 });

export const emailValidation = z
 .string()
 .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
  message: "Invalid email address",
 });

export const passwordValidation = z
 .string()
 .min(6, { message: "password must be atleast 6 characters." })
 .max(20, { message: "" })
 .regex(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
  { message: "Weak Password" },
 );

export const signupValidation = z.object({
 username: usernameValidation,
 email: emailValidation,
 password: passwordValidation,
});
