"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useEffect, useState } from "react";
import { Form, useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signinSchema } from "@/schemas/signinSchema";
import { signupValidation } from "@/schemas/signupSchema";
import { APIResponse } from "@/types/APIResponse";
import axios, { AxiosError } from "axios"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Loader2 } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMassage, setUsernameMassage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500)
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMassage("")
        try {
          const response = await axios.get(`/api/unique-username?username=${username}`)
          setUsernameMassage(response.data.message)

        } catch (error) {
          const axioserror = error as AxiosError<APIResponse>;
          setUsernameMassage(axioserror.response?.data?.message ?? "Error checking username.")
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupValidation>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<APIResponse>(`/api/signup`, data);
      toast.success(response.data.message)
      router.replace(`/verify/${username}`)
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup user: ", error);
      const axiosError = error as AxiosError<APIResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage)
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous
            adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" /> }
                  <p className={`text-sm ${usernameMassage === "Username is unique" ? `text-green-500` : `text-red-500`}`}>{usernameMassage}</p>
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="password"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Please wait</>
              ) : "Signup"} 
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?
            <Link href='signin' className="text-blue-600 hover:text-blue-800" >Sign in</Link>
          </p>
        </div>
      </div>
    </div>)
}

export default Page;