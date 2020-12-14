import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButton,
  IonLabel,
  IonItem,
  IonList,
  IonCheckbox,
  IonSegment,
  IonSegmentButton,
  IonFooter,
  IonInput,
  IonBadge,
  IonIcon,
} from "@ionic/react";
import React, { useState } from "react";
import { create } from "ionicons/icons";

import "./Home.css";

export function Home() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [filterMode, setFilterMode] = useState("pending");

  function addTodo(text) {
    setTodos((todos) => {
      return [...todos, { text: text, done: false, id: generateId() }];
    });
  }

  function updateTodo(id, isDone) {
    setTodos((todos) => {
      return todos.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            done: isDone,
          };
        }
        return item;
      });
    });
  }

  const pendingTodoList = todos.filter((item) => !item.done);
  const visibleTodoList = filterMode === "pending" ? pendingTodoList : todos;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonSegment
            onIonChange={(e) => {
              setFilterMode(e.detail.value);
            }}
          >
            <IonSegmentButton value="pending">
              <IonLabel className="segment-button-with-badge">
                À faire
                {pendingTodoList.length ? (
                  <IonBadge>{pendingTodoList.length}</IonBadge>
                ) : null}
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="all">
              <IonLabel>Tous</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList>
          {!visibleTodoList.length && (
            <IonItem>
              <small>Votre liste est vide, bravo !</small>
            </IonItem>
          )}

          {visibleTodoList.map((todoItem) => {
            return (
              <IonItem
                className={`todo-item ${todoItem.done ? "-checked" : ""}`}
                key={todoItem.id}
              >
                <IonCheckbox
                  slot="start"
                  checked={todoItem.done}
                  onIonChange={() => {
                    updateTodo(todoItem.id, !todoItem.done);
                  }}
                />
                <IonLabel>{todoItem.text}</IonLabel>
                <IonButton fill="clear">
                  <IonIcon slot="icon-only" icon={create} />
                </IonButton>
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>

      <IonFooter>
        <form
          onSubmit={(event) => {
            addTodo(newTodo);
            setNewTodo("");
            event.preventDefault();
          }}
        >
          <IonItem>
            <IonInput
              value={newTodo}
              onInput={(event) => setNewTodo(event.target.value)}
              placeholder="Qu'avez-vous en tête ?"
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

function generateId() {
  return Math.random().toString(24).replace("0.", "id-");
}
