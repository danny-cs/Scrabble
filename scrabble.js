/*
  -Danny Nguyen
  -danny_nguyen1@student.uml.edu
  -University Of Massachusetts Lowell - 96.161 GUI Programming 1
  -Last updated December 6th, 2016
-->
<!--
- This .js file adds functionality to the scrabble game. Each block of code has comments explaining the 
- purpose and how it is implemented
*/
var bank = [];
var dict = {};
var score = 0;
$(function() {
    reset();
    // submit button method which will get the points of each letter submitted if it is valid
    // keeps track of the points
    $(".submit").click(function() {
        var items = $(".movable");
        var word = "";
        var thisPoints = 0;
        for (var i = 0; i < items.length; i++) {
            if ($(items[i]).parent().find(".double").length > 0) {
                thisPoints += 2 * Number($(items[i]).attr("value"));
            } else {
                thisPoints += Number($(items[i]).attr("value"));
            }
            word += $(items[i]).attr("letter");
        }
        // makes sure that the word submitted is a valid word based off dictionary.txt
        var exists = findWord(word);
        if (!exists) {
            $(".invalidWord").removeClass("hidden");
        } else {
            console.log(thisPoints);
            score += thisPoints;
            $("#score").html(score);
            $(".movable").removeClass("movable").draggable('disable');
            $(".invalidWord").addClass("hidden");
        }
    })
    // reset button method which will clear the board and hand the user 7 new letters, but keeps the score from the previous round
    $(".reset").click(function() {
        reset();
    });
});
// finds the word the user submitted and turns those letters into lowercase    
function findWord(word) {
    if (dict[word.toLowerCase()]) {
        return true;
        console.log(word.toLowerCase() + " is a word");
    }
    return false;
}
// this method adds a piece to the users track randomly
function addPiece() {
    var index = Math.floor(Math.random() * bank.length);
    var piece = bank[index];
    bank.splice(index, 1);

    var letter = piece.letter;
    if (letter == '_') {
        letter = "Blank";
    }

    $("<div/>")
        .addClass("tilePiece")
        .css({
            'background-image': 'url("Scrabble_Tiles/Scrabble_Tile_' + letter + '.jpg"'
        })
        .appendTo($(".track"))
        .attr('value', piece.value)
        .attr('letter', letter);
}

// resets the board and tiles which the player has but keeps the score
function reset() {
    bank = [];
    $(".submit").hide();

    // Do a jQuery Ajax request for the text dictionary
    $.get("/dictionary.txt", function(txt) {
        // Get an array of all the words
        var words = txt.split("\n");

        // And add them as properties to the dictionary lookup
        // This will allow for fast lookups later
        for (var i = 0; i < words.length; i++) {
            dict[words[i].toLowerCase()] = true;
        }

        $(".submit").show();
    });
    // This foor loop creates a serperate bank that contains the actual number of letters
    for (var i = 0; i < pieces.pieces.length; i++) {
        for (var j = 0; j < pieces.pieces[i].amount; j++) {
            bank.push({
                letter: pieces.pieces[i].letter,
                value: pieces.pieces[i].value,
            });
        }
    }

    $(".tilePiece").remove();
    $(".double").remove();
    // This for loop limits the number of pieces being added
    for (var i = 0; i < 8; i++) {
        addPiece();
    }
    // Adds the feature of "double" which doubles the point value of the letter in the word submitted
    var boardPieces = $(".boardPiece");
    var idx = Math.floor(Math.random() * 8);
    $($("<p/>").addClass("double").html("Double letter score!")).appendTo(boardPieces[idx]);
    boardPieces.splice(idx, 1);
    idx = Math.floor(Math.random() * 8);
    $($("<p/>").addClass("double").html("Double letter score!")).appendTo(boardPieces[idx]);

    $(".tilePiece").draggable();

    $(".bankArea").droppable({
        drop: function(event, ui) {
            var dropped = ui.draggable;
            var droppedOn = $(this);
            var index = Math.floor(Math.random() * bank.length);
            var piece = bank[index];
            bank.splice(index, 1);

            bank.push({
                letter: $(dropped).attr('letter'),
                value: $(dropped).attr('value'),
            });

            var letter = piece.letter;
            if (letter == '_') {
                letter = "Blank";
            }
            dropped.css({
                    'background-image': 'url("Scrabble_Tiles/Scrabble_Tile_' + letter + '.jpg"'
                })
                .attr('value', piece.value)
                .attr('letter', letter);
        }
    })
    // creates the board of the game which uses the droppable feature of jquery to hold the draggable "tilePiece"
    $(".boardPiece").droppable({
        drop: function(event, ui) {
            var dropped = ui.draggable;
            var droppedOn = $(this);
            $(dropped).detach().css({
                position: "relative",
                top: 0,
                left: 0
            }).appendTo(droppedOn).addClass("movable");
            $(dropped).draggable();

            var value = dropped.attr('value');

            droppedOn.find(".double").hide();

            $(".movable").draggable();

            $(".track").droppable({
                drop: function(event, ui) {
                    var dropped = ui.draggable;
                    var droppedOn = $(this);
                    $(dropped).detach().css({
                        position: "relative",
                        top: 0,
                        left: 0
                    }).appendTo(droppedOn).removeClass("movable");
                    $(dropped).draggable();
                }
            })
        }
    });
}
