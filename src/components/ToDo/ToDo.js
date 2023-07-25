import React from "react";
import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import { BiCaretRight, BiCaretDown } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import "./ToDo.css";
import ToDoForm from "../ToDoForm/ToDoForm";
import { useState } from "react";

import { useDrag } from "react-dnd";
import { ItemTypes } from "../../routes/Home";

const ToDo = (props) => {
  const [show, setShow] = useState(false);

  const [edit, setEdit] = useState({
    id: null,
    taskName: "",
    taskDescription: "",
  });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.Todo,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    setShow(!show);
  };

  const handleEdit = (id, taskName, taskDescription) => {
    props.editTodo({
      id,
      taskName,
      taskDescription,
      inProgress: false,
      archive: false,
    });
    setEdit({
      id: null,
      taskName: "",
      taskDescription: "",
    });
  };

  if (edit.id) {
    return (
      <ToDoForm edit={edit} onSubmit={handleEdit} text="Update Task"></ToDoForm>
    );
  }

  const handleDelete = () => {
    props.deleteTodo(props.task.id);
  };

  const handleComplete = () => {
    props.completeTodo(props.task.id);
  };

  return (
    <div className="todo" ref={drag}>
      <div className="first-line">
        <div className="primary">
          <h4>{props.task.taskName}</h4>
        </div>
        <div className="secondary">
          <TiTick className size={18} onClick={handleComplete}></TiTick>
          <AiFillEdit
            onClick={() =>
              setEdit({
                id: props.task.id,
                taskName: props.task.taskName,
                taskDescription: props.task.taskDescription,
                inProgress: props.task.inProgress,
                archive: props.task.archive,
              })
            }
          />
          <AiOutlineDelete onClick={handleDelete} />
        </div>
      </div>
      <div className="second-line">
        {show ? (
          <BiCaretDown className="icon" onClick={handleClick}></BiCaretDown>
        ) : (
          <BiCaretRight className="icon" onClick={handleClick}></BiCaretRight>
        )}
        <p>Details</p>
      </div>
      {show ? (
        <div class="multiline">
          <p className="description">{props.task.taskDescription}</p>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default ToDo;
