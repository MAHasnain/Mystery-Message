import { resend } from "@/lib/resend";
import { APIResponse } from "@/types/APIResponse";
import VerificationEmail from "../../emails/VerificationEmail";
export async function sendVerificationEmail(
    email: string,
    verifyCode: string,
    username: string,
    ): Promise<APIResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery message Verification code ',
            react: VerificationEmail ({otp: verifyCode}),
        })
        
        return {success: true, message: "Verification email sent successfully"}
    } catch (error) {
        console.error("Error sending verification email", error);
        return {success: false, message: "Failed to send verification email"}
    }
}
