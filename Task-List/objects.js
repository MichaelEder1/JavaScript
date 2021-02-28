//Die Klasse TaskManagementSystem speichert alle Tasks und Personen als Objekte
class TaskManagementSystem
{
    constructor()
    {
        this.allTasks = new Map();
        this.persons = [];
    }

    //Die Funktion ermöglicht es, Tasks der Map hinzuzufügen
    addTask(task)
    {
        this.allTasks.set(task.taskId, task);
    }

    //Die Funktion ermöglkicht es, Personen dem Array hinzuzufügen
    addPersonToArray(person)
    {
        this.persons.push(person);
    }

    //Die Funktion schreibt alle Personen aus dem Array in die Combobox
    addPersonToComboBox(person)
    {
        if (!this.hasName((person.firstName + " " + person.lastName)))
        {
            this.addName(person.firstName + " " + person.lastName);
        }
    }

    //Diese Funktion prüft, ob ein Name schon in der Combobox steht und verhindert somit Namen-Duplikate
    hasName(personName)
    {
        let comboBox = document.querySelectorAll("option");
        for (let elem of comboBox)
        {
            if (elem.value === personName)
            {
                //Wenn wir diese Schleife betreten, gibt es einen Namen schon einmal
                return true;
            }
        }
        return false;
    }

    //Diese Funktion fügt tatsächlich den Namen in die Combobox dazu
    addName(personName)
    {
        let newName = `<option value="${personName}" name="option">${personName}</option>`
        $("#names").append(newName);
    }
}

//Die Klasse Person ermöglicht das Erstellen eines Person-Objekts mit Vor- und Nachname
class Person
{
    constructor(firstName, lastName)
    {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

//Die Klasse Task ermöglich das Erstellen eines Task mit einem Namen,
// einer Person, einer Beschreibung und einer eindeutigen ID
class Task
{
    constructor(taskName, taskPerson, taskDescription, id)
    {
        this.taskName = taskName;
        this.taskPerson = taskPerson;
        this.taskDescription = taskDescription;
        this.taskId = id;
        this.taskStatus = true; //true = offen -> false = geschlossen
        this.subTasks = new Map();
        this.parent = undefined;
    }

    //Diese Funktion hängt einen Subtask in die Map des übergeordneten Task hinzu
    // und setzt die Parent-Variable auf den übergeordneten Task
    addSubTask(subTask)
    {
        this.subTasks.set(subTask.taskId, subTask);
        subTask.parent = this;
    }

    //Diese Funktion schreibt den Task in die Liste
    writeTaskToHtml(target)
    {
        //neuen Task als HTML Code anlegen
        let newEntry = `<div class="openTask tasks">
                    <input type="radio" name="${this.taskId}" value="open" checked>offen
                    <br>
                    <input type="radio" name="${this.taskId}" value="closed">erledigt
                    <br>
                    <p>Task <span class="id">${this.taskId}</span></p>
                    <p>Aufgabe: ${this.taskName}</p>
                    <p>Person: <span class="personName">${this.taskPerson}</span></p>
                    <p>Beschreibung: ${this.taskDescription}</p>
                    <button type="button" name="taskLöschen" class="deleteButton" value="löschen">Löschen</button>
                    <hr>
                   </div>`;

        $(target).after(newEntry);
        //TODO: Einrückungen für Subtasks
    }

    //Diese Funktion setzt den Status des Tasks auf geschlossen
    closeTask()
    {
        this.taskStatus = false;
    }

    //Diese Funktion setzt den Status des Tasks auf offen
    openTask()
    {
        this.taskStatus = true;
    }

    //Diese Funktion löscht alle untergeordneten Tasks eines
    // übergebenen Tasks "selectedTask" aus dem Objekt-Modell
    deleteTask(selectedTask)
    {
        //Wenn der übergebene Task keinen Subtaks hat, wird null zurückgeliefert
        if (selectedTask.parent === undefined)
        {
            return null;
        }
        //Sonst, wenn es Subtasks gibt, wird der Task aus der Map des übergeordneten Tasks gelöscht
        selectedTask.parent.subTasks.delete(selectedTask.taskId);
    }

    //Diese Funktion prüft den Status aller untergeordneten Tasks eines übergebenen Tasks "selectedTask"
    checkRadioButtons(selectedTask)
    {
        //For-of Schleife über alle Subtasks des übergebeben, übergeordneten Tasks
        for (let tasks of selectedTask.subTasks.values())
        {
            if (tasks.taskStatus)
            {
                //Hier kommen wir hinein, wenn ein Task offen ist
                return false;
            }
        }
        return true;
    }
}