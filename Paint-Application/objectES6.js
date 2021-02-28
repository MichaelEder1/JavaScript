class PaintObj
{
    constructor(posX, posY, color)
    { //Konstruktorfunktion
        this.posX = posX;
        this.posY = posY;
        this.color = color;
        this.div = undefined;
    }

    draw($parent)
    {
        //lege mir zusätzliches Attribute an
        this.div = $("<div></div>");
        this.div.css({ //JSON - anonymes Objekt
            position: "absolute",
            top: this.posY + "px",
            left: this.posX + "px",
            background: this.color
        });
        //einhängen in den DOM Baum
        $parent.append(this.div);
        this.setClickHandler();
    }

    deleteElement(div)
    { //have to handle div - this would be event-object
        div.remove();
    }

    setClickHandler()
    {
        //let that = this;
        //this.div.click(function(e){
        //that.deleteElement(e.currentTarget);
        //});
        this.div.click((e) =>
        {
            this.deleteElement(e.currentTarget); //this is now the klicked div-Element, we need the object - saved it in that
        });
    }

    getWidth()
    {
        throw "Method abstract - please overwrite in subclass!"
    }

    getHeight()
    {
        throw "Method abstract - please overwrite in subclass!"
    }
}

//=================================================

//Diese Klasse erzeugt ein Quadrat. Sie leitet sich von der
//PaintObj Klasse ab.
class Square extends PaintObj
{
    constructor(posX, posY, color, size)
    {
        super(posX, posY, color)
        //neues, zusätzliches Attribute angelegt
        this.size = size;
    }

    //überschreiben der draw Methode
    draw($parent)
    {
        super.draw($parent);
        $(this.div).css({
            width: this.size + "px",
            height: this.size + "px"
        });
    }

    getWidth()
    {
        return this.size;
    }

    getHeight()
    {
        return this.size;
    }
}

//=================================================

//Diese Klasse erzeugt ein Rechtecl. Sie leitet sich von der
//PaintObj Klasse ab.

class Rectangle extends PaintObj
{
    constructor(posX, posY, color, width, height)
    {
        super(posX, posY, color)
        //neues, zusätzliches Attribute angelegt
        this.width = width;
        this.height = height;
    }

    //überschreiben der draw Methode
    draw($parent)
    {
        super.draw($parent);
        $(this.div).css({
            width: this.width + "px",
            height: this.height + "px"
        });
    }

    getWidth()
    {
        return this.width;
    }

    getHeight()
    {
        return this.height;
    }
}

//=================================================

//Diese Klasse erzeugt ein Frame. Sie leitet sich von der
//Rectangle Klasse ab. Es werden verschiedene Figuren in
//einem Array gespeichert, das später nach und nach gezeichnet wird.

class Frame extends Rectangle
{
    constructor(posX, posY, color)
    {
        super(posX, posY, color, 0, 0);
        this.elements = [];
    }

    addPaintObj(po)
    {
        let w = po.getWidth();
        let h = po.getHeight();

        if (this.width < po.posX + w)
        {
            this.width = po.posX + w;
        }

        if (this.height < po.posY + h)
        {
            this.height = po.posY + h;
        }

        this.elements.push(po);//push fügt element in Array ein
    }

    draw($parent)
    {
        super.draw($parent);
        for (let val of this.elements)
        {
            val.draw(this.div);
        }
    }
}

//=================================================

//Diese Klasse erzeugt ein Oval/Kreis. Sie leitet sich von der
//Rectangle Klasse ab.

class Circle extends Rectangle
{
    constructor(posX, posY, color, width, height)
    {
        super(posX, posY, color, width, height);
    }

    //überschreiben der draw Methode
    draw($parent)
    {
        super.draw($parent);
        $(this.div).css({
            borderRadius: "50%"
        });
    }

    getWidth()
    {
        return this.width;
    }

    getHeight()
    {
        return this.height;
    }
}

//=================================================

//Diese Klasse erzeugt ein Dreieck. Sie leitet sich von der
//PaintObj Klasse ab.

class Triangle extends Square
{
    constructor(posX, posY, color, size)
    {
        super(posX, posY, color, size);
    }

    //überschreiben der draw Methode
    draw($parent)
    {
        super.draw($parent);
        $(this.div).css({
            width: "0px",
            height: "0px",
            background: "transparent",
            borderLeft: this.size + "px solid transparent",
            borderRight: this.size + "px solid transparent",
            borderBottom: this.size + "px solid transparent",
            borderBottomColor: this.color
        });
    }

    getWidth()
    {
        return this.size;
    }

    getHeight()
    {
        return this.size;
    }
}

//=================================================

//die Klasse Stickfigure leitet sich von PaintObj ab und
//speichert alle Teile des Strichmännchens als Objekte in
//einem Array. Dieses wird dann in der draw-Methode ausgelesen
//und gezeichnet.

class StickFigure extends PaintObj
{
    constructor()
    {
        super();
        this.partsOfStickFigure = [];
    }
    addPartToArray(partOfStickFigure)
    {
        this.partsOfStickFigure.push(partOfStickFigure);
    }

    //überschreiben der draw Methode
    draw($parent)
    {
        super.draw($parent);
        for (let elem of this.partsOfStickFigure)
        {
            elem.draw(this.div);
        }
    }
}
