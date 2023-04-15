import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "../trpc";

const schema = z.object({
  username: z.string().nonempty("Username is required."),
  password: z.string().nonempty("Password is required."),
});

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const registerUser = trpc.user.register.useMutation();

  const onSubmit = (formData: any) => {
    console.log(formData); // log the form data before sending it to the server
    registerUser.mutate(formData, {
      onSuccess: () => {
        alert("User registered successfully.");
        reset();
      },
      onError: (error: any) => {
        alert(error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-900 p-10 rounded-md">
      <input
        type="text"
        placeholder="Username"
        {...register("username")}
        autoFocus
        className="bg-neutral-800 px-3 py-2 block w-full rounded-md mb-3"
      />
      {/* {errors.username && <p className="text-red-500">{errors.username.message}</p>} */}

      <input
        type="password"
        placeholder="Password"
        {...register("password")}
        className="bg-neutral-800 px-3 py-2 block w-full rounded-md mb-3"
      />
      {/* {errors.password && <p className="text-red-500">{errors.password.message}</p>} */}

      <button className="bg-zinc-500 px-3 py-2 rounded-md text-white">Register</button>
    </form>
  );
}
