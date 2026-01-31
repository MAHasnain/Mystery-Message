import configType from "@/types/config";

export const config: configType = {
 MONGODB_URI: process.env.MONGODB_URI!,
 RESEND_APIKEY: process.env.RESEND_API_KEY!,
 NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!
};
