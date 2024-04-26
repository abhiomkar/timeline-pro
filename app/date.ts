export function formatDate(inputDate: string) {
  if (!inputDate) {
    return null;
  }

  // Parse the input date string to create a Date object
  const date = new Date(inputDate);

  // Array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract the year, month, and day
  const year = date.getFullYear();
  const month = monthNames[date.getMonth()]; // getMonth() returns month index starting from 0
  const day = date.getDate();

  // Format the output string
  return `${month} ${day}, ${year}`;
}

export function formatTimeline(timeline: string) {
  // Split the timeline string into two parts
  const [birthDate, deathDate] = timeline.split(",");

  // Format the birth and death dates
  const formattedBirthDate = formatDate(birthDate);
  const formattedDeathDate =
    deathDate === "0" ? "Present" : formatDate(deathDate);

  // Return the formatted timeline string
  return `${formattedBirthDate} - ${formattedDeathDate}`;
}
