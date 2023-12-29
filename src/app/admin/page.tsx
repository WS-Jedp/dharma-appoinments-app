"use client";

import { User } from "@prisma/client";
import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaEye, FaEdit, FaDoorOpen, FaPlus } from "react-icons/fa";
import "react-calendar/dist/Calendar.css";
import "./styles.css";
import { Header } from "@/components/auth/header";
import Link from "next/link";
import { ModalContainerNewUser } from "@/containers/modals/addNewUser";
import UsersServices from "@/services/users";
import { ModalContainerUpdatePassword } from "@/containers/modals/updatePassword";
import { ModalRemoveUser } from "@/containers/modals/removeUser";

const AdminPanel = () => {
  const [showCreateUser, setShowCreateUser] = useState<boolean>(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState<boolean>(false);
  const [showRemoveUser, setRemoveUser] = useState<boolean>(false);
  const [userData, setUserData] = useState<User>();

  const [users, setUsers] = useState<User[]>([]);

  // Get users
  useEffect(() => {
    async function fetchData() {
      try {
        const users = await UsersServices.getAllClientUsers()
        setUsers(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }

    fetchData();
  }, []);

  const handleUpdatePassword = (user: User) => {
    // Implement update password logic
    setUserData(user);
    setShowUpdatePassword(true);
  };

  const handleDeleteUser = (user: User) => {
    // Implement delete user logic
    setUserData(user)
    setRemoveUser(true)
  };

  const handleUserDeleted = (user: User) => {
    setUsers(users.filter(u => u.id !== user.id))
    setRemoveUser(false)
    setUserData(undefined)
  }

  const handleAddNewUser = () => {
    setShowCreateUser(true);
  };

  function handleUserCreated(user: User) {
    setUsers([...users, user]);
    setShowCreateUser(false)
  }

  function handleCreateUserError(error: any) {
    console.error("Failed to create user:", error);
    setShowCreateUser(false)
  }

  function handleCancelUpdatePassword() {
    setShowUpdatePassword(false)
    setUserData(undefined)
  }

  return (
    <section
      className="
      relative
      w-full h-screen
      flex flex-col items-center justify-start
      bg-slate-50 text-black
      p-9
    "
    >
      <Header />

      <article className="flex flex-col items-center justify-center p-9  w-8/12">
        <section className="shadow-md rounded-xl bg-white p-9 w-full">
          <h1 className="font-bold text-2xl my-5">Users From Platform</h1>

          <button
            onClick={handleAddNewUser}
            className="bg-white border border-emerald-700 text-emerald-700 text-xs font-semibold py-2 px-5 rounded-full hover:bg-emerald-700 hover:text-white mr-2 flex flex-row items-center justify-center my-3"
          >
            <FaPlus size={12} className="mr-2" />
            Add user
          </button>

          <table className="min-w-full table-auto shadow-sm rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-start">Email</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2 text-start font-semibold text-sm">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 flex items-center justify-end">
                      <Link
                        href={`/appointments?email=${user.email}`}
                        className="bg-white border border-gray-700 text-gray text-xs font-semibold py-2 px-5 rounded-full hover:bg-gray-700 hover:text-white mr-2 flex flex-row items-center justify-center my-3"
                      >
                        <FaEye size={18} className="mr-2" />
                        View Details
                      </Link>
                      <button
                        onClick={() => handleUpdatePassword(user)}
                        className="bg-white border border-blue-600 text-blue-600 text-xs font-semibold py-2 px-5 rounded-full hover:bg-blue-600 hover:text-white mr-2 flex flex-row items-center justify-center"
                      >
                        <FaEdit size={18} className="mr-2" />
                        Update Password
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="bg-white border border-red-600 text-red-600 text-xs font-semibold py-2 px-5 rounded-full hover:bg-red-600 hover:text-white mr-2 flex flex-row items-center justify-center"
                      >
                        <FaTrashAlt size={18} className="mr-2" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-2 text-start font-semibold text-sm"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </article>

      {/* Modals */}
      {showCreateUser && (
        <ModalContainerNewUser
          onFailureCallback={handleCreateUserError}
          onSuccessCallback={handleUserCreated}
          onCancel={() => setShowCreateUser(false)}
        />
      )}

      {
        showUpdatePassword && userData && (
          <ModalContainerUpdatePassword 
              userData={userData}
              onCancel={handleCancelUpdatePassword}
              onFailureCallback={() => setShowUpdatePassword(false)}
              onSuccessCallback={() => {
                setShowUpdatePassword(false)
                setUserData(undefined)
              }}
          />
        )
      }

      {
        showRemoveUser && userData && (
          <ModalRemoveUser 
              userData={userData}
              onCancel={() => {
                setRemoveUser(false)
                setUserData(undefined)
              }}
              onFailureCallback={() => {
                setRemoveUser(false)
                setUserData(undefined)
              }}
              onSuccessCallback={handleUserDeleted}
          />
        )
      }
    </section>
  );
};

export default AdminPanel;
