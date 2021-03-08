import { useEffect, useState } from "react";
import { useStorage } from "@capacitor-community/react-hooks/storage";

const STORAGE_KEY = "yet-another-todo-list";
export function useTodoList() {
  const [list, setTodos] = useState([]);

  /* ==== persistence */

  const { get, set } = useStorage();
  /* Cet effet ne se jouera qu'une fois à l'instanciation du composant */
  useEffect(() => {
    async function run() {
      const storedList = await get(STORAGE_KEY);

      if (storedList) {
        try {
          // cette ligne peut lancer une erreur si le json est invalide
          const parsedList = JSON.parse(storedList);
          setTodos(parsedList);
        } catch {
          // on ne fait rien si ça a échoué à parser le json
        }
      }
    }
    run();
  }, [get, setTodos]);

  /* Cet effet se jouera à chaque fois que la `list` change (comparaison via `!==`, d'où l'intérêt de créer une copie de la liste à chaque fois qu'on la met à jour) */
  useEffect(() => {
    set(STORAGE_KEY, JSON.stringify(list));
  }, [set, list]);

  /* ==== méthodes */

  function addTodo(text) {
    setTodos((todos) => {
      return [...todos, { text: text, done: false, id: generateId() }];
    });
  }

  function updateTodo(id, overrides) {
    setTodos((todos) => {
      return todos.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...overrides,
          };
        }
        return item;
      });
    });
  }

  function deleteTodo(id) {
    setTodos((todos) => {
      return todos.filter((item) => {
        if (item.id === id) {
          return false;
        }
        return true;
      });
    });
  }

  /* ==== API */

  return { list, addTodo, updateTodo, deleteTodo };
}

function generateId() {
  return Date.now();
}
