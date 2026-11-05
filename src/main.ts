if (typeof document !== "undefined") {
  import("./style.css").then(() => {
    const app = document.querySelector<HTMLParagraphElement>("#app");
    if (app) {
      app.textContent = "If you can see this, Tailwind is working.";
    }
  });
}

const ROW_COUNT = 8;
const COLUMN_COUNT = 10;

type SeatingMatrix = number[][];

function initializeSeating(): SeatingMatrix {
  return Array.from({ length: ROW_COUNT }, () => Array(COLUMN_COUNT).fill(0));
}

function displaySeating(seating: SeatingMatrix): void {
  const columnLabels = Array.from({ length: COLUMN_COUNT }, (_, index) => index + 1);
  console.log(`    ${columnLabels.map((column) => String(column).padStart(2, " ")).join(" ")}`);

  seating.forEach((row, rowIndex) => {
    const seats = row.map((seat) => (seat === 1 ? "X" : "L")).join("  ");
    console.log(`${String(rowIndex + 1).padStart(2, " ")}  ${seats}`);
  });
}

function reserveSeat(seating: SeatingMatrix, rowNumber: number, columnNumber: number): string {
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
  return `Reservation successful: seat at row ${rowNumber}, column ${columnNumber} is reserved.`;
}

function countSeats(seating: SeatingMatrix): { occupied: number; available: number } {
  const occupied = seating.flat().filter((seat) => seat === 1).length;
  return { occupied, available: seating.flat().length - occupied };
}

type SeatPosition = { row: number; column: number };

function findAdjacentSeats(seating: SeatingMatrix): [SeatPosition, SeatPosition] | null {
  for (let rowIndex = 0; rowIndex < seating.length; rowIndex++) {
    const row = seating[rowIndex];

    for (let columnIndex = 0; columnIndex < row.length - 1; columnIndex++) {
      if (row[columnIndex] === 0 && row[columnIndex + 1] === 0) {
        return [
          { row: rowIndex + 1, column: columnIndex + 1 },
          { row: rowIndex + 1, column: columnIndex + 2 },
        ];
      }
    }
  }

  return null;
}

const seating = initializeSeating();
console.log(reserveSeat(seating, 2, 5));
console.log(reserveSeat(seating, 2, 5));
displaySeating(seating);
console.log("Seat counts:", countSeats(seating));

const adjacentSeats = findAdjacentSeats(seating);
console.log(adjacentSeats ?? "No adjacent available seats found.");

export {};

