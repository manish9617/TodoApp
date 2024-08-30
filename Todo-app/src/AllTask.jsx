import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AllFuntion } from "./store";
import { toast } from "react-toastify";

const AllTask = () => {
  const { auth, handleAuth } = useContext(AllFuntion);
  const [data, setData] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [updatedTask, setUpdatedTask] = useState({
    taskName: "",
    taskDate: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      axios.get("https://todoapp-ho3m.onrender.com/auth").then((res) => {
        if (res.data.Status === "Success") {
          handleAuth();
        } else {
          console.log(res.data.Error);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (auth) {
      axios.get("https://todoapp-ho3m.onrender.com/data").then((res) => {
        setData(res.data.tasks);
      });
    }
  }, [auth]);

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setUpdatedTask({ taskName: task.taskName, taskDate: task.taskDate });
  };

  const handleUpdate = () => {
    axios
      .put(
        `https://todoapp-ho3m.onrender.com/edit/${editingTaskId}`,
        updatedTask
      )
      .then((res) => {
        if (res.data.Status === "Success") {
          toast.success("Task updated successfully");
          setData(
            data.map((task) =>
              task.id === editingTaskId ? { ...task, ...updatedTask } : task
            )
          );
          setEditingTaskId(null);
        } else {
          toast.error("Failed to update task");
        }
      })
      .catch((err) => {
        console.error("Error updating task:", err);
        toast.error("Failed to update task");
      });
  };

  const handleCancel = () => {
    setEditingTaskId(null);
  };

  const handleDelete = (taskId) => {
    axios
      .delete(`http://localhost:3000/delete/${taskId}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          toast.success("Task deleted successfully");
          setData(data.filter((task) => task.id !== taskId));
        } else {
          toast.error("Failed to delete task");
        }
      })
      .catch((err) => {
        console.error("Error deleting task:", err);
        toast.error("Failed to delete task");
      });
  };

  return (
    <div className="container mt-4">
      {!auth ? (
        <div className="text-center">First do login</div>
      ) : (
        <>
          {data.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Serial Number</th>
                  <th>Task Name</th>
                  <th>Task Date</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {data.map((task, index) => (
                  <tr key={task.id}>
                    <td>{index + 1}</td>
                    <td>
                      {editingTaskId === task.id ? (
                        <input
                          type="text"
                          value={updatedTask.taskName}
                          onChange={(e) =>
                            setUpdatedTask({
                              ...updatedTask,
                              taskName: e.target.value,
                            })
                          }
                        />
                      ) : (
                        task.taskName
                      )}
                    </td>
                    <td>
                      {editingTaskId === task.id ? (
                        <input
                          type="date"
                          value={updatedTask.taskDate.split("T")[0]} // Extracting only the date part
                          onChange={(e) =>
                            setUpdatedTask({
                              ...updatedTask,
                              taskDate: e.target.value,
                            })
                          }
                        />
                      ) : (
                        new Date(task.taskDate).toISOString().split("T")[0] // Displaying only the date
                      )}
                    </td>
                    <td>
                      {editingTaskId === task.id ? (
                        <>
                          <button
                            onClick={handleUpdate}
                            className="btn btn-success me-2"
                          >
                            Update
                          </button>
                          <button
                            onClick={handleCancel}
                            className="btn btn-secondary ms-2"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(task)}
                          className="btn btn-primary"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center">No tasks found. Add some tasks!</div>
          )}
        </>
      )}
    </div>
  );
};

export default AllTask;
