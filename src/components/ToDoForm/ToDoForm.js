import React from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "./ToDoForm.css";

const ToDoForm = (props) => {
  const [id, setId] = useState(props.edit ? props.edit.id : uuidv4());
  const [taskName, setTaskName] = useState(
    props.edit ? props.edit.taskName : ""
  );
  const [taskDescription, setTaskDescription] = useState(
    props.edit ? props.edit.taskDescription : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(id);
    props.onSubmit(id, taskName, taskDescription);
    setTaskName("");
    setTaskDescription("");
  };

  return (
    <div className="formBox">
      <form name="form" className="todoForm" onSubmit={handleSubmit}>
        <div>
          <label>Task Title</label>
        </div>
        <div>
          <input
            name="formInput"
            type="text"
            className="formInputTitle"
            placeholder="Task Title"
            value={taskName}
            style={{ width: 200 }}
            onChange={(e) => {
              setTaskName(e.target.value);
            }}
          ></input>
        </div>

        <div>
          <label>Task Description</label>
        </div>
        <div>
          <textarea
            name="formInputDescription"
            type="text"
            className="formInput"
            placeholder="Additional Information"
            value={taskDescription}
            rows="5"
            cols="30"
            onChange={(e) => {
              setTaskDescription(e.target.value);
            }}
          ></textarea>
        </div>
        <div>
          <button type="submit" className="formButton">
            {props.text}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ToDoForm;
