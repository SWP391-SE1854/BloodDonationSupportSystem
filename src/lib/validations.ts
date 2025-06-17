import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email cannot be empty").email("Invalid email address"),
  password: z.string().min(1, "Password cannot be empty").min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string()
    .min(1, "Name cannot be empty")
    .refine(val => val.trim().length > 1, "Name must be at least 2 characters")
    .refine(val => /^[a-zA-Z\s]+$/.test(val.trim()), "Name cannot contain numbers or special characters")
    .refine(val => /\S/.test(val.trim()), "Name cannot contain only spaces"),
  email: z.string()
    .min(1, "Email cannot be empty")
    .email("Invalid email address"),
  password: z.string()
    .min(1, "Password cannot be empty")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password cannot be empty"),
  phoneNumber: z.string()
    .min(1, "Phone number cannot be empty")
    .regex(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/, "Invalid phone number"),
  district: z.string()
    .min(1, "District cannot be empty")
    .min(2, "District is required"),
  city: z.string()
    .min(1, "City cannot be empty")
    .min(2, "City is required"),
  address: z.string()
    .min(1, "Address cannot be empty")
    .min(5, "Address is required"),
  dateOfBirth: z.string().min(1, "Date of birth cannot be empty"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const profileUpdateSchema = z.object({
  name: z.string()
    .min(1, "Name cannot be empty")
    .refine(val => val.trim().length > 1, "Name must be at least 2 characters")
    .refine(val => /^[a-zA-Z\s]+$/.test(val.trim()), "Name cannot contain numbers or special characters")
    .refine(val => /\S/.test(val.trim()), "Name cannot contain only spaces"),
  email: z.string()
    .min(1, "Email cannot be empty")
    .email("Invalid email address"),
  phone: z.string()
    .min(1, "Phone number cannot be empty")
    .regex(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/, "Invalid phone number"),
  district: z.string()
    .min(1, "District cannot be empty")
    .min(2, "District is required"),
  city: z.string()
    .min(1, "City cannot be empty")
    .min(2, "City is required"),
  address: z.string()
    .min(1, "Address cannot be empty")
    .min(5, "Address is required"),
  dob: z.string().min(1, "Date of birth cannot be empty"),
}); 