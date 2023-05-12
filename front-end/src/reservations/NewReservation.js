import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function NewReservation() {
  const history = useHistory();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [formState, setFormState] = useState(initialFormState);
  const [error, setError] = useState(null);

  // This useEffect runs only if there is an error
  useEffect(() => {
    const abortController = new AbortController();
    setError(error);
    return () => abortController.abort();
  }, [error]);

  // Note: "people" may only be a number
  const changeHandler = ({ target }) => {
    setFormState({
      ...formState,
      [target.name]:
        target.name === "people" ? Number(target.value) : target.value,
    });
  };

  // Format dashes as the user types (while ignoring any non-digit characters they do type)
  const phoneHandler = (event) => {
    // Remove any non-digit characters from the user-typed input
    // This will safely ignore if they DO type the dashes
    const input = event.target.value.replace(/\D/g, "");

    let formattedInput = "";
    let firstGroup, secondGroup;

    // Add the first three digits. Add a dash after the 3rd digit, once it is typed
    if (input.length >= 3) {
      firstGroup = input.slice(0, 3);
      formattedInput = firstGroup + "-";
    } else {
      firstGroup = input.slice(0, 3);
      formattedInput = firstGroup;
    }

    // Add the second group of three digits. Add the final group of 4 digits separated by a dash
    if (input.length > 3 && input.length < 6) {
      secondGroup = input.slice(3);
      formattedInput += secondGroup;
    } else if (input.length >= 6) {
      secondGroup = input.slice(3, 6) + "-" + input.slice(6, 10);
      formattedInput += secondGroup;
    } else {
      secondGroup = input.slice(3);
      formattedInput += secondGroup;
    }

    // Allow for deletion of digits before a dash, along with the dash
    if (event.nativeEvent.inputType === "deleteContentBackward") {
      if (formattedInput.slice(-1) === "-") {
        formattedInput = formattedInput.slice(0, -1);
      } else {
        formattedInput = formattedInput.slice(0);
      }
    }

    setFormState({
      ...formState,
      mobile_number: formattedInput,
    });
  };

  // Go back to previous page on selecting cancel button
  const cancelHandler = ({ target }) => {
    history.goBack();
  };

  // Post reservation then go to dashboard page for date the reservation is set for
  const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    createReservation(formState, abortController.signal)
      .then((data) =>
        history.push(
          `/dashboard/?date=${data.reservation_date.substring(0, 10)}`
        )
      )
      .catch(setError);
  };

  return (
    <>
      <h2 className="heading my-2 p-2 text-center">New Reservation</h2>
      <div>
        <ReservationForm
          reservationData={formState}
          submitHandler={submitHandler}
          cancelHandler={cancelHandler}
          changeHandler={changeHandler}
          phoneHandler={phoneHandler}
          error={error}
        />
      </div>
    </>
  );
}

export default NewReservation;
