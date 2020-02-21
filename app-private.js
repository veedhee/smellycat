// DECLARATIONS
const player = $("#player");
let htmlStyles = window.getComputedStyle(document.querySelector("html"));
let cols = parseInt(htmlStyles.getPropertyValue("--noCols"));
let rows = parseInt(htmlStyles.getPropertyValue("--noRows"));
let gridItem, noteClass, timeClass;


// LAYING OUT THE INITIAL PLAYER
console.log("cols: "+cols);
console.log("rows: "+rows);
for(var i=0; i<rows; i++)
{
    for(var j=0; j<cols; j++)
    {
        noteClass = "note"+i;
        timeClass = "time"+j;
        gridItem = $('<div/>').addClass(`${noteClass} ${timeClass} notes`);
        player.append(gridItem);
    }
}


// ADDING NOTE SLOT
$("#add").click(function(){
    cols += 1;
    document.documentElement.style.setProperty("--noCols", cols);
    timeClass = "time"+(cols - 1);
    relItem = "time"+(cols - 2);
    for(var i=0; i<rows; i++)
    {
        noteClass = "note"+i;
        gridItem = $('<div/>').addClass(`${noteClass} ${timeClass} notes`);
        $(`.${relItem}.${noteClass}`).after(gridItem);
    }
    totalTime += 1;
});


// REMOVING NOTE SLOT
$("#remove").click(function(){
    cols -= 1;
    document.documentElement.style.setProperty("--noCols", cols);
    timeClass = ".time"+cols;
    console.log(timeClass);
    $(timeClass).remove();
    totalTime -+ 1;
});


// SELECTING NOTES WHEN CLICKED (MADE LIVE FOR DYNAMIC ELEMENTS)
$("#player").on('click', ".notes", function() {
    $(this).toggleClass("selected");
});

