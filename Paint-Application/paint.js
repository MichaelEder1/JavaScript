let $inputPosX;
let $inputPosY;
let $inputColor;
let $inputSize;
let $inputWidth;
let $inputHeight;
let $inputAmount;

$(document).ready(function ()
{
    $inputPosX = $("#positionX");
    $inputPosY = $("#positionY");
    $inputColor = $("#color");
    $inputSize = $("#size");
    $inputWidth = $("#width");
    $inputHeight = $("#height");

    updateFormElements();

    //Zeichnen eines Objekts, wenn auf "Draw" geklickt wird
    $("#draw").click(function ()
    {
        //Auslesen der positionX und positionY Felder, die dann als Parameter
        //an die Funktion validateInputAndDraw weitergegeben werden.
        let positionX = checkInputField("positionX");
        let positionY = checkInputField("positionY");
        validateInputAndDraw(Number(positionX), Number(positionY));
    });

    $("#empty").click(function ()
    {
        $("#paintArea").children().remove();
    });

    $("#shape").change(function ()
    {
        updateFormElements();
    });

    $("#paintArea").click(function (e)
    {
        //Aufruf der Funktion validateInputAndDraw und übergabe der
        //Paramter mit den Koordinaten, wo wir in der Zeichenfläche geklickt haben.
        validateInputAndDraw(e.clientX, e.clientY);
    });

});

//Diese Funktion bestimmt, welche Formularfelder dem User bei welcher Figur angezeigt werden
function updateFormElements()
{
    let shape = $("#shape").val();
    switch (shape)
    {
        case "square":
            $inputSize.parent().show();
            $inputWidth.parent().hide();
            $inputHeight.parent().hide();
            break;
        case "rectangle":
            $inputSize.parent().hide();
            $inputWidth.parent().show();
            $inputHeight.parent().show();
            break;
        case "frame":
            $inputSize.parent().hide();
            $inputWidth.parent().hide();
            $inputHeight.parent().hide();
            break;
        case "circle":
            $inputSize.parent().hide();
            $inputWidth.parent().show();
            $inputHeight.parent().show();
            break;
        case "triangle":
            $inputSize.parent().show();
            $inputWidth.parent().hide();
            $inputHeight.parent().hide();
            break;
        case "stickFigure":
            $inputSize.parent().hide();
            $inputWidth.parent().show();
            $inputHeight.parent().show();
            break;
        default:
            break;
    }
}

function validateInputAndDraw(positionX, positionY)
{
    //Auslesen der Formularfelder
    let shape = document.paintForm.shape.options[document.paintForm.shape.selectedIndex].value;
    let color = checkInputField("color");
    let size = checkInputField("size");
    let width = checkInputField("width");
    let height = checkInputField("height");

    switch (shape)
    {
        //Anlegen und zeichnen eines neuen Quadrats
        case "square":
            let s = new Square(Number(positionX), Number(positionY), color, Number(size));
            s.draw($("#paintArea"));
            break;

        //Anlegen und zeichnen eines neuen Rechtecks
        case "rectangle":
            let r = new Rectangle(Number(positionX), Number(positionY), color, Number(width), Number(height));
            r.draw($("#paintArea"));
            break;

        //Anlegen und zeichnen eines neuen Frames
        case "frame":
            let frame = new Frame(Number(positionX), Number(positionY), color);
            let r1 = new Rectangle(0, 0, "#aabbcc", 5, 10);
            frame.addPaintObj(r1);

            let s1 = new Square(100, 100, "#aaffcc", 50);
            frame.addPaintObj(s1);

            frame.draw($("#paintArea"));
            break;

        //Anlegen und zeichnen eines neuen Ovals/Kreis
        case "circle":
            let circle = new Circle(Number(positionX), Number(positionY), color, Number(width), Number(height));
            circle.draw($("#paintArea"));
            break;

        //Anlegen und zeichnen eines neuen, nach oben zeigenden, Dreiecks
        case "triangle":
            let triangle = new Triangle(Number(positionX), Number(positionY), color, Number(size));
            triangle.draw($("#paintArea"));
            break;

        //Anlegen und zeichnen eines neuen Strichmännchens
        case "stickFigure":
            let stickFigure = new StickFigure();

            //Position anpassen
            positionX = positionX - Number($("#paintArea").offset().left);
            positionY = positionY - Number($("#paintArea").offset().top);

            //Kopf
            let head = new Circle((Number(positionX) + (width * 0.33)), Number(positionY), color, Number(width * 0.33), Number(height * 0.30));
            stickFigure.addPartToArray(head)

            //Körper
            let body = new Rectangle((Number(positionX) + (width * 0.33)), (Number(positionY) + (height * 0.3)), color, Number((width * 0.33)), Number((height * 0.4)));
            stickFigure.addPartToArray(body);

            //rechter Arm
            let rightArm = new Rectangle((Number(positionX) + (width * 0.66)), (Number(positionY) + (height * 0.4)), color, Number(width * 0.28), Number(height * 0.1));
            stickFigure.addPartToArray(rightArm);

            //linker Arm
            let leftArm = new Rectangle((Number(positionX) + (width * 0.05)), (Number(positionY) + (height * 0.4)), color, Number(width * 0.28), Number(height * 0.1));
            stickFigure.addPartToArray(leftArm);

            //rechter Fuß
            let rightFoot = new Rectangle((Number(positionX) + (width * 0.52)), (Number(positionY) + (height * 0.7)), color, Number(width * 0.14), Number(height * 0.3));
            stickFigure.addPartToArray(rightFoot);

            //linker Fuß
            let leftFoot = new Rectangle((Number(positionX) + (width * 0.33)), (Number(positionY) + (height * 0.7)), color, Number(width * 0.14), Number(height * 0.3));
            stickFigure.addPartToArray(leftFoot);

            stickFigure.draw($("#paintArea"));
            break;

        default:
            break;
    }

}

//Felder des Formulars auslesen - Hilfsfunktion
function checkInputField(id)
{
    let $inputField = $("#" + id);

    if ($inputField.val() === "")
    {
        $inputField.css("border", "1px solid red"); //roter Rahmen
        return "";
    }
    else
    {
        $inputField.css("border", "1px solid #cdcdcd");
        return $inputField.val();
    }
}


