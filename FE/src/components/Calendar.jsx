import React from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
const Calendar = () => {
  const today = dayjs();
  const tomorrow = dayjs().add(1, "day");
  return (
    <div className="w-auto flex justify-center">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DemoItem label="Select date and time">
            <DatePicker
              defaultValue={today}
              minDate={today}
              views={["year", "month", "day"]}
            />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
};

export default Calendar;
