import screeningMetadata from "./screening.json";

const ROW_COUNT = 8;
const COLUMN_COUNT = 10;
const SCREENING_DATA = screeningMetadata as string[][];

type SeatMatrix = number[][];
type SeatPair = number[][] | null;

// Makes a new 8-row room where every seat is available.
function initializeSeating(): SeatMatrix {
  return Array.from({ length: ROW_COUNT }, () => Array(COLUMN_COUNT).fill(0));
}

// Prints the room with row and column numbers, using X for taken and L for free.
function displaySeating(seating: SeatMatrix): void {
  const columnLabels = Array.from({ length: COLUMN_COUNT }, (_, index) => index + 1);
  console.log(`    ${columnLabels.map((column) => String(column).padStart(2, " ")).join(" ")}`);

  seating.forEach((row, rowIndex) => {
    const seats = row.map((seat) => (seat === 1 ? "X" : "L")).join("  ");
    console.log(`${String(rowIndex + 1).padStart(2, " ")}  ${seats}`);
  });
}

// Reserves one seat if its position is valid and the seat is still free.
function reserveSeat(seating: SeatMatrix, rowNumber: number, columnNumber: number): string {
  if (
    !Number.isInteger(rowNumber) ||
    !Number.isInteger(columnNumber) ||
    rowNumber < 1 ||
    rowNumber > ROW_COUNT ||
    columnNumber < 1 ||
    columnNumber > COLUMN_COUNT
  ) {
    return "Reservation failed: row and column must be within the seating room.";
  }

  const rowIndex = rowNumber - 1;
  const columnIndex = columnNumber - 1;

  if (seating[rowIndex][columnIndex] === 1) {
    return `Reservation failed: seat at row ${rowNumber}, column ${columnNumber} is already occupied.`;
  }

  seating[rowIndex][columnIndex] = 1;
  return `Reservation confirmed: seat at row ${rowNumber}, column ${columnNumber} is reserved.`;
}

// Counts the taken seats and the seats that are still free.
function countSeats(seating: SeatMatrix): number[] {
  const occupied = seating.flat().filter((seat) => seat === 1).length;
  return [occupied, seating.flat().length - occupied];
}

// Finds and returns the first pair of free seats next to each other in one row.
function findAdjacentSeats(seating: SeatMatrix): SeatPair {
  for (let rowIndex = 0; rowIndex < seating.length; rowIndex++) {
    const row = seating[rowIndex];

    for (let columnIndex = 0; columnIndex < row.length - 1; columnIndex++) {
      if (row[columnIndex] === 0 && row[columnIndex + 1] === 0) {
        return [
          [rowIndex + 1, columnIndex + 1],
          [rowIndex + 1, columnIndex + 2],
        ];
      }
    }
  }

  return null;
}

// Finds a screening detail in the JSON list of key-and-value lists.
function getScreeningDetail(key: string): string {
  for (let index = 0; index < SCREENING_DATA.length; index++) {
    if (SCREENING_DATA[index][0] === key) {
      return SCREENING_DATA[index][1];
    }
  }

  return "";
}

// Displays whether a test check passed and stops the demo when one fails.
function verifyScenarioCheck(description: string, passed: boolean): void {
  console.log(`${passed ? "PASS" : "FAIL"}: ${description}`);

  if (!passed) {
    throw new Error(`Scenario check failed: ${description}`);
  }
}

// Checks one reservation result in a terminal scenario.
function checkReservation(
  seating: SeatMatrix,
  row: number,
  column: number,
  expectedMessage: string,
  description: string,
): void {
  const message = reserveSeat(seating, row, column);
  console.log(message);
  verifyScenarioCheck(description, message.includes(expectedMessage));
}

// Tests a room's counts and available seat pair in the terminal.
function checkScenario(
  name: string,
  seating: SeatMatrix,
  expectedOccupied: number,
  expectedAvailable: number,
  expectedPair: SeatPair,
): void {
  console.log(`\n=== ${name} ===`);
  displaySeating(seating);

  const counts = countSeats(seating);
  console.log(`Seat counts: ${counts[0]} occupied, ${counts[1]} available.`);
  verifyScenarioCheck(
    `${name}: seat counts`,
    counts[0] === expectedOccupied && counts[1] === expectedAvailable,
  );

  const foundPair = findAdjacentSeats(seating);
  if (foundPair === null) {
    console.log("No adjacent available seats found.");
    verifyScenarioCheck(`${name}: no adjacent seats`, expectedPair === null);
  } else {
    console.log(`Adjacent seats found: row ${foundPair[0][0]}, column ${foundPair[0][1]} and row ${foundPair[1][0]}, column ${foundPair[1][1]}.`);
    verifyScenarioCheck(
      `${name}: first adjacent pair`,
      expectedPair !== null &&
        foundPair[0][0] === expectedPair[0][0] &&
        foundPair[0][1] === expectedPair[0][1] &&
        foundPair[1][0] === expectedPair[1][0] &&
        foundPair[1][1] === expectedPair[1][1],
    );
  }
}

// Runs the four room examples when main.ts is started in the terminal.
function runScenarios(): void {
  const firstPair: SeatPair = [[1, 1], [1, 2]];

  const emptyRoom = initializeSeating();
  checkScenario("Empty room", emptyRoom, 0, 80, firstPair);
  checkReservation(emptyRoom, 1, 1, "Reservation confirmed", "Empty room: confirm a free seat");
  checkReservation(emptyRoom, 1, 1, "already occupied", "Empty room: reject a repeat reservation");

  const partlyFilledRoom = initializeSeating();
  partlyFilledRoom[1][4] = 1;
  partlyFilledRoom[1][5] = 1;
  partlyFilledRoom[3][8] = 1;
  checkScenario("Partially filled room", partlyFilledRoom, 3, 77, firstPair);
  checkReservation(partlyFilledRoom, 2, 5, "already occupied", "Partly filled room: reject a taken seat");
  checkReservation(partlyFilledRoom, 2, 4, "Reservation confirmed", "Partly filled room: confirm a free seat");

  const scatteredRoom = initializeSeating();
  scatteredRoom.forEach((row) => {
    row.forEach((_, columnIndex) => {
      if (columnIndex % 2 === 1) {
        row[columnIndex] = 1;
      }
    });
  });
  checkScenario("Nearly full room with scattered single seats", scatteredRoom, 40, 40, null);
  checkReservation(scatteredRoom, 1, 1, "Reservation confirmed", "Scattered seats: confirm a free seat");
  checkReservation(scatteredRoom, 1, 1, "already occupied", "Scattered seats: reject a repeat reservation");

  const fullRoom = initializeSeating();
  fullRoom.forEach((row) => row.fill(1));
  checkScenario("Full room", fullRoom, 80, 0, null);
  checkReservation(fullRoom, 1, 1, "already occupied", "Full room: reject a reservation");
}

// Draws the seat map and connects seat, pair-search, and status controls.
function startSeatManager(): void {
  const seatGrid = document.querySelector<HTMLDivElement>("#seat-grid");
  const status = document.querySelector<HTMLParagraphElement>("#reservation-status");
  const occupiedCount = document.querySelector<HTMLElement>("#occupied-count");
  const availableCount = document.querySelector<HTMLElement>("#available-count");
  const pairButton = document.querySelector<HTMLButtonElement>("#find-pair");
  const screeningTitle = document.querySelector<HTMLElement>("#screening-title");
  const screeningDetails = document.querySelector<HTMLElement>("#screening-details");

  if (!seatGrid || !status || !occupiedCount || !availableCount || !pairButton || !screeningTitle || !screeningDetails) {
    return;
  }

  const seatGridElement = seatGrid;
  const statusElement = status;
  const occupiedCountElement = occupiedCount;
  const availableCountElement = availableCount;
  const seating = initializeSeating();
  let suggestedSeats: number[][] = [];

  screeningTitle.textContent = getScreeningDetail("title");
  screeningDetails.textContent = `${getScreeningDetail("date")}  ·  ${getScreeningDetail("time")}  ·  ${getScreeningDetail("room")}`;

  function showMessage(message: string, success: boolean): void {
    statusElement.textContent = message;
    statusElement.className = success ? "mt-4 min-h-12 text-sm text-[#28745f]" : "mt-4 min-h-12 text-sm text-[#bd4d39]";
  }

  function renderSeatMap(): void {
    seatGridElement.replaceChildren();

    for (let rowIndex = 0; rowIndex < seating.length; rowIndex++) {
      const rowElement = document.createElement("div");
      rowElement.className = "seat-row";

      const rowLabel = document.createElement("span");
      rowLabel.className = "row-label";
      rowLabel.textContent = String(rowIndex + 1).padStart(2, "0");
      rowElement.append(rowLabel);

      for (let columnIndex = 0; columnIndex < seating[rowIndex].length; columnIndex++) {
        const rowNumber = rowIndex + 1;
        const columnNumber = columnIndex + 1;
        const isOccupied = seating[rowIndex][columnIndex] === 1;
        const isSuggested = suggestedSeats.length === 2 &&
          suggestedSeats[0][0] === rowNumber && suggestedSeats[0][1] === columnNumber ||
          suggestedSeats.length === 2 &&
          suggestedSeats[1][0] === rowNumber && suggestedSeats[1][1] === columnNumber;
        const seatButton = document.createElement("button");

        seatButton.type = "button";
        seatButton.className = isOccupied
          ? "seat-button seat-occupied"
          : isSuggested
            ? "seat-button seat-suggested"
            : "seat-button seat-available";
        seatButton.textContent = isOccupied ? "X" : "L";
        seatButton.setAttribute(
          "aria-label",
          `Row ${rowNumber}, column ${columnNumber}, ${isOccupied ? "occupied" : "available"}`,
        );
        seatButton.addEventListener("click", () => {
          const message = reserveSeat(seating, rowNumber, columnNumber);
          if (message.startsWith("Reservation confirmed")) {
            suggestedSeats = [];
            showMessage(message, true);
            renderSeatMap();
          } else {
            showMessage(message, false);
          }
          updateCounts();
        });

        rowElement.append(seatButton);
      }

      seatGridElement.append(rowElement);
    }
  }

  function updateCounts(): void {
    const counts = countSeats(seating);
    occupiedCountElement.textContent = String(counts[0]);
    availableCountElement.textContent = String(counts[1]);
  }

  pairButton.addEventListener("click", () => {
    const pair = findAdjacentSeats(seating);
    if (pair === null) {
      suggestedSeats = [];
      showMessage("No adjacent available seats found.", false);
    } else {
      suggestedSeats = pair;
      showMessage(
        `Adjacent seats found: row ${pair[0][0]}, columns ${pair[0][1]} and ${pair[1][1]}.`,
        true,
      );
    }
    renderSeatMap();
  });

  renderSeatMap();
  updateCounts();
}

if (typeof document === "undefined") {
  runScenarios();
} else {
  import("./style.css").then(() => startSeatManager());
}

export {};