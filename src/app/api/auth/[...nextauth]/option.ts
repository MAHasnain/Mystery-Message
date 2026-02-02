import { config } from "@/config/config";
import dbConnect from "@/lib/dbConnects";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions:NextAuthOptions = {
    providers: [
        Credentials({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
    },
     async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
            
            const user = await UserModel.findOne({
                $or: [
                    {username: credentials.identifier},
                    {email: credentials.identifier}
                ]
            })
            if (!user) {
                throw new Error("No user found with this email")
            }
            
            if (!user.isVerified) {
                throw new Error("Please verify your account before login")
            }
            
        } catch (error: any) {
            throw new Error(error)
        }

     }
        }) 
    ],
    callbacks: {
    async session({ session, token }) {
        session.user._id = token._id
        session.user.isVerified = token.isVerified
        session.user.isAcceptingMessage = token.isAcceptingMessage
        session.user.username = token.username
        
      return session
    },
    async jwt({ token, user }) {
      if (token) {
            token._id = user._id?.toString()
            token.isVerified = user.isVerified
            token.isAcceptingMessage = user
            .isAcceptingMessage
            token.username = user.username;
        }
        
        return token
     }
    },
    pages: {
        signIn: '/signin'
    },
    session: {
        strategy: "jwt"
    },
    secret: config.NEXTAUTH_SECRET

}
