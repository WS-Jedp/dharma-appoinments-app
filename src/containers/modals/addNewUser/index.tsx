"use client";

import { ModalContainer } from "@/components/modal/container";
import UsersServices from "@/services/users";
import { User } from "@prisma/client";
import { useState } from "react";

export const ModalContainerNewUser: React.FC<{
  onSuccessCallback: (user: User) => void;
  onFailureCallback: (error: any) => void;
  onCancel: () => void;
}> = ({ onFailureCallback, onSuccessCallback, onCancel }) => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password || !confirmPassword) {
      alert("Please fill all the fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const user = await UsersServices.addNewUser({
        email,
        password,
      });

      setLoading(false);
      onSuccessCallback(user);
    } catch (error) {
      setLoading(false);

      onFailureCallback(error);
    }
  };

  return (
    <ModalContainer>
      <article
        className="
                flex flex-col items-start justify-center
                w-full max-w-md
                bg-white rounded-lg shadow-md p-12
            "
      >
        <h2 className="font-bold text-3xl mb-5">Register New User</h2>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Write the new user email"
              className="mt-1 p-2 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Write the new user password"
              className="mt-1 p-2 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="Write the same password"
              className="mt-1 p-2 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            {loading ? (
              <div className="flex flex-row items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                <p className="ml-2">Loading...</p>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            )}

            <button className="font-light underline text-sm my-3" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </article>
    </ModalContainer>
  );
};
