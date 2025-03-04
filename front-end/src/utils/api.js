/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservations.
 * @returns {Promise<[reservations]>}
 *  a promise that resolves to a possibly empty array of reservations saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Creates a new reservation and saves to database
 * @param reservation
 * the reservation object to be saved
 * @param signal
 * optional AbortConroller.signal
 * @returns {Promise<reservation>}
 * a promise that resolves the saved reservation, including a new id property
 */
export async function createReservation(reservation, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Creates a new table and saves to database
 * @param table
 * the table object to be saved
 * @param signal
 * optional AbortController.signal
 * @returns {Promise<table>}
 * a promise that resolves the saved table, including a new id property
 */
export async function createTable(table, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Retrieves all existing tables
 * @param signal
 * optional AbortController.signal
 * @returns {Promise<[tables]>}
 * a promise that resolves to a possibly empty array of tables saved in the database.
 */
export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Retrieves the reservation with specified ID
 * @param reservation_id
 * the ID property matching the required reservation
 * @param signal
 * optional AbortController.signal
 * @returns {Promise<reservation>}
 * a promise that resolves to the saved reservation
 */
export async function readReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await fetchJson(url, { headers, signal }, {})
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Updates a table to "seat" a reservation by adding the reservation ID
 * @param table_id
 * the table_id property of the table to be updated
 * @param reservation_id
 * the reservation_id of the reservation to be added to the table
 * @param signal
 * optional AbortController.signal
 * @returns {Promise<Error|*>}
 * a promise that resolves to the updated table
 */
export async function updateTable(table_id, reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id: reservation_id } }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * "Deletes" a reservation from an occupied table. (i.e. sets reservation_id to null)
 * @param table_id
 * the table_id property of the table to be reverted
 * @param signal
 * optional AbortController.signal
 * @returns {Promise<Error|*>}
 * a promise that resolves to an empty object
 */
export async function finishSeating(table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  const options = {
    method: "DELETE",
    headers,
    signal
  };
  return await fetchJson(url, options);
}

/**
 * Updates an existing reservation
 * @param reservation 
 * the reservation object to be saved
 * @param signal 
 * optional AbortController.signal
 * @returns {Promise<table>}
 * a promise that resolves to the edited reservation
 */
export async function editReservation(reservation, signal) {
  const url = new URL(
    `${API_BASE_URL}/reservations/${reservation.reservation_id}`
  );
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Sets the status of a reservation to "cancelled"
 * @param reservation_id 
 * the ID of the reservation to be updated
 * @param signal 
 * optional AbortController.signal
 * @returns {Promise<reservation>}
 * a promise that resolves to the updated reservation
 */
export async function cancelReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status: "cancelled" } }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Retrieves a single table
 * @param table_id 
 * the ID of the table to be retrieved
 * @param signal 
 * optional AbortController.signal
 * @returns {Promise<table>}
 * a promise that resolves to a table object
 */
export async function readTable(table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}`);
  return await fetchJson(url, { headers, signal });
}

/**
 * Updates all columns of a table
 * @param table 
 * the table object to be saved
 * @param signal 
 * optional AbortController.signal
 * @returns {Promise<table>}
 * a promise that resolves to the saved table
 */
export async function editTable(table, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table.table_id}`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Deletes a table from the database
 * @param table_id 
 * the id of the table to be deleted
 * @param signal
 * optional AbortController.signal 
 * @returns {Status}
 * 204 status on successful deletion
 */
export async function deleteTable(table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}`);
  return await fetchJson(url, { method: "DELETE", headers, signal }, {});
}
