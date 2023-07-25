import { React, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { useDrop, useDrag } from "react-dnd";

import ToDo from "../components/ToDo/ToDo";
import ToDoForm from "../components/ToDoForm/ToDoForm";
import SearchBar from "../components/SearchBar/SearchBar";

import "./Home.css";

export const ItemTypes = {
  Todo: "todo",
};

const Home = () => {
  const [todos, setTodos] = useState([]); //One to hold all todos
  const [inProgress, setInProgress] = useState([]); //Hold all in progress todos
  const [filteredTodos, setFilteredTodos] = useState([]); //Hold hold completed todos
  const [archive, setArchive] = useState([]);
  const [text, setText] = useState("");

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "todo",
    drop: (item) => addItemToSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  //--------- Fetch Data from JSON Server ---------//
  const addItemToSection = (id) => {
    console.log(id);
  };

  const fetchTodos = async () => {
    const res = await fetch("http://localhost:3000/todos");
    const data = await res.json();

    return data;
  };

  useEffect(() => {
    const getTodos = async () => {
      const todosFromServer = await fetchTodos();
      setTodos(todosFromServer);
      setFilteredTodos(
        todos.filter(
          (todo) => todo.completed !== false && todo.isEditing !== true
        )
      );
      setInProgress(
        todos.filter(
          (todo) => todo.completed !== true && todo.isEditing !== true
        )
      );
      setArchive(todos.filter((todo) => todo.isEditing !== false));
    };

    getTodos();
  }, [todos, inProgress, filteredTodos, archive]);

  //--------- Fetch Todo from JSON Server ---------//
  const fetchTodo = async (id) => {
    const res = await fetch(`http://localhost:3000/todos/${id}`);
    const data = await res.json();

    return data;
  };

  //--------- addTodo ---------//

  const addTodo = async (
    id,
    taskName,
    taskDescription,
    isEditing = false,
    completed = false
  ) => {
    id = uuidv4();
    const task = { id, taskName, taskDescription, isEditing, completed };
    const res = await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const data = await res.json();

    setTodos([...todos, data]);
  };

  //--------- deleteTodo ---------//

  const deleteTodo = async (id) => {
    const task = await fetchTodo(id);
    task.isEditing = true;
    const res = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });

    setArchive([...archive, task]);
    if (task.isEditing) {
      setFilteredTodos(filteredTodos.filter((todo) => todo.id == task.id));
      console.log(filteredTodos);
    } else {
      setInProgress(inProgress.filter((todo) => todo.id == task.id));
      console.log(inProgress);
    }

    /*
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    });
    const removeArray = [...todos].filter((todo) => todo.id !== id);
    setTodos(removeArray);
    */
  };

  //--------- editTodo ---------//

  const editTodo = async (task) => {
    const taskToToggle = await fetchTodo(task.id);
    task.completed = taskToToggle.completed;

    const res = await fetch(`http://localhost:3000/todos/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const data = await res.json();
    console.log(data);

    setTodos(
      todos.map((todo) =>
        todo.id === task.id
          ? {
              id: todo.id,
              taskName: task.taskName,
              taskDescription: task.taskDescription,
              isEditing: todo.isEditing,
              completed: todo.completed,
            }
          : todo
      )
    );
  };

  //--------- setTodoComplete ---------//

  const completeTodo = async (id) => {
    const taskToToggle = await fetchTodo(id);
    const updTask = { ...taskToToggle, completed: !taskToToggle.completed };

    const res = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updTask),
    });

    setTodos(todos.map((todo) => (todo.id === id ? updTask : todo)));

    // Remove the task from the appropriate list and add it to the other list

    if (taskToToggle.completed) {
      setFilteredTodos(filteredTodos.filter((todo) => todo.id !== id));
      setInProgress([...inProgress, updTask]);
    } else {
      setInProgress(inProgress.filter((todo) => todo.id !== id));
      setFilteredTodos([...filteredTodos, updTask]);
    }
  };

  const searchTodo = async (taskName) => {
    setText(taskName);
    console.log("Text: ", text);
  };

  return (
    <div className="Home">
      <h1> To Do List</h1>
      <div className="form">
        <ToDoForm onSubmit={addTodo} text="Add"></ToDoForm>
      </div>
      <SearchBar searchTodo={searchTodo}></SearchBar>

      <div className="lists" ref={drop}>
        <div className="list">
          <h3 className="list-label"> In progress </h3>
          {inProgress.map((todo) => {
            if (text === "") {
              return (
                <ToDo
                  task={todo}
                  key={todo.id}
                  deleteTodo={deleteTodo}
                  editTodo={editTodo}
                  completeTodo={completeTodo}
                />
              );
            } else {
              console.log(todo.taskName);
              console.log(text);
              if (todo.taskName.toLowerCase() === text.toLowerCase()) {
                return (
                  <ToDo
                    task={todo}
                    key={todo.id}
                    deleteTodo={deleteTodo}
                    editTodo={editTodo}
                    completeTodo={completeTodo}
                  />
                );
              }
            }
          })}
        </div>
        <div className="list">
          <h3 className="list-label"> Completed </h3>
          {filteredTodos.map((todo) => {
            if (text === "") {
              return (
                <ToDo
                  task={todo}
                  key={todo.id}
                  deleteTodo={deleteTodo}
                  editTodo={editTodo}
                  completeTodo={completeTodo}
                />
              );
            } else {
              console.log(todo.taskName);
              console.log(text);
              if (todo.taskName.toLowerCase() === text.toLowerCase()) {
                return (
                  <ToDo
                    task={todo}
                    key={todo.id}
                    deleteTodo={deleteTodo}
                    editTodo={editTodo}
                    completeTodo={completeTodo}
                  />
                );
              }
            }
          })}
        </div>
        <div className="list">
          <h3 className="list-label"> Archive </h3>
          {archive.map((todo) => (
            <ToDo
              task={todo}
              key={todo.id}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
              completeTodo={completeTodo}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
