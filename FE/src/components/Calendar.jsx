// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from 'prop-types';
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const Calendar = ({ formValues, onChange }) => {
  const today = dayjs();

  return (
    <div className="w-auto flex justify-center">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DemoItem label="Select date and time">
            <DatePicker
              id="date"
              name="date"
              onChange={onChange}
              value={formValues.date}
              minDate={today}
              views={["year", "month", "day"]}
            />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
};

Calendar.propTypes = {
  formValues: PropTypes.shape({
    date: PropTypes.object.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Calendar;
