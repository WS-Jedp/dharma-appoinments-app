"use client"
import { useState } from 'react'
import { User } from "@prisma/client";
import { ModalContainer } from "@/components/modal/container";
import UsersServices from "@/services/users";

export const ModalRemoveUser: React.FC<{
  onSuccessCallback: (user: User) => void;
  onFailureCallback: (error: any) => void;
  onCancel: () => void;
  userData: User
}> = ({ onCancel, onFailureCallback, onSuccessCallback, userData }) => {
    const [loading, setLoading] = useState<boolean>(false);
  const onDelete = async () => {
    setLoading(true);

    try {
      const user = await UsersServices.remove(userData.id);
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
        <h2 className="font-bold text-3xl mb-5">Are you sure?</h2>
        <p>
          If you delete the user you won't be able to recover it. This action is irreversible.
        </p>

        <div className='w-full flex flex-row items-center justify-center'>

          {
            loading ? (
              <p>
                Loading...
              </p>
            ) : (
              <div className='w-full h-full flex flex-row items-center justify-center my-3'>
                <button className='border border-red-600 text-red-600 rounded-full text-md px-6 py-2 hover:text-white hover:bg-red-600 w-full mx-2' onClick={onDelete}>
                  Yes
                </button>
                <button className='border border-gray-600 text-gray-600 rounded-full text-md px-6 py-2 hover:text-white hover:bg-gray-700 w-full mx-2' onClick={onCancel}>
                  No
                </button>
      
              </div>
            )
          }

            
        </div>
      </article>
    </ModalContainer>
  );
};
