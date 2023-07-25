import { React, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import ToDo from "../components/ToDo/ToDo";
import ToDoForm from "../components/ToDoForm/ToDoForm";
import SearchBar from "../components/SearchBar/SearchBar";

import "./Home.css";

export const ItemTypes = {
  Todo: "todo",
};

const Home = () => {
  const [todos, setTodos] = useState([]); //One to hold all todos
  const [text, setText] = useState("");

  //--------- Fetch Data from JSON Server ---------//
  const addItemToSection = (id) => {
    console.log(id);
  };

  const fetchTodos = async () => {
    const res = await fetch("http://localhost:3000/todos");
    const data = await res.json();

    return data;
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.index === source.index &&
      destination?.droppableId === source?.droppableId
    ) {
      return;
    }

    const draggedTodo = todos.find((todo) => todo.id === draggableId);
    //console.log(draggedTodo);
    //console.log(draggedTodo.id);
    const setValue = !draggedTodo.inProgress;
    //console.log(draggedTodo?.inProgress);
    //console.log(1);
    console.log(destination.droppableId);
    if (destination?.droppableId === "inProgress") {
      console.log(1);
      const taskToToggle = await fetchTodo(draggedTodo.id);
      const updTask = {
        ...taskToToggle,
        inProgress: true,
        archive: false,
      };

      const res = await fetch(`http://localhost:3000/todos/${draggedTodo.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(updTask),
      });
    } else if (destination?.droppableId === "Completed") {
      const taskToToggle = await fetchTodo(draggedTodo.id);
      const updTask = {
        ...taskToToggle,
        inProgress: false,
        archive: false,
      };

      const res = await fetch(`http://localhost:3000/todos/${draggedTodo.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(updTask),
      });
    } else if (destination?.droppableId === "archive") {
      console.log(3);
      const taskToToggle = await fetchTodo(draggedTodo.id);
      const updTask = { ...taskToToggle, archive: true };

      const res = await fetch(`http://localhost:3000/todos/${draggedTodo.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(updTask),
      });
    }

    const newOrder = todos.map((todo) => todo);
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);
    console.log(todos);
    setTodos(newOrder);
    console.log();

    console.log(newOrder);
    /* How can I add in the new array
    const res = await fetch(`http://localhost:3000/todos`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newOrder),
    });
    */
  };

  useEffect(() => {
    const getTodos = async () => {
      const todosFromServer = await fetchTodos();
      setTodos(todosFromServer);
    };

    getTodos();
  }, [todos]);

  //--------- Fetch Todo from JSON Server ---------//
  const fetchTodo = async (id) => {
    const res = await fetch(`http://localhost:3000/todos/${id}`);
    const data = await res.json();

    return data;
  };

  const updateJson = async () => {};

  //--------- addTodo ---------//

  const addTodo = async (
    id,
    taskName,
    taskDescription,
    inProgress = true,
    archive = false
  ) => {
    id = uuidv4();
    const task = { id, taskName, taskDescription, inProgress, archive };
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
    task.archive = true;
    const res = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });
  };

  //--------- editTodo ---------//

  const editTodo = async (task) => {
    const taskToToggle = await fetchTodo(task.id);
    task.inProgress = taskToToggle.inProgress;

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
              inProgress: todo.inProgress,
              archive: todo.archive,
            }
          : todo
      )
    );
  };

  //--------- setTodoComplete ---------//

  const completeTodo = async (id) => {
    const taskToToggle = await fetchTodo(id);
    const updTask = { ...taskToToggle, inProgress: !taskToToggle.inProgress };

    const res = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updTask),
    });

    setTodos(todos.map((todo) => (todo.id === id ? updTask : todo)));

    // Remove the task from the appropriate list and add it to the other list
  };

  const searchTodo = async (taskName) => {
    setText(taskName);
    console.log("Text: ", text);
  };

  return (
    <div className="Home">
      <h1 className="title">To Do List</h1>
      <div className="form">
        <ToDoForm onSubmit={addTodo} text="Add"></ToDoForm>
      </div>
      <SearchBar searchTodo={searchTodo}></SearchBar>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="lists">
          <Droppable droppableId="inProgress">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="list"
              >
                <h3 className="list-label">In progress</h3>
                {todos
                  .filter(
                    (todo) => todo.inProgress === true && todo.archive === false
                  )
                  .map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ToDo
                            task={todo}
                            deleteTodo={deleteTodo}
                            editTodo={editTodo}
                            completeTodo={completeTodo}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="Completed">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="list"
              >
                <h3 className="list-label">Completed</h3>
                {todos
                  .filter(
                    (todo) =>
                      todo.inProgress === false && todo.archive === false
                  )
                  .map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ToDo
                            task={todo}
                            deleteTodo={deleteTodo}
                            editTodo={editTodo}
                            completeTodo={completeTodo}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="archive">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="list"
              >
                <h3 className="list-label">Archive</h3>
                {todos
                  .filter((todo) => todo.archive === true)
                  .map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ToDo
                            task={todo}
                            deleteTodo={deleteTodo}
                            editTodo={editTodo}
                            completeTodo={completeTodo}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Home;
