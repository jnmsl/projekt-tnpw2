import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../trpc";

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginFormFields = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({
    resolver: zodResolver(loginSchema),
  });

  const loginUser = trpc.user.login.useMutation();

  const onSubmit = (data: LoginFormFields) => {
    loginUser.mutate(data, {
      onSuccess: (token) => {
        console.log("User logged in successfully.");
        // Redirect the user to another page or update the UI to reflect the logged-in state.
      },
      onError: (error) => {
        console.log(error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-900 p-10 rounded-md">
      <input
        type="text"
        placeholder="Username"
        {...register("username")}
        className="bg-neutral-800 px-3 py-2 block w-full rounded-md mb-3"
      />
      {errors.username && <p className="text-red-600">{errors.username.message}</p>}

      <input
        type="password"
        placeholder="Password"
        {...register("password")}
        className="bg-neutral-800 px-3 py-2 block w-full rounded-md mb-3"
      />
      {errors.password && <p className="text-red-600">{errors.password.message}</p>}

      <button className="bg-zinc-500 px-3 py-2 rounded-md text-white">
        Log in
      </button>
    </form>
  );
}
