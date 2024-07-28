/**
  * Student Number: 214429476
  * Assignment Number: 1
  * Name: Eric Lin
  * Title: Colour war
  * Description of Interaction:
  *     Enter: Press to reset the grid and restart the simulation
  *     Space bar: Press to pause the simulation
  *     Modify "dim" variable: Increase or decrease the size of the grid
  *     Move Mouse: generate random colors ond the grid
  *     Left Click and Hold + Move Mouse: generate the clicked/selected color on the grid
**/


/**
  * Globals are declared here
**/
// Sets the dimension variable
// This number can be substituted for any integer
// Larger integers will result in a larger grid size
let dim = 100;
// Creates two grids of cells using the declared dimensions
// First grid is for the current field
// Second grid is for the future field
// Two grids are used for updates
let field = new field2D(dim);
let future = new field2D(dim);
// Constants for the red, green, and blue values (RGB)
const cellList = [[1,0,0],[0,1,0],[0,0,1]];
const halfAliveList = [[0.5,0,0],[0,0.5,0],[0,0,0.5]];
// The variable that remember if the mouse is being held down
let held = false;
// The variable that remembers the color which was clicked
let clickedRGBIndex = -1;
// The variable that holds how much time has passes
let time = 0;

/**
  * The initialize function that sets the states of the each cell
  * Each cell in the field is either alive or dead
  * If the cell has a value of 1 it is alive
  * If the cell has a value of 2 it is dead
  * @param  int  column  The column of the current cell
  * @param  int  row     The row of the current cell
  * @return N/A
**/
// The Field will initially be set to be completely black
function initialize_field(column, row) 
{
  // Resets the field to be all black
  field.set(0);
}

/**
  * This function spawns a cell on the map
  * The cell with have a fixed size of 5x5
  * @param  int    xPosition  The x coordinate that the cell will be spawned at
  * @param  int    yPosition  The y coordinate that the cell will be spawned at
  * @param  [int]  color      The colour that the cell will be given
**/
function setCells(xPosition, yPosition, color)
{
  // Creates the cell with a width and height of 5 units
  // Loops starts at xPosition - 5
  // Loop ends at xPosition + 5
  for (xPositionIndex = 0; xPositionIndex < 10; xPositionIndex ++)
    {
      // Loops starts at yPosition - 5
      // Loop ends at yPosition + 5
      for (yPositionIndex = 0; yPositionIndex < 10; yPositionIndex ++)
        {
            // Sets each coordinate on the field to the assigned colour
            field.set(cellList[color], xPositionIndex + xPosition, yPositionIndex + yPosition);
        }
    }
}

/**
  * This function updates the field by checking the current cell and its neighbours
  * @param  int  column  The column of the current cell
  * @param  int  row     The row of the current cell
  * @return int  [int]   Returns an array of integers that corresponds to the RGB values (colours) of the coordinate
**/
function update_field(column, row) 
{
  // Declaration and initialization of variables
  // Set the colour index values as -1 (does not exist)
  let RGBIndex = -1;
  let RGBOfNeighbours = -1;
  
  // Gets the current cell
  let Current = field.cell(column, row);
  // Gets the cell that is to the right of the current cell
  let East = field.cell(column + 1, row);
  // Gets the cell that is to the left of the current cell
  let West = field.cell(column - 1, row);
  // Gets the cell that is below the current cell
  let South = field.cell(column, row + 1);
  // Gets the cell that is above the current cell
  let North = field.cell(column, row - 1);
  // Gets the cell that is bottom right of the current cell
  let SouthEast = field.cell(column + 1, row + 1);
  // Gets the cell that is the bottom left of the current cell
  let SouthWest = field.cell(column - 1, row + 1);
  // Gets the cell that is the top right of the current cell
  let NorthEast = field.cell(column + 1, row - 1);
  // Gets the cell that is the top left of the current cell
  let NorthWest = field.cell(column - 1, row - 1);
  // Adds the integer values of each cell that has been retrieved to create a total
  // If the cell is dead it will add + 0
  // If the cell is alive it will add + 1
  let totalValues = [0,0,0];
  // Adds the values of the neighbouring cells and stores them in an array containing the total RGB values of all neighbouring cells
  for (index1 = 0; index1 < 3; index1 ++)
    {
      totalValues[index1] = Math.ceil(East[index1]) + Math.ceil(West[index1]) + Math.ceil(South[index1]) + Math.ceil(North[index1]) + Math.ceil(NorthEast[index1]) + Math.ceil(NorthWest[index1]) + Math.ceil(SouthEast[index1]) + Math.ceil(SouthWest[index1]);
    }

  // Gets the colour of the current cell
  // Checks if the current cell is either of either red, green, or blue, colour
  // If the current cell is black, then the RGB index of the current cell is set to -1 (black)
  if (Current[0] == 1 || Current[0] == 0.5)
    RGBIndex = 0;
  else if (Current[1] == 1 || Current[1] == 0.5)
    RGBIndex = 1;
  else if (Current[2] == 1 || Current[2] == 0.5)
    RGBIndex = 2;
  else
    RGBIndex = -1;
  
  // Find the most prominent colour amongst neighbouring cells (RGBOfNeighbours)
  // The colour of the neighbours is determined by which colour is most abundunt amonst the current cell's neighbours
  if (totalValues[0] > totalValues[1] && totalValues[0] > totalValues[2])
      RGBOfNeighbours = 0;
  else if (totalValues[1] > totalValues[2] && totalValues[1] > totalValues[0])
      RGBOfNeighbours = 1;
  else if (totalValues[2] > totalValues[1] && totalValues[2] > totalValues[0])
      RGBOfNeighbours = 2;
  // If the colours are equally distributed amonst the neighbours than a random colour is assigned
  else
    RGBOfNeighbours = random(3);
  
  // If the current cell "Current" is alive
  // Cells that are half alive are still considered to be alive
  if (Current[RGBIndex] >= 0.5)
  { 
    // A cell is overwhelmed/killed/assimilated if they are surrounded by cells of different colours
    if (RGBIndex != RGBOfNeighbours && totalValues[RGBOfNeighbours] >= totalValues[RGBIndex])
      {
        return cellList[RGBOfNeighbours];
      }
    // If a cell is completely surrounded by allies it become half dead
    // Starvation/lack of exposure
    else if (totalValues[RGBIndex] >= 8)
      {
        return halfAliveList[RGBIndex];
      }
    // If a cell is surrounded by allies (of the same colour) it remains untouched
    else
      return cellList[RGBIndex];
  }
  // If the current cell "Current" is dead
  else if (RGBIndex == -1)
  {
    // A cell is "reproduced"/"spawned" if there are exactly 3 neighbours of the same colour
    // The new cell becomes alive (is given a state of 1)
    // When it is revived, it will have the same colour as the cells that revived it
    if (totalValues[0] >= 3 || totalValues[1] >= 3 || totalValues[2] >= 3) 
    {
      if (totalValues[0] > totalValues[1] && totalValues[0] > totalValues[2])
        return cellList[0];
      else if (totalValues[1] > totalValues[2] && totalValues[1] > totalValues[0])
        return cellList[1];
      else if (totalValues[2] > totalValues[1] && totalValues[2] > totalValues[0])
        return cellList[2];
      else
        return cellList[random(3)];
    }
    // Otherwise the cell remains dead
    else 
    {
      return 0;
    }
  }
}

/**
  * This is the reset function
  * This function is called evertime the inter key is pressed
**/
function reset() {
  // The field is (re)initialized
  field.set(initialize_field)
}

/**
  * This method is called before rendering each frame (higher frame rates results in more updates)
  * This method can be "stopped"/"halted"/"paused" by pressing the space bar
  * @param  int  dt  This variable (deltaTime) contains the amount of time (in seconds) since the last update/frame
  * There is a global variable "now" that gives the time since start (in seconds)
**/
function update(dt) 
{   
    // Remembers the time
    time += dt;
    // Executes every 1/10 of a second
    if (time > 0.1)
    {
      // Determines the random x position (within 2 points of the grid's borders)
      let randomPositionX = random(dim - 4) + 2;
      // Determines the random y position (within 2 points of the grid's borders)
      let randomPositionY = random(dim - 4) + 2;
      // Picks a random colour or Red Green or Blue
      let randomColor = random(3);
      // If the user is not holding down the left mouse button then the cursor will be assigned a random RGB value every 1/10th of a second
      if (!held)
        clickedRGBIndex = random(3);
      setCells(randomPositionX, randomPositionY, randomColor);
      // Resets the time
      time = 0;
    }
  
    // Updates the grid field
    future.set(update_field)
  
    // Sets the temporary grid field as the current grid field
    let temp = field;
    // Sets the new/future grid field as the current grid field
    field = future;
    // Sets the new/future grid field as the tempoary grid field
    future = temp;
}

/**
  * This method is called to render the graphics
  * @param Canvas ctx The HTML 5 canvas that will be rendered
  * Using the "esc" key will toggle fullscreen
**/
function draw(ctx) {
    // rendering code here
    field.draw();
}

/**
  *This function is called during any mouse events
  * @param String kind The kind of event ("down", "up", "move")
  * @param Array  pt   The position of the cursor during the mouse event in the range of (0,0 to 1,1)
  * @param String id   The mouse button that has been pressed/released
**/
function mouse(kind, pt, id) 
{
  // Stores the mouse x position on the grid
  let mouseXPosition = Math.round(pt[0]*dim);
  // Stores the mouse y position on the grid
  let mouseYPosition = Math.round(pt[1]* dim);
  // Moving the mouse will generate random colour spots at x and y coordinate of the mouse
  if (kind == "move" && clickedRGBIndex != -1)
    {
        // Calls the setCells method
        // Forces a cell to spawn with a random colour at the x and y coordinate of the cursor whenever the mouse is moved
        setCells(mouseXPosition - 5, mouseYPosition - 5, clickedRGBIndex);
    }
  // Holding the mouse key down will generate a specific colour
  if (kind == "down")
    {
      // Remember that the mouse key is being held down
      held = true;
      // Retrieves the cell that is currently being selected/hovered over by the cursor
      let clickedCell = field.cell(mouseXPosition, mouseYPosition)
      // Gets the colour of the current cell
      // Checks if the current cell is either of either red, green, blue, or black
      // The cursor will now spawn cells of the selected colour whenever the mouse is moved
      if (clickedCell[0] == 1 || clickedCell[0] == 0.5)
        clickedRGBIndex = 0;
      else if (clickedCell[1] == 1 || clickedCell[1] == 0.5)
        clickedRGBIndex = 1;
      else if (clickedCell[2] == 1 || clickedCell[2] == 0.5)
        clickedRGBIndex = 2;
      else
        clickedRGBIndex = -1;
    }
  // Letting go of the key will reset the variables
  // Letting go of the left mouse button will allow the cursor to begin spawning random coloured cells at its position when moved
  else if (kind == "up")
    {
      held = false;
      clickedRGBIndex = -1;
    }
}

/**
  * This function is called during key events
  * @param  String kind The kind of event ("down", "up")
  * @param  String key  The key (or keycode) that has been pressed/released
**/
function key(kind, key) 
{
    // Not used
}

/**
  * Description: 
  *     Cells spread and consume other cells
  *     Cells are consumed when they become surrounded and overwhelmed
  *     Cells will continue to spawn every few seconds to allows multiple colours to remain on the screen
  *     Without the cell spawn, the screen would eventually become filled with only one colour
  *     Moving the cursor will spawn additional cells that will help make the screen more colourfull
  * Technical Realization:
  *     The return values can either be an integer of 0 or 1.
  *       Or the return value an array using the RGB(A) values
  *     Not inspired by another system.
  *     Tried to create a function that is visual similar to 'assimilation'
  *       When a unit is surrounded or overwhelmed, they will become integrated into the group that overwhelmed them
  *     Tried to change the code till I got a specific result
  *     I was going after a very specific style/appearance
  * Future Extensions:
  *     Extend to add more colour combinations.
  *     Instead of just RGB perhaps add some secondary colours
  *     Force half cells to become dead after a certain period of time (perhaps this will create a ripple effect)
**/
