import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { FaBell, FaBullhorn, FaCalendarAlt, FaTasks } from "react-icons/fa";
import { TbCheckbox } from "react-icons/tb";
import { v4 as uuidv4 } from "uuid";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [openPanel, setOpenPanel] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  const handleTask = () => {
    if (newTask.trim()) {
      if (editTaskId) {
        // Update task
        const updatedTasks = tasks.map((task) =>
          task.id === editTaskId ? { ...task, text: newTask } : task
        );
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        setEditTaskId(null);
      } else {
        // Add new task
        const updatedTasks = [
          ...tasks,
          { id: uuidv4(), text: newTask, completed: false },
        ];
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      }
      setNewTask("");
    }
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setNewTask(taskToEdit.text);
      setEditTaskId(id);
    }
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const togglePanel = (index) => {
    setOpenPanel(openPanel === index ? null : index);
  };

  const days = [
    {
      name: "Monday",
      classes: [
        { subject: "Mathematics", start: "9:00 AM", end: "10:30 AM" },
        { subject: "Physics", start: "10:45 AM", end: "12:15 PM" },
        { subject: "Chemistry", start: "12:30 PM", end: "1:30 PM" },
        { subject: "Computer Science", start: "1:45 PM", end: "2:45 PM" },
        { subject: "Physical Education", start: "3:00 PM", end: "4:00 PM" },
      ],
    },
    {
      name: "Tuesday",
      classes: [
        { subject: "Chemistry", start: "9:00 AM", end: "10:30 AM" },
        { subject: "Computer Science", start: "10:45 AM", end: "12:15 PM" },
        { subject: "Mathematics", start: "12:30 PM", end: "1:30 PM" },
        { subject: "Physics", start: "1:45 PM", end: "2:45 PM" },
        { subject: "History", start: "3:00 PM", end: "4:00 PM" },
      ],
    },
    {
      name: "Wednesday",
      classes: [
        { subject: "English", start: "9:00 AM", end: "10:30 AM" },
        { subject: "Biology", start: "10:45 AM", end: "12:15 PM" },
        { subject: "Geography", start: "12:30 PM", end: "1:30 PM" },
        { subject: "Art", start: "1:45 PM", end: "2:45 PM" },
        { subject: "Music", start: "3:00 PM", end: "4:00 PM" },
      ],
    },
    {
      name: "Thursday",
      classes: [
        { subject: "History", start: "9:00 AM", end: "10:30 AM" },
        { subject: "Geography", start: "10:45 AM", end: "12:15 PM" },
        { subject: "English", start: "12:30 PM", end: "1:30 PM" },
        { subject: "Biology", start: "1:45 PM", end: "2:45 PM" },
        { subject: "Physical Education", start: "3:00 PM", end: "4:00 PM" },
      ],
    },
    {
      name: "Friday",
      classes: [
        { subject: "Art", start: "9:00 AM", end: "10:30 AM" },
        { subject: "Music", start: "10:45 AM", end: "12:15 PM" },
        { subject: "Computer Science", start: "12:30 PM", end: "1:30 PM" },
        { subject: "Mathematics", start: "1:45 PM", end: "2:45 PM" },
        { subject: "Physics", start: "3:00 PM", end: "4:00 PM" },
      ],
    },
    {
      name: "Saturday",
      classes: [
        { subject: "Mathematics", start: "9:00 AM", end: "10:00 AM" },
        { subject: "Physics", start: "10:15 AM", end: "11:15 AM" },
        { subject: "Chemistry", start: "11:30 AM", end: "12:30 PM" },
      ],
    },
  ];

  return (
    <section className="w-[100%] h-auto mt-12 sm:mt-0 md:mt-0 lg:mt-0 bg-plat border border-gray-300 p-2 px-4 rounded-tl-2xl sm:h-[100vh] md:h-[100vh] lg:h-[100vh] md:ml-2 rounded-tr-2xl sm:rounded-bl-2xl md:rounded-bl-2xl lg:rounded-bl-2xl lg:ml-2 sm:ml-2 overflow-x-hidden">
      <div className="my-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Dashboard</h1>
        <hr className="border border-d3" />
      </div>
      <div className="dashboard-container flex justify-center items-center flex-col sm:flex-row md:flex-row lg:flex-row mt-2 sm:mt-0 md:mt-0 lg:mt-0">
        <div className="flex justify-center items-center h-full">
          <div className="left-side h-full">
            <div className="card bg-gradient-to-br from-white via-plat to-slate-200">
              <h2 className="card-title">
                <FaBell /> Notifications
              </h2>
              <div className="relative mb-2">
                <hr className="absolute inset-0 border-none h-[1px] bg-gradient-to-r from-d4 via-d0 to-transparent" />
              </div>
              <ul>
                <li>New message from John</li>
                <li>Assignment due on Friday</li>
              </ul>
            </div>
            <div className="card bg-gradient-to-br from-white via-plat to-slate-300">
              <h2 className="card-title">
                <FaBullhorn /> Announcements
              </h2>
              <div className="relative mb-2">
                <hr className="absolute inset-0 border-none h-[1px] bg-gradient-to-r from-d4 via-d0 to-transparent" />
              </div>
              <ul>
                <li>Project submission date extended</li>
                <li>Guest lecture on Monday</li>
              </ul>
            </div>
            <div className="card bg-gradient-to-br from-white via-plat to-slate-400">
              <h2 className="card-title">
                <FaCalendarAlt /> Events
              </h2>
              <div className="relative mb-2">
                <hr className="absolute inset-0 border-none h-[1px] bg-gradient-to-r from-d4 via-d0 to-transparent" />
              </div>
              <ul>
                <li>Annual sports meet on Saturday</li>
                <li>Cultural fest next month</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="right-side mx-auto rounded-xl sm:mb-7 md:mb-7 lg:mb-7 xs:w-[90vw] mb-12">
          <h2 className="card-title text-2xl">
            <RiCalendarScheduleLine /> Time Table
          </h2>
          <div className="relative mb-4">
            <hr className="absolute inset-0 border-none h-[1px] bg-gradient-to-r from-d3 via-d0 to-transparent" />
          </div>
          <div className="accordion-container h-[50vh] md:h-[50vh] lg:h-[50vh] sm:h-[50vh] w-[100%] mx-auto pr-2 overflow-y-scroll custom-scrollbar">
            {days.map((day, index) => (
              <div key={index}>
                <h2 id={`accordion-open-heading-${index}`}>
                  <button
                    type="button"
                    className="flex items-center justify-between bg-d4 w-full p-3 font-medium rtl:text-right text-white border border-d2 rounded-xl mb-2 gap-3"
                    onClick={() => togglePanel(index)}
                    aria-expanded={openPanel === index}
                    aria-controls={`accordion-open-body-${index}`}
                  >
                    <span className="flex justify-start items-center">
                      {day.name}
                    </span>
                    <svg
                      data-accordion-icon
                      className={`w-3 h-3 ${
                        openPanel === index ? "" : "rotate-180"
                      } shrink-0`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5 5 1 1 5"
                      />
                    </svg>
                  </button>
                </h2>
                <div
                  id={`accordion-open-body-${index}`}
                  className={`${openPanel === index ? "block" : "hidden"}`}
                  aria-labelledby={`accordion-open-heading-${index}`}
                >
                  <div className="p-5 border border-b rounded-2xl border-plat mb-2 border-gray-400 bg-plat1">
                    {day.classes.map((cls, idx) => (
                      <div key={idx} className="class-item">
                        <div className="class-subject xs:text-xs ">{cls.subject}</div>
                        <div className="class-time xs:text-xs ">
                          {cls.start} - {cls.end}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="task-manager card">
            <h2 className="card-title mb-1">
              <FaTasks /> Task Manager
            </h2>
            <div className="task-input">
              <input
                type="text"
                className="xs:w-[30vw]"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add new task..."
              />
              <button onClick={handleTask}>{editTaskId ? "Update" : "Add"}</button>
            </div>
            <ul className="task-list w-full h-14 mt-2 pr-2 overflow-y-scroll custom-scrollbar">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={`task-item py-2 px-2 border border-d4 my-2 ${
                    task.completed ? "completed" : ""
                  }`}
                >
                  <div className="bg-d2 rounded-full text-d2 text-sm">|</div>
                  <span className="xs:text-xs">{task.text}</span>
                  <div>
                  <button
                    className="rounded-xl bg-d0 mr-2"
                    onClick={() => toggleTaskCompletion(task.id)}
                  >
                  <div className="bg-d0 rounded-full p-1 text-white">
                  <TbCheckbox/>
                  </div>
                  </button>
                  <button
                    className="rounded-xl bg-d0 mr-2"
                    onClick={() => editTask(task.id)}
                  >
                  <div className="bg-d0 rounded-full p-1 text-white">
                  <FiEdit3/>
                  </div>
                  </button>
                  <button
                    className="rounded-xl bg-d0 mr-2"
                    onClick={() => deleteTask(task.id)}
                  >
                  <div className="bg-d0 rounded-full p-1 text-white">
                  <MdDeleteOutline/>
                  </div>
                  </button>
                  </div>

                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
