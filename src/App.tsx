import { useState } from 'react';

import './App.scss';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';

function getUserById(userId: number) {
  return usersFromServer.find(user => user.id === userId) || null;
}

const initialTodos = todosFromServer.map(todo => ({
  ...todo,
  user: getUserById(todo.userId),
}));

export const App = () => {
  const [todos, setTodos] = useState(initialTodos);
  const [valueSelect, setValueSelect] = useState(0);
  const [title, setTitle] = useState('');
  const [isTitleEmpty, setIsTitleEmpty] = useState(true);
  const [isSelectEmpty, setIsSelectEmpty] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const onAdd = (newTodo: Omit<Todo, 'user'>) => {
    setTodos(prevTodos => [
      ...prevTodos,
      {
        ...newTodo,
        user: getUserById(newTodo.userId),
      },
    ]);
  };

  const todosId: number = Math.max(...todos.map(el => el.id));

  const clearForm = () => {
    setTitle('');
    setValueSelect(0);
    setSubmitted(false);
  };

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitted(true);

    if (isTitleEmpty || isSelectEmpty) {
      return;
    }

    onAdd({
      id: todosId + 1,
      title,
      completed: false,
      userId: valueSelect,
    });

    clearForm();
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form action="/api/todos" method="POST" onSubmit={addTodo}>
        <div className="field">
          <label htmlFor="titleTodo">
            Title:{' '}
            <input
              id="titleTodo"
              value={title}
              type="text"
              data-cy="titleInput"
              placeholder="Enter a title"
              onChange={event => {
                setTitle(event.target.value);
                setIsTitleEmpty(false);
              }}
            />
            {isTitleEmpty && submitted && (
              <span className="error">Please enter a title</span>
            )}
          </label>
        </div>

        <div className="field">
          <label htmlFor="userTodo">
            User:{' '}
            <select
              id="userTodo"
              data-cy="userSelect"
              value={valueSelect}
              onChange={event => {
                setValueSelect(+event.target.value);
                setIsSelectEmpty(false);
              }}
            >
              <option value="0" disabled>
                Choose a user
              </option>
              {usersFromServer.map(user => (
                <option value={user.id} key={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            {isSelectEmpty && submitted && (
              <span className="error">Please choose a user</span>
            )}
          </label>
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>
      <TodoList todos={todos} />
    </div>
  );
};
