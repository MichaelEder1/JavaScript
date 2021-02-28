/* Globale Variable, die dafür sorgt, dass die radioButtons der unterschiedlichen
 * Aufgaben unterschiedliche Namen bekommen, damit die radioButtons bei jeder
 * Aufgabe asugewählt werden können. Weiters dient sie als ID für die Tasks.
 */
let taskId = 1;

//Anlegen einer globalen TaskManagementSystem Instanz, in die alle Tasks/Personen gespeichert werdenn
let taskManagementSystem = new TaskManagementSystem();

$(document).ready(function ()
{

    initPerson();

    //Eventhandler auf den add-Button hinzufügen
    $("#addTask").click(function (e)
    {
        addTask(e);
    });

    //Eventhandler auf den addSubTask-Button hinzufügen
    $("#addSubTask").click(function (e)
    {
        addSubTask(e);
    });

    //Eventhandler auf den showOpenTasks-Button hinzufügen
    $("#showOpenTasks").click(function ()
    {
        showOpenTasks();
    });

    //Eventhandler auf den showAllTasks-Button hinzufügen
    $("#showAllTasks").click(function ()
    {
        showAllTasks();
    });
});

//==================================================

//Personen erstellen, einlesen und in Combobox schreiben
function initPerson()
{
    //Personen Objekte erstellen
    let p1 = new Person("Michael", "Eder");
    let p2 = new Person("Maria", "Maier");
    let p3 = new Person("Alexander", "Huber");

    //der Eintrag ist nur da, um zu testen, dass keine Duplikate eingetragen werden
    let p4 = new Person("Michael", "Eder");

    //Personen in Taskmanagementsytem - Array schreiben
    taskManagementSystem.addPersonToArray(p1);
    taskManagementSystem.addPersonToArray(p2);
    taskManagementSystem.addPersonToArray(p3);
    taskManagementSystem.addPersonToArray(p4);

    //alle Personen im Personen-Array in die Comboxbox schreiben
    for (let persons of taskManagementSystem.persons)
    {
        taskManagementSystem.addPersonToComboBox(persons);
    }
}

//==================================================

//Diese Funktion fügt eine neue Aufgabe hinzu.
function addTask(e)
{
    //Formularfelder auslesen
    let taskName = $("#task").val();
    let taskPerson = $("#names").val();
    let taskDescription = $("#description").val();

    //neues Task Objekt erstellen
    let task = new Task(taskName, taskPerson, taskDescription, taskId);

    //Task in Liste schreiben
    task.writeTaskToHtml($("#buttons"), 0);

    //Task-Objekt in Taskmanagementsystem hinzufügen
    taskManagementSystem.addTask(task);

    ///ID um eins erhöhen
    taskId++;

    //diverse EventHandler registrieren
    registerEventHandler(e);
}

//==================================================

//Diese Funktion fügt einen Subtask zu einem ausgewählten Task hinzu
function addSubTask(e)
{
    //Fehlermeldung, wenn kein Subtask ausgewählt wurde
    if ($(".selectedTask").length === 0)
    {
        alert("Bitte eine Aufgabe auswählen, um SubTask hinzuzufügen!")
        return;
    }

    //Aus ausgewählten Task den Task als Objekt erhalten
    let rightTask = getTaskAsObject(($(".selectedTask")));

    //bevor ein Task hinzugefügt wird, wird geprüt, ob der Task noch offen ist - sonst geht es nicht
    if (!rightTask.taskStatus)
    {
        alert("SubTasks können nur zu Tasks hinzugefügt werden, wenn diese noch offen sind!");
        return;
    }

    //Fehler-Absicherung, falls Task nicht gefunden wird
    if (!rightTask)
    {
        alert("Fehler beim Root Task finden!");
    }

    //Formularfelder auslesen
    let taskName = $("#task").val();
    let taskPerson = $("#names").val();
    let taskDescription = $("#description").val();

    //Subtask erstellen
    let subTask = new Task(taskName, taskPerson, taskDescription, taskId);

    //Subtask dem Haupttask hinzufügen
    rightTask.addSubTask(subTask);

    subTask.writeTaskToHtml($(".selectedTask"), 10);

    //Counter/ID um eins erhöhen
    taskId++;

    //diverse EventHandler registrieren
    registerEventHandler(e);
}

//==================================================

//Diese Funktion registriert verschiedene EventHandler auf den Tasks
function registerEventHandler()
{

    //Radiobuttons registrieren
    $("[type='radio']").on("change", function (e)
    {
        changeStatus(e.currentTarget);
    });

    //Klick-Handler am Löschen-Button registrieren, um Task zu löschen
    $("[name='taskLöschen']").on("click", function (e)
    {
        //Task(s) aus Objekt-Modell löschen
        removeTask(e.currentTarget);
        //Task löschen
        $(e.currentTarget).parent().remove();
    });

    //Klick-Handler auf offene Tasks registrieren
    $(".openTask").on("click", function (e)
    {
        e.stopPropagation();
        $(e.currentTarget).toggleClass("selectedTask");
    });
}

//==================================================

//Diese Funktion ist dafür zuständig, den Status eines radioButtons zu erkennen,
//und je nach Status das Aussehen einer Aufgabe durch CSS-Klassen zu ändern

function changeStatus(button)
{
    //Gewählten Task als Task-Objekt erhalten
    let task = getTaskAsObject($(button).parent());

    if (button.value === "open")
    {

        button.parentNode.classList.remove("closedTask");
        button.parentNode.classList.add("openTask");
        //Auch im Objekt-Modell bei dem Task den Status auf offen setzen
        task.openTask();
    }
    else
    {
        let check = checkIfTaskCouldBeClosed($(button).parent());
        if (check)
        {
            button.parentNode.classList.remove("openTask");
            button.parentNode.classList.add("closedTask");
            //Auch im Objekt-Modell bei dem Task den Status auf geschlossen setzen
            task.closeTask();
        }
        else
        {
            alert("Bevor der Task abgeschlossen werden kann, müssen alle SubTasks abgeschlossen sein!");
            //TODO: die untenstehenden Zeilen sollten eigentlich den
            // "checked"-Wert des Buttons wieder grafisch zurücksetzen, funktioniert leider nicht
            //$(button).parent().find("[value=closed]").attr("checked", false);
            //$(button).parent().find("[value=open]").attr("checked", true);
        }
    }
}

//==================================================

//Diese Funktion zeigt alle offenen Aufgaben an
function showOpenTasks()
{
    // zuerst werden alle Tasks wieder angezeigt, um eventuell vorher gesetzte Filter zu löschen
    showAllTasks();

    //Alle Aufgaben, die die Klasse clsoedTask haben, werden ausgeblendet
    $(".closedTask").hide();
}

//==================================================

//Diese Funktion zeigt alle Aufgaben unabhängig vom Status an
function showAllTasks()
{
    $(".tasks").show();
}

//==================================================

//Diese Funktion liefert den Task als Objekt zurück, als Parameter bekommt sie den Task als <div>...</div> mit.
function getTaskAsObject(selectedTask)
{
    //Im übergebenen Task die ID suchen (ID ist in einem <span class="id">...</span>)
    let selectedTaskId = selectedTask.find(".id").text();

    //in einer dreifach-geschachtelten for-of Schleife wird der Task gesucht
    for (let task of taskManagementSystem.allTasks.values())
    {
        //wenn der Haupttask Subtasks hat geht es in dieser Schleife weiter
        for (let subtasks of task.subTasks.values())
        {
            //wenn der Subtask wiederum Subtasks hat geht es in dieser Schleife weiter
            for (let subSubTasks of subtasks.subTasks.values())
            {
                //Hier kommen wir hin, wenn der Haupttask Subtaks hat und dieser weitere Subtasks beinhaltet
                //um gleichen Datentyp zu bekommen für if
                selectedTaskId = Number(selectedTaskId)
                //wenn die ermittelte ID gleich ist wie die ID des Sub-Subtasks, liefere Task zurück
                if (selectedTaskId === subSubTasks.taskId)
                {
                    return subSubTasks;
                }
            }
            //hier kommen wir hin, wenn der Haupttask Subtasks hat, aber die Subtaks keine weiteren Subtasks

            //um gleichen Datentyp zu bekommen für if
            selectedTaskId = Number(selectedTaskId)
            //wenn die ermittelte ID gleich ist wie die ID des Subtasks, liefere Subtask zurück
            if (selectedTaskId === subtasks.taskId)
            {
                return subtasks;
            }
        }
        //hier kommen wir hin, wenn es nur den Haupttask ohne dazugehörige Subtasks gibt

        //um gleichen Datentyp zu bekommen für if
        selectedTaskId = Number(selectedTaskId)
        //wenn die ermittelte ID gleich ist wie die ID des Subtasks, liefere Task zurück
        if (selectedTaskId === task.taskId)
        {
            return task;
        }
    }
    //Wenn ein Fehler auftritt und wir aus der Schleife fallen gib null zurück
    return null;
}

//==================================================

//Diese Funktion löscht den Task (+ ev. Subtask(s)) im Objekt-Modell
function removeTask(e)
{
    //Task als Objekt erhalten
    let selectedTask = getTaskAsObject($(e).parent());
    let success = selectedTask.deleteTask(selectedTask);
    //Wenn success null ist, bedeutet das, dass es ein Haupttask ist, deswegen können wird diesen gleich löschen
    if (success === null)
    {
        taskManagementSystem.allTasks.delete(selectedTask.taskId);
    }
    //TODO: funktioniert - allerdings müssen eventuelle Subtaks
    // jetz noch mit gelöscht werden (funktioniert noch nicht)
    // -> Objekte werden aber gelöscht
}

//==================================================

//Diese Funktion prüft, ob ein Task abgeschlossen werden kann, oder ob Subtasks noch offen sind
function checkIfTaskCouldBeClosed(task)
{
    //Task als Objekt erhalten
    let selectedTask = getTaskAsObject(task);

    //Wenn der Task keine Subtasks hat, kann er immer und sofort geschlossen werden
    if (selectedTask.subTasks.size === 0)
    {
        return true;
    }
    //falls es Subtasks gibt, werden der Status dieser geprüft und true zurückgeliefert,
    // wenn alle Subtasks abgeschlossen sind oder false, wenn Subtasks noch offen sind
    return selectedTask.checkRadioButtons(selectedTask);
}