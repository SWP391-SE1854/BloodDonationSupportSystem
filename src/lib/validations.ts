import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email không được để trống").email("Địa chỉ email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống").min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const registerSchema = z.object({
  name: z.string()
    .min(1, "Tên không được để trống")
    .refine(val => val.trim().length > 1, "Tên phải có ít nhất 2 ký tự")
    .refine(val => /^[a-zA-Z\s]+$/.test(val.trim()), "Tên không được chứa số hoặc ký tự đặc biệt")
    .refine(val => /\S/.test(val.trim()), "Tên không được chỉ chứa khoảng trắng"),
  email: z.string()
    .min(1, "Email không được để trống")
    .email("Địa chỉ email không hợp lệ"),
  password: z.string()
    .min(1, "Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu không được để trống"),
  phoneNumber: z.string()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/, "Số điện thoại không hợp lệ"),
  district: z.string()
    .min(1, "Quận/Huyện không được để trống")
    .min(2, "Quận/Huyện là bắt buộc"),
  city: z.string()
    .min(1, "Tỉnh/Thành phố không được để trống")
    .min(2, "Tỉnh/Thành phố là bắt buộc"),
  address: z.string()
    .min(1, "Địa chỉ không được để trống")
    .min(5, "Địa chỉ là bắt buộc"),
  dateOfBirth: z.string().min(1, "Ngày sinh không được để trống").refine((val) => {
    const today = new Date();
    const birthDate = new Date(val);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= 18 && age <= 60;
  }, "Bạn phải từ 18 đến 60 tuổi"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

export const profileUpdateSchema = z.object({
  name: z.string()
    .min(1, "Tên không được để trống")
    .refine(val => val.trim().length > 1, "Tên phải có ít nhất 2 ký tự")
    .refine(val => /^[a-zA-Z\s]+$/.test(val.trim()), "Tên không được chứa số hoặc ký tự đặc biệt")
    .refine(val => /\S/.test(val.trim()), "Tên không được chỉ chứa khoảng trắng"),
  email: z.string()
    .min(1, "Email không được để trống")
    .email("Địa chỉ email không hợp lệ"),
  phone: z.string()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/, "Số điện thoại không hợp lệ"),
  district: z.string()
    .min(1, "Quận/Huyện không được để trống")
    .min(2, "Quận/Huyện là bắt buộc"),
  city: z.string()
    .min(1, "Tỉnh/Thành phố không được để trống")
    .min(2, "Tỉnh/Thành phố là bắt buộc"),
  address: z.string()
    .min(1, "Địa chỉ không được để trống")
    .min(5, "Địa chỉ là bắt buộc"),
  dob: z.string().min(1, "Ngày sinh không được để trống").refine((val) => {
    const today = new Date();
    const birthDate = new Date(val);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= 18 && age <= 60;
  }, "Bạn phải từ 18 đến 60 tuổi"),
});

export const postSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  content: z.string().min(10, "Nội dung phải có ít nhất 10 ký tự"),
});
