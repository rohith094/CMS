
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import {toast} from 'react-toastify';
const AddSchedule = () => {
  const { facultycode, branchcode, semesternumber } = useParams();
  const [formData, setFormData] = useState({
    facultycode: facultycode || '',
    sectioncode: '',
    day: 'Monday',
    daySelect: '',
    monthSelect: '',
    yearSelect: '',
    starttime: '',
    endtime: '',
    coursecode: '',
    repeatType: 'none',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [semesterEndDate, setSemesterEndDate] = useState(''); // Store semester end date
  const navigate = useNavigate();
  const token = Cookies.get('admintoken');

  // Fetch sections based on semesternumber and branchcode
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/admin/sections/${semesternumber}/${branchcode}`, {
          headers: { Authorization: `${token}` },
        });
        setSections(response.data);
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };

    fetchSections();
  }, [semesternumber, branchcode, token]);

  // Fetch semester details to get semesterenddate when repeatType is "weekly"
  useEffect(() => {
    const fetchSemesterEndDate = async () => {
      if (formData.repeatType === 'weekly') {
        try {
          const response = await axios.get(`http://localhost:3001/admin/semester/${semesternumber}`, {
            headers: { Authorization: `${token}` },
          });
          const { enddate } = response.data;

          // Convert to YYYY-MM-DD format
          const formattedEndDate = new Date(enddate).toISOString().split('T')[0];

          setSemesterEndDate(formattedEndDate); // Set semester end date without timezone
          setFormData((prevData) => ({ ...prevData, endDate: formattedEndDate })); // Auto-fill endDate
        } catch (error) {
          console.error('Error fetching semester details:', error);
        }
      }
    };

    fetchSemesterEndDate();
  }, [formData.repeatType, semesternumber, token]);

  // Update the day field based on the selected date
  useEffect(() => {
    if (formData.yearSelect && formData.monthSelect && formData.daySelect) {
      const selectedDate = new Date(`${formData.yearSelect}-${formData.monthSelect}-${formData.daySelect}`);
      const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' }); // Get day of the week as string (e.g., Monday)
      setFormData((prevData) => ({ ...prevData, day: dayOfWeek }));
    }
  }, [formData.daySelect, formData.monthSelect, formData.yearSelect]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const scheduledate = `${formData.yearSelect}-${formData.monthSelect}-${formData.daySelect}`;
    try {
      await axios.post(
        'http://localhost:3001/admin/classschedule/add',
        { ...formData, scheduledate },
        { headers: { Authorization: `${token}` } }
      );
      console.log(formData);
      toast.success("schedules added successfully");
      navigate(-1);
    } catch (error) {
      toast.error("error adding schedule");
    } finally {
      setLoading(false);
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { name: 'January', value: '01' },
    { name: 'February', value: '02' },
    { name: 'March', value: '03' },
    { name: 'April', value: '04' },
    { name: 'May', value: '05' },
    { name: 'June', value: '06' },
    { name: 'July', value: '07' },
    { name: 'August', value: '08' },
    { name: 'September', value: '09' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' },
  ];
  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Add Schedule</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="facultycode"
          placeholder="Faculty Code"
          value={formData.facultycode}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
          required
          disabled
        />
        <select
          name="sectioncode"
          value={formData.sectioncode}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select Section</option>
          {sections.map((section) => (
            <option key={section.sectioncode} value={section.sectioncode}>
              {section.sectioncode}
            </option>
          ))}
        </select>

        {/* Hide the Day input field and show it automatically filled */}
        <input
          type="text"
          name="day"
          value={formData.day}
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
          disabled
        />

        <div className="flex space-x-2">
          <select
            name="daySelect"
            value={formData.daySelect}
            onChange={handleChange}
            className="w-1/3 px-4 py-3 border border-gray-300 rounded-md"
            required
          >
            <option value="">Day</option>
            {days.map((day) => (
              <option key={day} value={String(day).padStart(2, '0')}>{day}</option>
            ))}
          </select>
          <select
            name="monthSelect"
            value={formData.monthSelect}
            onChange={handleChange}
            className="w-1/3 px-4 py-3 border border-gray-300 rounded-md"
            required
          >
            <option value="">Month</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>{month.name}</option>
            ))}
          </select>
          <select
            name="yearSelect"
            value={formData.yearSelect}
            onChange={handleChange}
            className="w-1/3 px-4 py-3 border border-gray-300 rounded-md"
            required
          >
            <option value="">Year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <input
          type="time"
          name="starttime"
          value={formData.starttime}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
          required
        />
        <input
          type="time"
          name="endtime"
          value={formData.endtime}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="coursecode"
          placeholder="Course Code"
          value={formData.coursecode}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
          required
        />
        <select
          name="repeatType"
          value={formData.repeatType}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md"
        >
          <option value="none">No Repeat</option>
          <option value="weekly">Weekly</option>
        </select>
        {formData.repeatType !== 'none' && (
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md"
            min={semesterEndDate}
            required
          />
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-md"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Add Schedule'}
        </button>
      </form>
    </div>
  );
};

export default AddSchedule;
