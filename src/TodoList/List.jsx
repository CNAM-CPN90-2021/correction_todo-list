import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButton,
  IonLabel,
  IonItem,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonFooter,
  IonInput,
  IonBadge,
} from "@ionic/react";
import React, { useState } from "react";
import { useTodoList } from "./useTodoList";

import "./List.css";
import { TodoItem } from "./TodoItem";

export function List() {
  const [newTodo, setNewTodo] = useState("");
  const { list, addTodo, updateTodo, deleteTodo } = useTodoList();
  const [filterMode, setFilterMode] = useState("all");

  const remainingTasksLength = list.filter((item) => !item.done).length;
  const visibleTodoList = getFilteredList(list, filterMode);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonSegment
            onIonChange={(e) => {
              setFilterMode(e.detail.value);
            }}
            value={filterMode}
          >
            <IonSegmentButton value="all">
              <IonLabel>Tout</IonLabel>
            </IonSegmentButton>

            <IonSegmentButton value="remaining">
              <IonLabel className="segment-button-with-badge">
                À faire
                {remainingTasksLength ? (
                  <IonBadge>{remainingTasksLength}</IonBadge>
                ) : null}
              </IonLabel>
            </IonSegmentButton>

            <IonSegmentButton value="done">
              <IonLabel>Faits</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList>
          {!remainingTasksLength && (
            <IonItem>
              <small>Votre liste est vide, bravo !</small>
            </IonItem>
          )}

          {visibleTodoList.map((todoItem) => {
            return (
              <TodoItem
                key={todoItem.id}
                text={todoItem.text}
                done={todoItem.done}
                onChange={(overrides) => updateTodo(todoItem.id, overrides)}
                onDelete={() => deleteTodo(todoItem.id)}
              />
            );
          })}
        </IonList>
      </IonContent>

      <IonFooter>
        <form
          onSubmit={(event) => {
            if (newTodo?.trim()) {
              addTodo(newTodo);
            }
            setNewTodo("");
            event.preventDefault();
          }}
        >
          <IonItem>
            <IonInput
              value={newTodo}
              onInput={(event) => setNewTodo(event.target.value)}
              placeholder="Qu'avez-vous en tête ?"
              clearInput
            />
            <IonButton type="submit" disabled={!newTodo}>
              Créer
            </IonButton>
          </IonItem>
        </form>
      </IonFooter>
    </IonPage>
  );
}

function getFilteredList(list, filterMode) {
  if (filterMode === "remaining") {
    return list.filter((item) => !item.done);
  }

  if (filterMode === "done") {
    return list.filter((item) => item.done);
  }

  return list;
}
