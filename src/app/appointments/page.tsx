"use client";

import { AppointmentDate } from "@prisma/client";
import { useSearchParams, redirect } from "next/navigation";
import React, { useState, useEffect } from "react";
import AppointmentsServices from "@/services/appointments";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./styles.css";
import { Header } from "@/components/auth/header";
import { useSession } from "next-auth/react";
import NotificationsServices from "@/services/notifications";

const appointmentsServices = new AppointmentsServices();

const CalendarPage = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [isExternalUser, setIsExternalUser] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user?.email === currentEmail) {
      setIsExternalUser(false);
    }
  }, [status, currentEmail]);

  async function getAppointments(email: string) {
    const appointments = await appointmentsServices.getAllByEmail(email);
    setSavedDates(appointments || []);

    if (!appointments) return;

    if (appointments.length > 0) {
      setCurrentDateTimes(appointments.filter(appointment => appointment.date === new Date().toISOString().slice(0,10)).map((date) => date.time));
    }
  }

  const searchParams = useSearchParams();
  useEffect(() => {
    const email = searchParams.get("email");

    if (!email) {
      redirect("/admin");
    } else {
      setCurrentEmail(email);
      getAppointments(email);
    }
  }, [currentEmail]);

  async function handleNotifyAdmins() {
    if(!currentEmail) return

    setLoading(true)
    const notificationSent = await NotificationsServices.NotifyAdmins(currentEmail)
    setLoading(false)

  }

  // Array of available hours from 8:00 AM to 8:00 PM every 30 minutes
  const availableHours = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
  ];

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [savedDates, setSavedDates] = useState<AppointmentDate[]>([]);
  const [currentDateTimes, setCurrentDateTimes] = useState<string[]>([]);

  useEffect(() => {
    setCurrentDateTimes([]);
    const currentDatesSaved = savedDates.filter(
      (savedDate) => savedDate.date === selectedDate?.toISOString().slice(0, 10)
    );
    setCurrentDateTimes(currentDatesSaved.map((date) => date.time));
  }, [selectedDate]);

  const isDateSaved = (date: Date) => {
    // Check if the date is in your savedDates array
    // Ensure savedDates are in the correct format to compare with 'date'
    return savedDates.some(
      (savedDate) => savedDate.date === date.toISOString().slice(0, 10)
    );
  };

  const tileClassName = ({ date, view }: any) => {
    // Only apply the class to dates in the month view
    if (view === "month") {
      if (isDateSaved(date)) {
        return "saved-date";
      }
    }
  };

  const handleOnTimeClick = async (hour: string) => {
    if (!selectedDate) return;
    if (currentDateTimes.includes(hour)) {
      // Remove from database
      const appointmentToDelete = savedDates.find(
        (savedDate) =>
          savedDate.date === selectedDate?.toISOString().slice(0, 10) &&
          savedDate.time === hour
      );
      if (!appointmentToDelete) return;
      await appointmentsServices.remove(appointmentToDelete.id);
      setCurrentDateTimes(currentDateTimes.filter((time) => time !== hour));
      return;
    }

    // Add to database
    const appointmentToCreate = {
      date: selectedDate?.toISOString().slice(0, 10),
      time: hour,
      email: currentEmail,
    };
    await appointmentsServices.create(appointmentToCreate);
    setCurrentDateTimes([...currentDateTimes, hour]);
  };

  return (
    <main
      className="
      relative 
      flex flex-col items-center justify-center
      bg-slate-100 text-black
      p-12
      w-full
      rounded-lg h-screen
    "
    >
      <Header />

      <section
        className="
        relative bg-white p-9 shadow-md rounded-md
        w-full h-[90%]
        flex flex-row items-center justify-center
      "
      >
        <div className="flex flex-col w-3/5">
          <h1 className="font-bold text-4xl mb-3">Select a day</h1>
          <h3 className="font-bold text-2xl my-3">
            {selectedDate?.toISOString().slice(0, 10)}
          </h3>
          <Calendar
            onChange={(date) => date && setSelectedDate(date as Date)}
            value={selectedDate}
            tileClassName={tileClassName}
            // Additional props and configurations
          />
          <style jsx global>{`
            .saved-date {
              background-color: #079669;
              color: white;
              border: 2px solid white;
              border-radius: 0.2rem;
              padding: 0.5rem;
              margin: 12px;
            }
          `}</style>

          <p className="font-light my-3 text-md">
            Current date selected:{" "}
            <span className="font-bold">
              {selectedDate?.toISOString().slice(0, 10)}
            </span>
          </p>

          {!isExternalUser ? !loading ? (
            <button className="bg-emerald-600 py-2 px-6 text-white rounded-lg shadow-lg w-[120px]" onClick={handleNotifyAdmins}>
              Notify
            </button>
          ) : (
            <span>
              Loading...
            </span>
          ) : (<></>)}
        </div>

        <div className="mx-6 w-2/5 h-full overflow-y-auto">
          {isExternalUser ? (
            <h1 className="font-bold text-3xl mb-3">Selected hours</h1>
          ) : (
            <h1 className="font-bold text-3 xl mb-3">Select a time</h1>
          )}
          <section className="flex flex-col">
            {!isExternalUser
              ? availableHours.map((hour) => (
                  <button
                    disabled={isExternalUser}
                    onClick={() => handleOnTimeClick(hour)}
                    className={`w-100 inline-block transition duration-300 py-2 px-6 m-2 rounded-md shadow-md ${
                      currentDateTimes.includes(hour)
                        ? "bg-emerald-600 shadow-emerald-200 text-white shadow-lg"
                        : "bg-white text-black"
                    }`}
                    key={hour}
                  >
                    {hour}
                  </button>
                ))
              : currentDateTimes.length > 0 ? currentDateTimes.map((hour) => (
                  <button
                    disabled={true}
                    onClick={() => {}}
                    className={`w-100 inline-block transition duration-300 py-2 px-6 m-2 rounded-md bg-emerald-600 shadow-emerald-200 text-white shadow-md font-semibold`}
                    key={hour}
                  >
                    {hour}
                  </button>
                )) : (
                  <h3 className="font-light text-md my-3">
                    No appointments for this day
                  </h3>
                  )
                }
          </section>
        </div>
      </section>
    </main>
  );
};

export default CalendarPage;
