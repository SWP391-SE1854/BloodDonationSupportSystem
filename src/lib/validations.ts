import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống").min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

// Helper: kiểm tra tuổi >= 18
function isAtLeast18YearsOld(dateString: string) {
  const today = new Date();
  const dob = new Date(dateString);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 18;
}

export const registerSchema = z.object({
  name: z.string()
    .min(1, "Họ và tên không được để trống")
    .refine(val => val.trim().length > 1, "Họ và tên phải có ít nhất 2 ký tự")
    .refine(val => /^[a-zA-ZÀ-ỹ\s]+$/.test(val.trim()), "Họ và tên không được chứa số hoặc ký tự đặc biệt")
    .refine(val => /\S/.test(val.trim()), "Họ và tên không được chỉ chứa khoảng trắng"),
  email: z.string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z.string()
    .min(1, "Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu không được để trống"),
  phoneNumber: z.string()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/, "Số điện thoại không hợp lệ"),
  district: z.string()
    .min(1, "Quận/Huyện không được để trống")
    .min(2, "Quận/Huyện phải có ít nhất 2 ký tự")
    .transform(val => val.trim()),
  city: z.string()
    .min(1, "Tỉnh/Thành phố không được để trống")
    .min(2, "Tỉnh/Thành phố phải có ít nhất 2 ký tự")
    .transform(val => val.trim()),
  address: z.string()
    .min(1, "Địa chỉ không được để trống")
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự")
    .transform(val => val.trim()),
  dateOfBirth: z.string()
    .min(1, "Ngày sinh không được để trống")
    .refine(val => !isNaN(Date.parse(val)), "Ngày sinh không hợp lệ")
    .refine(isAtLeast18YearsOld, "Bạn phải đủ 18 tuổi trở lên"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export const profileUpdateSchema = z.object({
  name: z.string()
    .min(1, "Họ và tên không được để trống")
    .refine(val => val.trim().length > 1, "Họ và tên phải có ít nhất 2 ký tự")
    .refine(val => /^[a-zA-ZÀ-ỹ\s]+$/.test(val.trim()), "Họ và tên không được chứa số hoặc ký tự đặc biệt")
    .refine(val => /\S/.test(val.trim()), "Họ và tên không được chỉ chứa khoảng trắng"),
  email: z.string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  phone: z.string()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/, "Số điện thoại không hợp lệ"),
  district: z.string()
    .min(1, "Quận/Huyện không được để trống")
    .min(2, "Quận/Huyện phải có ít nhất 2 ký tự"),
  city: z.string()
    .min(1, "Tỉnh/Thành phố không được để trống")
    .min(2, "Tỉnh/Thành phố phải có ít nhất 2 ký tự"),
  address: z.string()
    .min(1, "Địa chỉ không được để trống")
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  dob: z.string().min(1, "Ngày sinh không được để trống"),
}); 