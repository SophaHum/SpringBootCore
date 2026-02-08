-- Migration to rename todo_lists to todos to match JPA entity
ALTER TABLE TODO_LISTS
    RENAME TO TODOS;