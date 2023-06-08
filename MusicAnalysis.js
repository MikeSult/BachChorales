// MusicAnalysis.js
//
// This module uses lilyPondAdapter.js
//
// lilyNoteCode to be analyzed:
//var NotesAndDurs = lpAdapter.translateLilyToToneJS(lilyNoteCode)
//var notes = NotesAndDurs[0].slice();
//var durations = NotesAndDurs[1].slice();
//var midiNums = tranlateNoteNamesToMIDI(notes);
//var phrase = [0,2,0,-1,0];
//var phrase_match_indices = SearchForPhrase(phrase, midiNums)
/*-------------------------------------------------------
This module is used with the BachChorales project

Many of the search functions use midi numbers for comparisons.

//-------------------------------------------------------*/
function translateNoteNamesToMIDI(ToneJSNoteArray) {
    var midiNums = [];
    var oneMIDINum = 0;
    ToneJSNoteArray.forEach( function(element, index) {
        oneMIDINum = noteNameToMIDI(element);
        midiNums.push(oneMIDINum);
    });
    return midiNums;
}

function translateNoteNamesToMIDIClass(ToneJSNoteArray) {
    var midiNums = [];
    var oneMIDINum = 0;
//    console.log('ToneJSNoteArray='+ToneJSNoteArray);
    var noteArray = ToneJSNoteArray.slice(0);
    noteArray.forEach( function(element, index) {
        oneMIDINum = noteNameToMIDI(element);
        while(oneMIDINum > 12 ) {
            oneMIDINum -= 12;
        }
        if( !midiNums.includes(oneMIDINum) ) {
            midiNums.push(oneMIDINum);
        }
    });
    return midiNums;
}

// returns an array of the note name from the array 
// and the index of the first highest note detected, 
// WHAT TO DO ON MULTIPLE HIGH NOTES? (another function? findHighNotes() )
function findHighNote(ToneJSNoteArray) {
    var highNote = 0;
    var foundIndex = 0;
    var noteInfo = [];
    var noteArray = ToneJSNoteArray.slice(0);
    noteArray.forEach( function(element, index) {
        oneMIDINum = noteNameToMIDI(element);
        if(highNote < oneMIDINum) {
            highNote = oneMIDINum;
            foundIndex = index;
        }
    });
    noteInfo.push(ToneJSNoteArray[foundIndex]);
    noteInfo.push(foundIndex);
    return noteInfo;
}


function findHighNotes(ToneJSNoteArray) {
    var highNote = 0;
    var foundIndices = [];
    var noteInfo = [];
    var noteArray = ToneJSNoteArray.slice(0);
    noteArray.forEach( function(element, index) {
        oneMIDINum = noteNameToMIDI(element);
        if(highNote < oneMIDINum) {
            highNote = oneMIDINum;
            if(foundIndices) {
                foundIndices = [];
            }
            foundIndices.push(index);
        } else if(highNote == oneMIDINum) {
            foundIndices.push(index);            
        }
    });
    noteInfo.push(ToneJSNoteArray[foundIndices[0]]);
    noteInfo.push(foundIndices);
//    console.log('highNoteInfo='+noteInfo);
    return noteInfo;
}


function findLowNotes(ToneJSNoteArray) {
    var lowNote = 127;
    var foundIndices = [];
    var noteInfo = [];
    var oneMIDINum;
    var noteArray = ToneJSNoteArray.slice(0);
    noteArray.forEach( function(element, index) {
        oneMIDINum = noteNameToMIDI(element);
        if(lowNote > oneMIDINum) {
            lowNote = oneMIDINum;
            if(foundIndices) {
                foundIndices = [];
            }
            foundIndices.push(index);
        } else if(lowNote == oneMIDINum) {
            foundIndices.push(index);            
        }
    });
    noteInfo.push(ToneJSNoteArray[foundIndices[0]]);
    noteInfo.push(foundIndices);
//    console.log('lowNoteInfo='+noteInfo);
    return noteInfo;
}

function findWidestMelodicInterval(ToneJSNoteArray) {
    var wideInterval = 0;
    var foundIndices = [];
    var intervalInfo = [];
    var oneInterval;
    var firstNote = true;
    var noteArray = ToneJSNoteArray.slice(0);
    var len = noteArray.length;
    for(let i=1; i<len; i++) {
        oneInterval = Math.abs(noteNameToMIDI(noteArray[i]) - noteNameToMIDI(noteArray[i-1]));
        if(wideInterval < oneInterval) {
            wideInterval = oneInterval;
            if(foundIndices) {
                foundIndices = [];
            }
            foundIndices.push(i-1);
        } else if(wideInterval == oneInterval) {
            foundIndices.push(i-1);            
        }
    }
    intervalInfo.push(wideInterval);
    intervalInfo.push(foundIndices);
//    console.log('Array.isArray(foundIndices)='+Array.isArray(foundIndices)+' intervalInfo='+intervalInfo);
//    console.log('Array.isArray(intervalInfo[1])='+Array.isArray(intervalInfo[1]))
    return intervalInfo;
}

function findMostCommonPhrase(ToneJSNoteArray, phraseLength) {
    var noteArray = ToneJSNoteArray.slice(0);
    var len = noteArray.length;
    var testPhrases = [];
    var onePhrase = [];
    var oneIndexArray = []
    var offset = 0;
    var alreadyAdded = false;
    var temp = [];

    // loop through ToneJSNoteArray and create an array of each 
    // phraseLength long set of notes in a numeric form (using 0 for 
    // note one and positive or negative integers to indicate half step distance 
    // from that note.) and paired with an array of the indices from array
    // ToneJSNoteArray that the phrase is located.

    for(let i=phraseLength; i<len; i++) {
        offset = noteNameToMIDI(noteArray[i-phraseLength]);
        onePhrase = [];
        for(let j=phraseLength; j>0; j--) {
            onePhrase.push( noteNameToMIDI(noteArray[i-j])-offset );
        }
        // check to see if this phrase is already in testPhrases
        alreadyAdded = includesArray(testPhrases, onePhrase);
        // if so, update found index array
        if(alreadyAdded) {
            temp = [];
            temp = testPhrases[foundArrayIndex+1]; // foundArrayIndex is global set inside of includesArray()
			temp.push(i-phraseLength);
			testPhrases[foundArrayIndex+1] = temp;
//			console.log('alreadyAdded, temp='+temp+' onePhrase='+onePhrase);
//			console.log('testPhrases[foundArrayIndex]='+testPhrases[foundArrayIndex]+' testPhrases[foundArrayIndex+1]='+testPhrases[foundArrayIndex+1])
        
        } else {
        // else add to testPhrases and start found index array
            testPhrases.push(onePhrase);
            oneIndexArray = [];
            oneIndexArray.push(i-phraseLength);
            testPhrases.push(oneIndexArray);
//            console.log('new addition, onePhrase='+onePhrase);
        }
    }
    var highCount = 0
    var highIndices = [];
    var highPhrases = [];
    var mostCommon = [];
    var thisCount = 0;
    var element;
    var phrasesLength = testPhrases.length;
    for(let index = 0; index< phrasesLength; index++) {
         if( index % 2 == 1 ) {
             element = testPhrases[index];
//             console.log(element);
             thisCount = element.length;
             if(thisCount > highCount) {
                 highIndices = [];
                 highPhrases = [];
                 highIndices.push(element);
                 highPhrases.push(testPhrases[index-1]);
                 highCount = thisCount;
             } else if(thisCount == highCount) {
                 highIndices.push(element)
                 highPhrases.push(testPhrases[index-1]);
             }
         }
    }
    mostCommon.push(highPhrases, highIndices);
//    console.log('mostCommon='+mostCommon);
    return mostCommon;
}

var foundArrayIndex;
// this function sets the global var 'foundArrayIndex' when it returns true
function includesArray(arrayOfArrays, array) {
    const len = arrayOfArrays.length;
    var doesInclude = false;
    for(let i=0; i<len; i++) {
        doesInclude = arraysEqual(arrayOfArrays[i], array)
        if(doesInclude) {
            foundArrayIndex = i;
            return true;   
        }
    }
    return false;
}


// melody is in midi number format
// phrase is a interval formula in half steps with the first note labeled '0'
// [0,2,0,-1,0] in C: c d c b c, in A: a b a g# a 
function SearchForPhrase( phrase, melody, chorale_index ) {
    var len = melody.length;
    var len_phrase = phrase.length;
//    len = len - len_phrase;
    var found_phrase_locations = [];
    var one_record = [];
    var test_phrase = [];
    var offset = 0;
    var found_it = false;
    for(var i = 0; i<len; i++) {
        offset = melody[i];
        test_phrase = [];
        found_it = true;
        // check at every note for a melodic sequence == 'phrase'
        for(var j = 0; j<len_phrase; j++) {
            test_phrase.push(melody[i+j]-offset);
            if( (melody[i+j]-offset) != phrase[j] ){
                found_it = false;
            }
        }
        if(found_it) {
            one_record = [];
            if(chorale_index != undefined) {
                one_record.push('Chorale no.'+(chorale_index+1));
//                console.log('Chorale no.'+(chorale_index+1) );
            } else {
                one_record.push('');
            }
//            console.log('phrase found at index '+ i+' j='+j+' offset='+offset);
//            console.log('test_phrase='+test_phrase+' i='+i+' j='+j+' offset='+offset);
            // save the index numbers of any found matches
            one_record.push(i);
            found_phrase_locations.push(one_record);
        }
    }

    // using the lilypond array highlight the score in red for any found matches.

    return found_phrase_locations;
}


function SearchForRhythm( rhythm, melodyRhythm, chorale_index ) {
    var len = melodyRhythm.length;
    var len_rhythm = rhythm.length;
//    len = len - len_rhythm;
    var found_rhythm_locations = [];
    var one_record = [];
    var test_rhythm = [];
    var found_it = false;
    for(var i = 0; i<len; i++) {
        test_rhythm = [];
        found_it = true;
        // check at every note for a rhythm sequence == 'rhythm'
        for(var j = 0; j<len_rhythm; j++) {
            test_rhythm.push(melodyRhythm[i+j]);
            if( (melodyRhythm[i+j]) != rhythm[j] ){
                found_it = false;
            }
        }
        if(found_it) {
            one_record = [];
            if(chorale_index != undefined) {
                one_record.push('Chorale no.'+(chorale_index+1));
//                console.log('Chorale no.'+(chorale_index+1) );
            } else {
                one_record.push('');
            }
//            console.log('phrase found at index '+ i+' j='+j+' offset='+offset);
//            console.log('test_phrase='+test_phrase+' i='+i+' j='+j+' offset='+offset);
            // save the index numbers of any found matches
            one_record.push(i);
            found_rhythm_locations.push(one_record);
        }
    }

    // using the lilypond array highlight the score in red for any found matches.

    return found_rhythm_locations;
}


/*-----------------------------------------------------------------
function SearchAllVoicesForPhrase(phrase, multivoiceMelody) {

}
//-------------------------------------------*/

function createSearchPhraseArray(searchIntervalsString) {
    var stringArray = searchIntervalsString.split(' ');
    var numberArray = [];
    var len = stringArray.length;
    for(var i = 0; i<len; i++) {
        numberArray.push( Number(stringArray[i]) );
    }
    return numberArray;
}


function SearchAllChorales(phrase, whichVoice) {
//    var search_phrase = [0,0,7,4,2,0,0,2,4,2];
//    var search_phrase = [0,5,7,9];
//    var search_phrase = [0,2,4,2];
//    var index = getChoraleIndex();
    var oneChorale, lilyNoteCode, NotesAndDurs; 
    var notes, durations, midiNums, phrase_match_indices;
    var rhythm_match_indices;
    var report = [];

// search entire collection
    BachChorales.forEach( (element, index) => {
        phrase_match_indices = [];
        if(whichVoice == 'soprano') {
		    lilyNoteCode = element.soprano;
		} else if(whichVoice == 'alto') {
		    lilyNoteCode = element.alto;
		} else if(whichVoice == 'tenor') {
		    lilyNoteCode = element.tenor;
		} else if(whichVoice == 'bass') {
		    lilyNoteCode = element.bass;
		} else {
		    lilyNoteCode = element.soprano;
		} 		
		
		NotesAndDurs = lpAdapter.translateLilyToToneJS(lilyNoteCode)
		notes = NotesAndDurs[0].slice();
		durations = NotesAndDurs[1].slice();

		midiNums = translateNoteNamesToMIDI(notes);
		phrase_match_indices = SearchForPhrase(phrase, midiNums, index);
		if( phrase_match_indices.length > 0 ) {
		    report.push(phrase_match_indices);
//		    console.log('doPhraseSearch() midiNums='+midiNums+' phrase_match_indices='+phrase_match_indices);
		}
	});
	
	return report;
}

function SearchAllChoralesRhythm(searchRhythm, whichVoice) {
    var oneChorale, lilyNoteCode, NotesAndDurs; 
    var notes, durations, melodyRhythmNumbers;
    var rhythm_match_indices;
    var report = [];

// search entire collection
    BachChorales.forEach( (element, index) => {
        phrase_match_indices = [];
        if(whichVoice == 'soprano') {
		    lilyNoteCode = element.soprano;
		} else if(whichVoice == 'alto') {
		    lilyNoteCode = element.alto;
		} else if(whichVoice == 'tenor') {
		    lilyNoteCode = element.tenor;
		} else if(whichVoice == 'bass') {
		    lilyNoteCode = element.bass;
		} else {
		    lilyNoteCode = element.soprano;
		} 		
		
		NotesAndDurs = lpAdapter.translateLilyToToneJS(lilyNoteCode)
		notes = NotesAndDurs[0].slice();
		durations = NotesAndDurs[1].slice();
//		console.log('SearchAllChoralesRhythm: durations='+durations);

		melodyRhythmNumbers = translateToneJSDursToNumberArray(durations);
		rhythm_match_indices = SearchForRhythm(searchRhythm, melodyRhythmNumbers, index);
		if( rhythm_match_indices.length > 0 ) {
		    report.push(rhythm_match_indices);
//		    console.log('SearchAllChoralesRhythm() melodyRhythmNumbers='+melodyRhythmNumbers+' rhythm_match_indices='+rhythm_match_indices);
		}
	});
	
	return report;
}


function ShowPhraseSearchResults() {
    var report = SearchAllChorales();
}

// BachChorales
// meta: "\\title Chorale no.2 \\key a \\major \\time 4/4 \\partial 4",
// meta: "\\opus Chorale no.55 \\composer J.S. Bach \\title Wir Christenleut. \\key a ..."
function getMetaOpus(dataString) {
    var pos1 = dataString.indexOf("\\opus");
    var pos2 = dataString.indexOf("\\composer");
    if(pos1 < 0 || pos2 < 0)
        return '';
    return dataString.slice(pos1+6, pos2);
}

function getMetaComposer(dataString) {
    var pos1 = dataString.indexOf("\\composer");
    var pos2 = dataString.indexOf("\\title");
    if(pos1 < 0 || pos2 < 0)
        return '';
    return dataString.slice(pos1+9, pos2);
}
function getMetaTitle(dataString) {
    var pos1 = dataString.indexOf("\\title");
    var pos2 = dataString.indexOf("\\key");
    if(pos1 < 0 || pos2 < 0)
        return '';
    return dataString.slice(pos1+7, pos2);
}

function getMetaKey(dataString) {
    var pos1 = dataString.indexOf("\\key");
    var pos2 = dataString.indexOf("\\time");
    if(pos1 < 0 || pos2 < 0)
        return '';
    return dataString.slice(pos1+5, pos2);
}

function getMetaTimeSignature(dataString) {
    var pos1 = dataString.indexOf("\\time");
    var pos2 = dataString.indexOf("\\partial");
    if(pos2 < 0) {
        return dataString.slice(pos1+6);
    } else {
        return dataString.slice(pos1+6, pos2);
    }
}

function getMetaPickup(dataString) {
    var pos1 = dataString.indexOf("\\partial");
    if(pos1 > 0) {
        return dataString.slice(pos1);
    } else {
        return '';
    }
}


// assuming 24 ticks per quarter note. the parameter of ('\partial 4', '3/4')
// should result in 24 and ('','3/4') should result in 0
function getPickupNumGrids(pickup, gridWidth) {
//    return partialNotaionToTicks[pickup]/gridWidth;  
    var numTicks = partialNotationToTicks[pickup];
    var numGrids = numTicks/gridWidth;
//    console.log('pickup='+pickup+' numTicks='+numTicks+' numGrids='+numGrids);
    return numGrids;
}

var partialNotationToTicks = {
    '': 0,
    '\\partial 4': 24, 
    '\\partial 2': 48
}
var timeSigToTicks = {
    '3/4': 72,
    '4/4': 96,
    '3/2': 144
}

/*---------------------------------
function partialNotationToTicks(partialNotation) {
    var ticks = 0;
    if(partialNotation == '') {
        ticks = 0;
    } else if(partialNotation == '\\partial 4') {
        ticks = 24;
    } else if(partialNotation == '\\partial 2') {
        ticks = 48;
    }
    return ticks;
}
//------------------------------*/

function getChoraleIndex() {
	var title = document.getElementById("BachChorales").value;
	var titleArray = title.split('no.');
	var indexString = titleArray[1];
	return Number(indexString)-1;
}

function translateLilyPhraseToIntervalArray(lilyCode) {
	var NotesAndDurs = lpAdapter.translateLilyToToneJS(lilyCode)
	var notes = NotesAndDurs[0].slice();
	var durations = NotesAndDurs[1].slice();
	var midiNums = translateNoteNamesToMIDI(notes);
	var offset = midiNums[0];
	var intervalArray = [];
	midiNums.forEach(element => {
        intervalArray.push(element-offset);	
	});
	return intervalArray;
}


function translateLilyRhythmsToNumberArray(lilyCode) {
	var NotesAndDurs = lpAdapter.translateLilyToToneJS(lilyCode)
	var notes = NotesAndDurs[0].slice();
	var durations = NotesAndDurs[1].slice();
	var rhythmNumbers = translateToneJSDursToNumberArray(durations);
	return rhythmNumbers;
}


function filterByKeySignature(keySig, arrayToSearch) {
    var results = [];
    var extractedKey = ''
    arrayToSearch.forEach(element => {
        extractedKey = getMetaKey(element.meta);
        if( extractedKey.includes(keySig) ) {
//            console.log('keySig='+keySig+'\nextractedKey='+extractedKey);
//            console.log('keySig.length='+keySig.length+'\nextractedKey.length='+extractedKey.length);
            results.push(element);
        }
    });
    return results;
}

function filterByPickup(pickup, arrayToSearch) {
    var results = [];
    var extractedPickup = '';
    arrayToSearch.forEach(element => {
        extractedPickup = getMetaPickup(element.meta);
        if( extractedPickup == pickup ) {
            results.push(element);
        }
    });
    return results;
}

function filterByTimeSignature(timeSig, arrayToSearch) {
    var results = [];
    var extractedTimeSig = ''
    arrayToSearch.forEach(element => {
        extractedTimeSig = getMetaTimeSignature(element.meta);
        if( extractedTimeSig.includes(timeSig) ) {
//            console.log('timeSig='+timeSig+'\nextractedTimeSig='+extractedTimeSig);
//            console.log('timeSig.length='+timeSig.length+'\nextractedTimeSig.length='+extractedTimeSig.length);
            results.push(element);
        }
    });
    return results;
}

function SearchForKeySignature(keySig, arrayToSearch) {
    var results = [];
    var extractedKey = ''
    var title;
    arrayToSearch.forEach(element => {
        extractedKey = getMetaKey(element.meta);
        if( extractedKey.includes(keySig) ) {
//            console.log('keySig='+keySig+'\nextractedKey='+extractedKey);
//            console.log('keySig.length='+keySig.length+'\nextractedKey.length='+extractedKey.length);
            title = getMetaOpus(element.meta);
            if(title) {
                results.push(title);
            } else {
                results.push(getMetaTitle(element.meta));
            }
            title = '';
        }
    });
    return results;
}

function SearchForPickup(pickup, arrayToSearch) {
    var results = [];
    var extractedPickup = '';
    arrayToSearch.forEach(element => {
        extractedPickup = getMetaPickup(element.meta);
        if( extractedPickup == pickup ) {
//            results.push(getMetaTitle(element.meta));

            title = getMetaOpus(element.meta);
            if(title) {
                results.push(title);
            } else {
                results.push(getMetaTitle(element.meta));
            }
            title = '';
        }
    });
    return results;
}

function SearchForTimeSignature(timeSig, arrayToSearch) {
    var results = [];
    var extractedTimeSig = ''
    arrayToSearch.forEach(element => {
        extractedTimeSig = getMetaTimeSignature(element.meta);
        if( extractedTimeSig.includes(timeSig) ) {
//            results.push(getMetaTitle(element.meta));

            title = getMetaOpus(element.meta);
            if(title) {
                results.push(title);
            } else {
                results.push(getMetaTitle(element.meta));
            }
            title = '';
        }
    });
    return results;
}

function ShowSearchResults(whichSearch, data) {
    var tagID = 'SearchResults';
    var content = '';
    var html = '<p><b>Search Results:</b><br>';
    if(whichSearch == 'keySig') {
        html += " keySig: <b>"+ data + "</b><br>";
        content = SearchForKeySignature(data, BachChorales);
        content.forEach( element => {
            html += " " + element + ",";
        });
    } else if(whichSearch == 'timeSig') {
        html += " timeSig: <b>"+ data + "</b><br>";
        content = SearchForTimeSignature(data, BachChorales);
        content.forEach( element => {
            html += " " + element + ",";
        });
    } else if(whichSearch == 'pickup') {
        html += " pickup: <b>";
        if(data) {
            html += data;        
        } else {
            html += ' none';
        }
        html += "</b><br>";
        content = SearchForPickup(data, BachChorales);
        content.forEach( element => {
            html += " " + element + ",";
        });
    }
    html += "</p>";
    document.getElementById(tagID).innerHTML = html;
}

// whichSearch 000 100 010 001 110 101 011 111
function ShowMultiSearchResults(whichSearch, data) {
    var tagID = 'SearchResults';
    var content = '';
    var titleArray;
    var indexString, foundIndex;
    var keySig = data[0];
    var timeSig = data[1];
    var pickup = data[2];
    var html = '<p><b>Search Results:</b><br>';
    switch (whichSearch) {
        case '000': // no search            
            break;
        case '100': // keySig only
            html += " keySig: <b>"+ keySig + "</b><br>";
            content = SearchForKeySignature(keySig, BachChorales);
            content.forEach( element => {
//                html += " " + element + ",";       
				titleArray = element.split('no.');
				indexString = titleArray[1];
				foundIndex = Number(indexString)-1;
                element.split('no.');
                html += ' <a href="javascript:makeShortChoraleMenu('+foundIndex+','+foundIndex+')">'+element+'</a> &nbsp;&nbsp;';
            });
            break;
        case '010': // timeSig only
			html += " timeSig: <b>"+ timeSig + "</b><br>";
			content = SearchForTimeSignature(timeSig, BachChorales);
			content.forEach( element => {
//				html += " " + element + ",";
				titleArray = element.split('no.');
				indexString = titleArray[1];
				foundIndex = Number(indexString)-1;
                element.split('no.');
                html += ' <a href="javascript:makeShortChoraleMenu('+foundIndex+','+foundIndex+')">'+element+'</a> &nbsp;&nbsp;';
			});
            break;
        case '001': // pickup only
			html += " pickup: <b>";
			if(pickup) {
				html += pickup;        
			} else {
				html += ' none';
			}
			html += "</b><br>";
			content = SearchForPickup(pickup, BachChorales);
			content.forEach( element => {
//				html += " " + element + ",";
				titleArray = element.split('no.');
				indexString = titleArray[1];
				foundIndex = Number(indexString)-1;
                element.split('no.');
                html += ' <a href="javascript:makeShortChoraleMenu('+foundIndex+','+foundIndex+')">'+element+'</a> &nbsp;&nbsp;';
			});
            break;

        case '110': // keySig and timeSig
			html += " keySig: <b>"+ keySig + "</b> : ";
			html += " timeSig: <b>"+ timeSig + "</b><br>";
            var keySigGroup = filterByKeySignature(keySig, BachChorales);
            var content = SearchForTimeSignature(timeSig, keySigGroup);
            content.forEach( element => {
//				html += " " + element + ",";
				titleArray = element.split('no.');
				indexString = titleArray[1];
				foundIndex = Number(indexString)-1;
                element.split('no.');
                html += ' <a href="javascript:makeShortChoraleMenu('+foundIndex+','+foundIndex+')">'+element+'</a> &nbsp;&nbsp;';
			});
            break;

        case '101': // keySig and pickup
			html += " keySig: <b>"+ keySig + "</b> : ";
			html += " pickup: <b>"+ pickup + "</b><br>";
            var keySigGroup = filterByKeySignature(keySig, BachChorales);
            var content = SearchForPickup(pickup, keySigGroup);
            content.forEach( element => {
//				html += " " + element + ",";
				titleArray = element.split('no.');
				indexString = titleArray[1];
				foundIndex = Number(indexString)-1;
                element.split('no.');
                html += ' <a href="javascript:makeShortChoraleMenu('+foundIndex+','+foundIndex+')">'+element+'</a> &nbsp;&nbsp;';
			});
            break;

        case '011': // timeSig and pickup
			html += " timeSig: <b>"+ timeSig + "</b> : ";
			html += " pickup: <b>"+ pickup + "</b><br>";
            var timeSigGroup = filterByTimeSignature(timeSig, BachChorales);
            var content = SearchForPickup(pickup, timeSigGroup);
            content.forEach( element => {
//				html += " " + element + ",";
				titleArray = element.split('no.');
				indexString = titleArray[1];
				foundIndex = Number(indexString)-1;
                element.split('no.');
                html += ' <a href="javascript:makeShortChoraleMenu('+foundIndex+','+foundIndex+')">'+element+'</a> &nbsp;&nbsp;';
			});
            break;

        case '111': // keySig and timeSig and pickup
			html += " keySig: <b>"+ keySig + "</b> : ";
			html += " timeSig: <b>"+ timeSig + "</b> : ";
			html += " pickup: <b>"+ pickup + "</b><br>";
            var keySigGroup = filterByKeySignature(keySig, BachChorales);
            var timeSigGroup = filterByTimeSignature(timeSig, keySigGroup);
            var content = SearchForPickup(pickup, timeSigGroup);
            content.forEach( element => {
//				html += " " + element + ",";
				titleArray = element.split('no.');
				indexString = titleArray[1];
				foundIndex = Number(indexString)-1;
                element.split('no.');
                html += ' <a href="javascript:makeShortChoraleMenu('+foundIndex+','+foundIndex+')">'+element+'</a> &nbsp;&nbsp;';
			});
            break;
    }

//    if(html == '<p><b>Search Results:</b><br>') { 
    if(!content) { 
        content = "<b>no results to this search.</b>"; 
    }
    document.getElementById(tagID).innerHTML = html + "</p>";
}

//------------------------------------------------
//    basic tools for harmonic analysis
//-------------------------------------------------
// analyze the melody for each gridValue duration and determine the pitch at that time
// to create a pitchArray where each array value is the pitch at a regular interval of time.
// Then multiple pitchGridArrays could be compared against each other 
// using the same index for harmonic analysis.

// NOTE: see Rhythm.js / function processDurationNotation(duration_array, startTime) for ideas

var defaultGridValue = 12 // NOTE: 12 == '8n', 24 == '4n'
function MelodyToPitchGrid(melody, gridWidth) {
    // what is the format of melody? lilypond I think, so use lilyPondAdapter.js to translate.
    // then extract two arrays of pitches and durations
    var NotesAndDurs = lpAdapter.translateLilyToToneJS(melody)
    var notes = NotesAndDurs[0].slice();
    var durs = NotesAndDurs[1].slice();
//    console.log('notes='+notes);
//    console.log('durs='+durs);
    var melodyDurs = translateToneJSDursToNumberArray(durs);
//    console.log('melodyDurs='+melodyDurs);
    var thisGridWidth = gridWidth? gridWidth: defaultGridValue;
    
    var pitchGrid = [];
    var numberOfGrids = 0;
    var i  = 0;
    // make pitchGrid by going thru the melody and creating
    // as many pitch grids of long duration notes as needed.
    var restOffset = 0;
    melodyDurs.forEach((element, index) => {
        // do the math to calc how many pitchGrids to make for each element.
//        numberOfGrids = element/thisGridWidth;
        numberOfGrids = Math.abs(element)/thisGridWidth;
        if(element < 0) {
            restOffset = restOffset+1;
        }
        for(i=0; i<numberOfGrids; i++) {
            if(element < 0) {
                pitchGrid.push('rest');
            } else {
                pitchGrid.push(notes[index-restOffset]);
            }
        }
    });
//    console.log('pitchGrid='+pitchGrid);
    return pitchGrid;
}

// NOTE: also defined in Rhythm.js
var rhythmTextToNumbers = {
	"1n" : 96, 
	"d2n" : 72, "2n" : 48, "2t" : 32,
	"d4n" : 36, "4n" : 24, "4t" :  16,
	"d8n" : 18, "8n" : 12, "8t" : 8,
	"d16n" : 9, "16n" : 6, "16t" : 4,

	"1r" : -96, 
	"d2r" : -72, "2r" : -48, "2tr" : -32,
 	"d4r" : -36, "4r" : -24, "4tr" :  -16,
	"d8r" : -18, "8r" : -12, "8tr" : -8,
	"d16r" : -9, "16r" : -6, "16tr" : -4
};


// from lilyPondAdapter.js
/*----------------------------
    var lilyDurationToToneJSDuration = {
//        "1n+2n": "1.",
	    "1" : "1n", 
        "2.": "2n + 4n", "2..": "2n + 4n + 8n",
	    "2" : "2n", // "2t" : "2",
        "4.": "4n + 8n", "4..": "4n + 8n + 16n",
	    "4" : "4n", // "4t" :  "4",
        "8.": "8n + 16n", "8": "8n", // "8t" : "8",
	    "16.": "16n + 32n", "16": "16n", // "16t" : "16",
	    "32.": "32n + 64n", "32": "32n",
	    "64.": "64n + 128n", "64": "64n",

// tied notes ---------------------
        "1~2.": "1n + 2n + 4n", "1~2": "1n + 2n", "1~4" : "1n + 4n",
        "1~4.": "1n + 4n + 8n", "1~8": "1n + 8n", "1~1": "2*1n",
        "1~8.": "1n + 8n + 16n", 
        "2~1": "1n + 2n", "2~1~1~1": "2n + 1n + 1n + 1n",
        "2.~8": "2n + 4n + 8n", "2~2": "2n + 2n", "2.~2.": "2n + 4n + 2n + 4n", 
        "2.~4": "2n + 4n + 4n", "2.~2": "2n + 4n + 2n", "2.~1": "2n + 4n + 1n", "2~2.": "2n + 2n + 4n", 
        "2~4": "2n + 4n", "2~8": "2n + 8n", "2~1": "2n + 1n",
        "4.~2": "4n + 8n + 2n", "4.~4": "4n + 8n + 4n", "4.~8": "4n + 8n + 8n",
        "4~2.": "4n + 2n+ 4n", "4~2": "4n + 2n", "4~16": "4n + 16n", "4~4.": "4n + 4n + 8n",
        "4~4": "4n + 4n", "8~8": "8n + 8n", "4~1": "4n + 1n",
        "8~2.": "8n + 2n + 4n", "8~8": "8n + 8n", "8~4.": "8n + 4n + 8n", "8~4": "8n + 4n",
        "8~1": "8n + 1n", "8~2": "8n + 2n", "8~1.": "8n + 1n + 2n", "8~16": "8n + 16n",
        "4~8": "4n + 8n", "4~8.": "4n + 8n + 16n", "16~4": "16n + 4n", "16~2": "16n + 2n",
        "16~2.": "16n + 2n + 4n",  "16~1": "16n + 1n", "16~4.": "16n + 2n + 8n",
        "16~8": "16n + 8n","16~8~4":"16n + 8n + 4n", "16~16": "16n + 16n", 
//---------------------------------

// rests
	"r1" : "1nr", 
	"r2." : "2nr + 4nr", "r2" : "2nr", // "2tr" : "r2",
	"r4." : "4nr + 8nr", "r4" : "4nr", // "4tr" :  "r4",
	"r8." : "8nr + 16nr", "r8" : "8nr", // "8tr" : "r8",
	"r16." : "d16nr", "r16" : "16nr" // "16tr" : "r16",

/* rest - different format
	"1r" : "r1", 
	"2r + 4r" : "r2.",
	"d2r" : "r2.", "2r" : "r2", "2tr" : "r2",
	"4r + 8r" : "r4.",
	"d4r" : "r4.", "4r" : "r4", "4tr" :  "r4",
	"8r + 16r" : "r8.",
	"d8r" : "r8.", "8r" : "r8", "8tr" : "r8",
	"d16r" : "r16.", "16r" : "r16", "16tr" : "r16"
*/
//    };
//----------------------------*/

    var toneJSDurationToNumber = {
//        "1n+2n": "1.", 1= 96, 2=48, 4=24, 8=12, 16=6, 32=3 64=1.5 128=0.75
	    "1n": 96, 
        "2n + 4n": 72,
        "2n + 4n + 8n": 84,
	    "2n": 48, // "2t" : "2",
        "4n + 8n": 36,
        "4n + 8n + 16n": 42,
	    "4n": 24, // "4t" :  "4",
        "8n + 16n": 18,
        "8n": 12, // "8t" : "8",
	    "16n + 32n": 9,
	    "16n": 6, // "16t" : "16",
	    "32n + 64n": 7.5,
	    "32n": 3,
	    "64n + 128n": 2.25,
	    "64n": 1.5,

// tied notes ---------------------
        "1n + 2n + 4n": 168,
        "1n + 2n": 144,
        "1n + 4n": 120,
        "1n + 4n + 8n": 132,
        "1n + 8n": 108,
        "2*1n": 192,
        "1n + 8n + 16n": 114, 
        "2n + 1n": 144,
        "2n + 1n + 1n + 1n": 336,
        "2n + 4n + 8n": 84,
        "2n + 2n": 96,
        "2n + 4n + 2n + 4n": 144, 
        "2n + 4n + 4n": 96,
        "2n + 4n + 2n": 120,
        "2n + 4n + 1n": 168,
        "2n + 2n + 4n": 120, 
        "2n + 4n": 72,
        "2n + 8n": 60,
        "2n + 1n": 144,
        "4n + 8n + 2n": 84,
        "4n + 8n + 4n": 60,
        "4n + 8n + 8n": 48,
        "4n + 2n + 4n": 96,
        "4n + 2n": 72,
        "4n + 16n": 30,
        "4n + 4n + 8n": 60,
        "4n + 4n": 48,
        "4n + 1n": 120,
        "8n + 2n + 4n": 84,
        "8n + 8n": 24,
        "8n + 4n + 8n": 48,
        "8n + 4n": 36,
        "8n + 1n": 108,
        "8n + 2n": 60,
        "8n + 1n + 2n": 156,
        "8n + 16n": 18,
        "4n + 8n": 36,
        "4n + 8n + 16n": 42,
        "16n + 4n": 30,
        "16n + 2n": 54,
        "16n + 2n + 4n": 88,
        "16n + 1n": 102,
        "16n + 2n + 8n": 66,
        "16n + 8n": 18,
        "16n + 8n + 4n": 42,
        "16n + 16n": 12, 
//---------------------------------

// rests
	"1nr": -96, 
	"2nr + 4nr": -72,
	"2nr": -48, // "2tr" : "r2",
	"4nr + 8nr": -36,
	"4nr": -24, // "4tr" :  "r4",
	"8nr + 16nr": -18,
	"8nr": -12, // "8tr" : "r8",
	"d16nr": -9,
	"16nr": -6 // "16tr" : "r16",

/* rest - different format
	"1r" : "r1", 
	"2r + 4r" : "r2.",
	"d2r" : "r2.", "2r" : "r2", "2tr" : "r2",
	"4r + 8r" : "r4.",
	"d4r" : "r4.", "4r" : "r4", "4tr" :  "r4",
	"8r + 16r" : "r8.",
	"d8r" : "r8.", "8r" : "r8", "8tr" : "r8",
	"d16r" : "r16.", "16r" : "r16", "16tr" : "r16"
*/
    };

var pitchToLilyPitch  = { 
    'C': 'c', 'C#': 'cis', 'Cb': 'ces', 'Cx': 'cisis',
    'D': 'd', 'D#': 'dis', 'Db': 'des', 'Dx': 'disis',
    'E': 'e', 'E#': 'eis', 'Eb': 'ees', 'Ex': 'eisis',
    'F': 'f', 'F#': 'fis', 'Fb': 'fes', 'Fx': 'fisis',
    'G': 'g', 'G#': 'gis', 'Gb': 'ges', 'Gx': 'gisis',
    'A': 'a', 'A#': 'ais', 'Ab': 'aes', 'Ax': 'aisis',
    'B': 'b', 'B#': 'bis', 'Bb': 'bes', 'Bx': 'bisis'
};


// see https://lilypond.org/doc/v2.24/Documentation/notation/common-chord-modifiers
var chordNameToLilyChordName = {
    'maj': '', '': '', 'm': 'm', 'dim': 'dim', 'aug': 'aug',
    '7': '7', 'ma7': 'maj7', 'm7': 'm7', 'm7b5': 'm7.5-',
    'o7': 'dim7', 'aug7': 'aug7', 'sus4': 'sus4', 'add9': 'sus2'
};


function translateToneJSDursToNumberArray(toneJSDurations) {
    var numberArray = [];
    toneJSDurations.forEach(element => {
        numberArray.push(toneJSDurationToNumber[element]);
    });
    return numberArray;
}

// translate the toneJS duration into numbers before calling this function
function findShortestDuration(melodyDurationsNums) {
    var shortestDuration = 1000;
    melodyDurationsNums.forEach(element => {
        // does this deal with rests? possibly a negative value?
        if(element > 0 && element < shortestDuration) {
            shortestDuration = element;
        }
    });
    return shortestDuration;
}

function getGridWidth(...multipleVoices) {
//    var thisGridWidth = defaultGridValue;
//    var gridWidth = defaultGridValue;
    var thisGridWidth = 96;
    var gridWidth;
    var NotesAndDurs = [];
    var notes = [];
    var durs = [];
    var melodyDurs = [];
    
    for(let voice of multipleVoices){ 
        NotesAndDurs = [];
        NotesAndDurs = lpAdapter.translateLilyToToneJS(voice)
        notes = NotesAndDurs[0].slice();
        durs = NotesAndDurs[1].slice();
//        console.log('durs='+durs);
        melodyDurs = translateToneJSDursToNumberArray(durs);
//        console.log('melodyDurs='+melodyDurs);
        // translate the toneJS duration into number before calling this function
        gridWidth = findShortestDuration(melodyDurs); 
        if(gridWidth < thisGridWidth) {
            thisGridWidth = gridWidth;
        }
    } 
    return thisGridWidth;
}

function getDurationNumberFromLilyNote(lilyNote) {
    var NoteAndDur = lpAdapter.translateLilyToToneJS(lilyNote)
    var note = NotesAndDur[0].slice();
    var dur = NotesAndDur[1].slice();
    var melodyDur = translateToneJSDursToNumberArray(dur);
    return rhythmTextToNumbers[melodyDur[0]];
}

function createChordGrid(melodyGrids) {
    var howManyGrids = melodyGrids.length;
    var len = melodyGrids[0].length;
    var oneChord = [];
    var chordGrid = [];
    for(let i = 0; i<len; i++) {
        for(let j=0; j<howManyGrids; j++) {
            oneChord.push(melodyGrids[j][i]);        
        }
        chordGrid.push(oneChord);
        oneChord = [];
    }
    return chordGrid;
}

function getHarmonyGridSize() {
    var gridSizeString = document.getElementById('harmonyGridSize').value;
    return parseInt(gridSizeString, 10);
}

// GLOBAL array of chord objects for detailed analysis
var chordContexts = [];
function doChoraleHarmonicAnalysis() {
//------------------ start prep of data ---------------------------
    var index = getChoraleIndex();
    var pickup = getMetaPickup(BachChorales[index].meta);
    var timeSig = getMetaTimeSignature(BachChorales[index].meta);
    var key = getMetaKey(BachChorales[index].meta);
    const lily_soprano = BachChorales[index].soprano;
    const lily_alto = BachChorales[index].alto;
    const lily_tenor = BachChorales[index].tenor;
    const lily_bass = BachChorales[index].bass;
    
    const gridWidth = getGridWidth(lily_soprano, lily_alto, lily_tenor, lily_bass);
//    console.log('gridWidth='+gridWidth);
    const sopranoMelodyGrid = MelodyToPitchGrid(lily_soprano, gridWidth);
    const altoMelodyGrid = MelodyToPitchGrid(lily_alto, gridWidth);
    const tenorMelodyGrid = MelodyToPitchGrid(lily_tenor, gridWidth);
    const bassMelodyGrid = MelodyToPitchGrid(lily_bass, gridWidth);
    
    var len = bassMelodyGrid.length;
    if(sopranoMelodyGrid.length != len || altoMelodyGrid.length != len || tenorMelodyGrid.length != len) {
        var msg = 'grid array length error: ';
        if(sopranoMelodyGrid.length > len) {
            msg += 'soprano longer than bass';
        } else if(sopranoMelodyGrid.length < len) {
            msg += 'soprano shorter than bass';        
        } else if(altoMelodyGrid.length > len) {
            msg += 'alto longer than bass';        
        } else if(altoMelodyGrid.length < len) {
            msg += 'alto shorter than bass';        
        } else if(tenorMelodyGrid.length > len) {
            msg += 'tenor longer than bass';        
        } else if(tenorMelodyGrid.length < len) {
            msg += 'tenor shorter than bass';        
        }
        alert(msg);
    }
    // compress the grid arrays into desired size
    // 24 = quarter note 12 = eighth note
    var harmonyGridSize = getHarmonyGridSize();
    const compressFactor = harmonyGridSize / gridWidth;
//    console.log('gridWidth='+gridWidth+' harmonyGridSize='+harmonyGridSize+' compressFactor='+compressFactor);
    const sopranoGrid = compressArray(sopranoMelodyGrid, compressFactor);
    const altoGrid = compressArray(altoMelodyGrid, compressFactor);
    const tenorGrid = compressArray(tenorMelodyGrid, compressFactor);
    const bassGrid = compressArray(bassMelodyGrid, compressFactor);
    
    var melodyGrids = [];
    melodyGrids.push(sopranoGrid);
    melodyGrids.push(altoGrid);
    melodyGrids.push(tenorGrid);
    melodyGrids.push(bassGrid);
    var chordGrid = createChordGrid(melodyGrids);
//    console.log('chordGrid='+chordGrid);

// chordGrid is an array of small arrays
// containing the simultaneous notes per quarter note (gridWidth)
// some of the chord array member may be subarrays of faster note values
//--------------------- end data prep ------------------------------

// --------------- begin analysis --------------------------------
    var root, name, bass, chordName, oldChordName;
    var objectIsCreated = false;
    var nameWithTags, oneMsg;
    var gridCounter = 0;
    var pickupCounter = 0;
//    var measureLength = 24;
    timeSig = timeSig.trim();
    var measureLength = timeSigToTicks[timeSig];
    var pickupLength = gridWidth * getPickupNumGrids(pickup, gridWidth);
    var sameChordTags = '';
    var chordProgression = [];

    // start lilypond code ---------------------------
    var rNumeralsLilyPond = 'romanNums = \\lyricmode {\n';
    var chordsLilyPond = 'harmonies = \\chordmode {\n  ';

    var chordNameLilyPond = '';
    var rNumLilyPond = '';
    var prevRNumLilyPond = '';
    var currRNumLilyPond = '';

    var msg = 'chordGrid='
    var newBarline = false;
    var chordObject;
    var thisChord;
    var figuredBass;
    var chordsLength = chordGrid.length;
    // check out each chord --------------------------
    chordGrid.forEach( (chord, index) => {
        rNumLilyPond = '';
        gridCounter += harmonyGridSize;
        pickupCounter += harmonyGridSize;
//        gridCounter += gridWidth;
//        pickupCounter += gridWidth;
        oneMsg = '\n\n' + chord;
        
//--------------------------------------------
        // new format will need each chord to be resolved into a single-level array
        // i.e. the subarray member needs to resolve to the single chord tone to 
        // work with the other notes of the chord 

        if(containsSubarraysOrObjects(chord) ) {
            chordObject = resolveMovingVoiceChord(chord);
            thisChord = chordObject.thisChord.slice();
//            console.log('sub: thisChord='+thisChord);
            // add to global array for later detailed analysis
            chordObject = addChordProperties(chordObject, index, chordsLength);
            chordContexts.push(chordObject);
            objectIsCreated = true;
        } else {
            thisChord = chord.slice();
            objectIsCreated = false;
//            console.log('thisChord='+thisChord);
            // create a oneChordContext object and add to chordContexts
            // makeOneChordContext(chord);
        }
//----------------------------------------------*/
        if(index==0){ console.log('thisChord='+thisChord); }
        root = getChordRoot(thisChord);
        name = getChordName(thisChord);
        bass = getBassNote(thisChord);
            
        oneMsg += '\nchord: ';

        chordNameLilyPond = pitchToLilyPitch[root];
        chordNameLilyPond += '4:';

        if(name == '(?)' || root.includes('r') ) {
            chordName = name;
            chordNameLilyPond = 's4';
            rNumLilyPond = "\\markup { "; // start an empty rNum lyric
            currRomanNum = "";
        } else {
            chordNameLilyPond += chordNameToLilyChordName[name];
            chordName = root + name;
            currRomanNum = calcRomanNumeral(key,root);
        }
        if(root != bass) {
            if(chordNameLilyPond != 's4' || !bass.includes('r') ){
                chordNameLilyPond += '/' + pitchToLilyPitch[bass];
            }
            if( !bass.includes('r')){
                chordName += '/' + bass;
            }
            figuredBass = makeFiguredBass(bass, name, root, chordName);
//            if(figuredBass){
//               rNumLilyPond += figuredBass;
//            }
        } else {
            figuredBass = makeFiguredBass(bass, name, root, chordName);
//            if(figuredBass){
//               rNumLilyPond += figuredBass;
//            }
        }

        if(!objectIsCreated) {
//            let aChordObject = new aChordContext(bass, name, root, chordName, thisChord);
            let aChordObject = makeAChordContext(bass, name, root, chordName, thisChord);
            aChordObject = addChordProperties(aChordObject, index, chordsLength);
            chordContexts.push(aChordObject);
        }

        //-------------------------------------------------
        if( (name == "" || name == "7") && !currRomanNum.includes('b') ){
            currRomanNum = currRomanNum.toUpperCase();

            // can't use '#' symbols in markup text with lilypond, 
            // must change them to ^ (# is part of scheme language)
            if(currRomanNum.includes("#")){
                console.log("currRomanNum="+currRomanNum);
                let adjustedRNum = currRomanNum.replace("#","^");
                currRNumLilyPond = adjustedRNum + ' ' + figuredBass;
            } else {
                currRNumLilyPond = currRomanNum + ' ' + figuredBass;
            }
//            console.log('name='+name + '\ncurrRomanNum='+currRomanNum);
        } else {
            // can't use '#' symbols in markup text with lilypond, 
            // must change them to ^ (# is part of scheme language)
            if(currRomanNum.includes("#")){
                console.log("currRomanNum="+currRomanNum);
                let adjustedRNum = currRomanNum.replace("#","^");
                currRNumLilyPond = adjustedRNum + ' ' + figuredBass;
            } else {
                currRNumLilyPond = currRomanNum + ' ' + figuredBass;
            }
        }
        if(prevRNumLilyPond == currRNumLilyPond){
            rNumLilyPond = "\\markup { "; // start an empty rNum lyric
        } else {
            rNumLilyPond = "\\markup { " + currRNumLilyPond;
        }
//        console.log('currRomanNum='+ currRomanNum + '\ncurrRNumLilyPond='+currRNumLilyPond);
        prevRNumLilyPond = currRNumLilyPond;
        //-------------------------------------------------    


        rNumLilyPond += " }4 "; // close out the lyric Roman Numeral

//        console.log('chordName='+chordName +'\n lilyChordname='+ chordNameLilyPond);
        
        oldChordName = chordName;
        nameWithTags = chordName + sameChordTags;

        // add the chord name and roman numeral to the string
        chordsLilyPond += chordNameLilyPond;
        rNumeralsLilyPond += rNumLilyPond;
        if(index+1 % 8 == 0){
            chordsLilyPond += '\n  ';  
            rNumeralsLilyPond += '\n ';  
        } else {
            chordsLilyPond += ' ';
            rNumeralsLilyPond += ' ';  
        }
        chordProgression.push(nameWithTags);
        msg += oneMsg + nameWithTags;
        sameChordTags = '';
        // console.log(chordName);
        if(pickup) {
//            console.log('pickupCounter='+pickupCounter+' pickupLength='+pickupLength);
            if(pickupCounter >= pickupLength) {
                chordProgression.push('|');
                newBarline = true;
                pickup = false; // was a string now a boolean, is that weird? (pickup == '\partial 4')         
            } else {
                newBarline = false;            
            }
            gridCounter = 0;
        }
        if(gridCounter >= measureLength) {
            chordProgression.push('|');
            newBarline = true;
            gridCounter = 0;
        } else {
            newBarline = false;
        }
    });
    // close out the lilypond code
    chordsLilyPond += '\n}\n';
    rNumeralsLilyPond += '\n}\n';

    console.log(chordContexts);  

    // does js do tuples??? collect the 4 return values
    var fourChordFormats = [];
    fourChordFormats.push(chordsLilyPond);
    fourChordFormats.push(rNumeralsLilyPond);
    fourChordFormats.push(chordProgression);
    fourChordFormats.push(chordGrid);
    return fourChordFormats;
}

function addChordProperties(aChordObject, index, chordsLength) {
    aChordObject.prevChord2 = index - 2;
    aChordObject.prevChord = index - 1;
    aChordObject.location = index;
    if(index < chordsLength-1){
        aChordObject.nextChord = index + 1;
    } else {
        aChordObject.nextChord = -1;
    }    
    if(index < chordsLength-2){
        aChordObject.nextChord2 = index + 2;
    } else {
        aChordObject.nextChord2 = -1;
    }
    return aChordObject;
}

function addChordObjectProperty(chordObjects, propertyName, propertyValue){
    chordObjects.forEach(function(item) {
        item[propertyName] = propertyValue;
    });
    return chordObjects;
}

function addSingleChordObjectProperty(chordObjects, propertyName, propertyValue, indexOfValue){
//    chordObjects[indexOfValue][propertyName] = propertyValue;
    chordObjects.forEach(function(item, index) {
        if(indexOfValue == index){
//            Object.defineProperty(item, propertyName, {
//                value: propertyValue,
//                writable: false
//              });
            item[propertyName] = propertyValue;
        }
//        else {
//            item[propertyName] = false;
//        }
    });
    return chordObjects;
}

function addOneChordObjectProperty(chordObjects, propertyName, propertyValue, indexOfValue){
//    let chordsLength = chordObjects.length;
    chordObjects.forEach(function(item, index) {
        if(indexOfValue == index){
            item[propertyName] = propertyValue;
        } else {
            item[propertyName] = false;
        }
    });
    return chordObjects;
}


function makeFiguredBass(bass, name, root, chordName){
    let figuredBass = '';

    // transpose root to C and transpose bass the same amount
    const alphaNotes = ["C","D","E","F","G","A","B","C","D","E","F","G","A","B"];
    const len = alphaNotes.length;
    let rootOffset = 0;
    let bassOffset = 0;
    for(let i=0; i<len; i++){
        if(root.includes(alphaNotes[i])){
            rootOffset = i;
            break;
        }
    }
    for(let i=rootOffset; i<(len-rootOffset); i++){
        if(bass.includes(alphaNotes[i])){
            bassOffset = i;
            break;
        }
    }

    if(name == "" || name == "m" || name == "dim" 
      || name == "aug" || name == "sus4" || name == "sus2"){
        // first inversion triads
        if( (bassOffset-rootOffset) == 2 ){
            figuredBass = '\\normal-size-super 6'; // 1st inversion
        }

        // second inversion triads
        if( (bassOffset-rootOffset) == 4 ){
            figuredBass = '\\normal-size-super 6 \\normal-size-sub 4'; // 2nd inversion
        }

    } else if(name == "7" || name == "m7" || name == "ma7" || name == "m7b5" || name == "o7"){
        // would this work? if(name.includes('7'))
        // root position Seventh chords
        if( (bassOffset-rootOffset) == 0 ){
            figuredBass = '\\normal-size-super 7'; // root position
        }
        // first inversion Seventh chords (6 5)
        if( (bassOffset-rootOffset) == 2 ){
            figuredBass = '\\normal-size-super 6 \\normal-size-sub 5'; // 1st inversion
        }

        // second inversion Seventh chords (4 3)
        if( (bassOffset-rootOffset) == 4 ){
            figuredBass = '\\normal-size-super 4 \\normal-size-sub 3'; // 2nd inversion
        }

        // third inversion Seventh chords (4 2)
        if( (bassOffset-rootOffset) == 6 ){
            figuredBass = '\\normal-size-super 4 \\normal-size-sub 2'; // 2nd inversion
        }
    }
    return figuredBass;
}


function makeHTML_ChordProgressionDisplay(chordProgression) {
    var atleast12 = false;
    var html = '<p>';
    chordProgression.forEach((chord, index) => {
        html += chord + '&nbsp;&nbsp;';
        if(!atleast12) {
            atleast12 = ((index+1)%12 == 0);
        }
        if( atleast12 && chord == '|' ) {
            html += '<br><br>| ';
            atleast12 = false;
        }
    });
    html += '</p>' 
    return html;
}

function nameChord(chord) {
    var midiChord = translateNoteNamesToMIDI(chord);
    var bassNote = getBassNote(chord);
    var chordName = getChordName(chord); 
    var chordRoot = getChordRoot(chord);
    
}

function reduceToMIDIClass(MIDINote) {
    var midiClass = MIDINote;
    while(midiClass > 12) {
        midiClass -= 12;
    }
    return midiClass;
}

function getChordName(chord) {
    var midiChord = translateNoteNamesToMIDI(chord);
    var unSortedChord = [];
    var offset = Math.min(...midiChord);
    var oneMIDINum;

    midiChord.forEach(element => {
        oneMIDINum = element-offset;
        while(oneMIDINum > 11) {
            oneMIDINum -= 12;
        }
        unSortedChord.push(oneMIDINum);
    });

    var sortedChord = unSortedChord.slice(0).sort(function(a, b){return a - b});
//    console.log(sortedChord);
    var intervalStructure = [];
    sortedChord.forEach(element => {
        if( !intervalStructure.includes(element) ) {
            intervalStructure.push(element);
        }
    });
    // now analyze this using structureToChordName()
    var chordName = structureToChordName(intervalStructure);
//    console.log('\nchord='+chord+' intervalStructure='+intervalStructure+' chordName='+chordName);
    return chordName;
}

function getChordRoot(chord) {
    var index;
    var chordRoot = '.';
    var midiChord = translateNoteNamesToMIDIClass(chord);
//    var midiChord = translateNoteNamesToMIDI(chord);
    
    var sortedChord = midiChord.slice(0).sort(function(a, b){return a - b});
    // check for known patterns of root position and inversions
    // for triads, 7th chords
    var offset = Math.min(...midiChord);
    var intervalStructure = [];
//    midiChord.forEach(element => {
    sortedChord.forEach(element => {
        intervalStructure.push(element - offset);
    });
    // now analyze this using structureToRootIndex dictionary
    var rootIndex = structureToRootIndex(intervalStructure);
    if(rootIndex) {
        index = rootIndex[1];
    } else {
        index = 0;
    }
    var len = chord.length;
    for(var i=0; i<len; i++) {
//        console.log('intervalStructure[index]+offset)='+(intervalStructure[index]+offset)+' reduceToMIDIClass(noteNameToMIDI(chord[i]))='+reduceToMIDIClass(noteNameToMIDI(chord[i])) );
        if( (intervalStructure[index]+offset) == reduceToMIDIClass(noteNameToMIDI(chord[i]) ) ) {
            chordRoot = chord[i];
            break;
        }
    }
    if(chordRoot) {
        len = chordRoot.length;
        chordRoot = chordRoot.slice(0,len-1);
    }
//    console.log('rootIndex='+rootIndex+ ' index='+index+' chordRoot='+chordRoot);
    return chordRoot;
}

function getBassNote(chord) {
    var midiChord = translateNoteNamesToMIDI(chord);
    var lowestMIDI = 127;
    var thisMIDI = 127;
    var bassNote;
//    for(note in chord) {
    chord.forEach( note => {
        thisMIDI = noteNameToMIDI(note);
        if(thisMIDI < lowestMIDI) {
            lowestMIDI = thisMIDI;
            bassNote = note;
        }
    });
//    console.log('bassNote='+bassNote)
    if(bassNote) {
        var lenBass = bassNote.length;
        bassNote = bassNote.slice(0,lenBass-1)
    }
    return bassNote;
}

var chordNameDictionary1 = {
    'maj': 'maj',
    'min': 'min',
    'dim': 'dim',
    'aug': 'aug',
    'sus4': 'sus4',
    'Ma7': 'ma7',
    '7': '7',
    'mi7': 'mi7',
    'm7b5': 'm7b5',
    'dim7': 'dim7',
    'add9': 'add9'
}
var chordNameDictionary2 = {
    'maj': '',
    'min': 'm',
    'dim': 'dim',
    'aug': 'aug',
    'sus4': 'sus4',
    'Ma7': 'ma7',
    '7': '7',
    'mi7': 'm7',
    'm7b5': 'm7b5',
    'dim7': 'o7',
    'add9': 'add9'
}
// create chordDictionaryXX as needed...

// assign your creation to chordNameDictionary here:
const chordNameDictionary = chordNameDictionary2;

function structureToChordName(structure) {
    var chordName = '(?)';
    //----------------------------------------
    // diads root position
    if(arraysEqual(structure, [0,4]) ) { 
        chordName = chordNameDictionary['maj'];
    }
    if(arraysEqual(structure, [0,3]) ) { 
        chordName = chordNameDictionary['min'];
    }
    // diads inversion
    if(arraysEqual(structure, [0,8]) ) { 
        chordName = chordNameDictionary['maj'];
    }
    if(arraysEqual(structure, [0,9]) ) { 
        chordName = chordNameDictionary['min'];
    }

    //----------------------------------------
    // triads root position
    if(arraysEqual(structure, [0,4,7]) ) { 
        chordName = chordNameDictionary['maj'];
    }
    if(arraysEqual(structure, [0,3,7]) ) { 
        chordName = chordNameDictionary['min'];
    }
    if(arraysEqual(structure, [0,3,6]) ) { 
        chordName = chordNameDictionary['dim'];
    }
    if(arraysEqual(structure, [0,4,8]) ) { 
        chordName = chordNameDictionary['aug'];
    }
    if(arraysEqual(structure, [0,5,7]) ) { 
        chordName = chordNameDictionary['sus4'];
    }

// oh my! what to do? same as augmented I guess (ambiguous)
//    [0,2,7]: ['sus2','root'],
//    [0,2,7]: ['sus4','1st'],

    // triads 1st inversion
    if(arraysEqual(structure, [0,3,8]) ) { 
        chordName = chordNameDictionary['maj'];
    }
    if(arraysEqual(structure, [0,4,9]) ) { 
        chordName = chordNameDictionary['min'];
    }
    if(arraysEqual(structure, [0,3,9]) ) { 
        chordName = chordNameDictionary['dim'];
    }
    if(arraysEqual(structure, [0,4,8]) ) { 
        chordName = chordNameDictionary['aug'];
    }
    if(arraysEqual(structure, [0,2,7]) ) { 
        chordName = chordNameDictionary['sus4'];
    }

    // triads 2nd inversion
    if(arraysEqual(structure, [0,5,9]) ) { 
        chordName = chordNameDictionary['maj'];
    }
    if(arraysEqual(structure, [0,5,8]) ) { 
        chordName = chordNameDictionary['min'];
    }
    if(arraysEqual(structure, [0,6,9]) ) { 
        chordName = chordNameDictionary['dim'];
    }
    if(arraysEqual(structure, [0,4,8]) ) { 
        chordName = chordNameDictionary['aug'];
    }
    if(arraysEqual(structure, [0,5,10]) ) { 
        chordName = chordNameDictionary['sus4'];
    }

    //----------------------------------------
    // seventh chords
    if(arraysEqual(structure, [0,4,7,11]) ) { 
        chordName = chordNameDictionary['Ma7'];
    }
    if(arraysEqual(structure, [0,4,7,10]) ) { 
        chordName = chordNameDictionary['7'];
    }
    if(arraysEqual(structure, [0,3,7,10]) ) { 
        chordName = chordNameDictionary['mi7'];
    }
    if(arraysEqual(structure, [0,3,6,10]) ) { 
        chordName = chordNameDictionary['m7b5'];
    }
    if(arraysEqual(structure, [0,3,6,9]) ) { 
        chordName = chordNameDictionary['dim7'];
    }
    // add 9
    if(arraysEqual(structure, [0,2,4,7]) ) { 
        chordName = chordNameDictionary['add9'];
    }

    
    // seventh chords 1st inversion
    if(arraysEqual(structure, [0,3,7,8]) ) { 
        chordName = chordNameDictionary['Ma7'];
    }
    if(arraysEqual(structure, [0,3,6,8]) ) { 
        chordName = chordNameDictionary['7'];
    }
    if(arraysEqual(structure, [0,4,7,9]) ) { 
        chordName = chordNameDictionary['mi7'];
    }
    if(arraysEqual(structure, [0,3,7,9]) ) { 
        chordName = chordNameDictionary['m7b5'];
    }
    if(arraysEqual(structure, [0,3,6,9]) ) { 
        chordName = chordNameDictionary['dim7'];
    }

    // seventh chords 2nd inversion
    if(arraysEqual(structure, [0,4,5,9]) ) { 
        chordName = chordNameDictionary['Ma7'];
    }
    if(arraysEqual(structure, [0,3,5,9]) ) { 
        chordName = chordNameDictionary['7'];
    }
    if(arraysEqual(structure, [0,3,5,8]) ) { 
        chordName = chordNameDictionary['mi7'];
    }
    if(arraysEqual(structure, [0,4,6,9]) ) { 
        chordName = chordNameDictionary['m7b5'];
    }
    if(arraysEqual(structure, [0,3,6,9]) ) { 
        chordName = chordNameDictionary['dim7'];
    }

    // seventh chords 3rd inversion
    if(arraysEqual(structure, [0,1,5,8]) ) { 
        chordName = chordNameDictionary['Ma7'];
    }
    if(arraysEqual(structure, [0,2,6,9]) ) { 
        chordName = chordNameDictionary['7'];
    }
    if(arraysEqual(structure, [0,2,5,9]) ) { 
        chordName = chordNameDictionary['mi7'];
    }
    if(arraysEqual(structure, [0,2,5,8]) ) { 
        chordName = chordNameDictionary['m7b5'];
    }
    if(arraysEqual(structure, [0,3,6,9]) ) { 
        chordName = chordNameDictionary['dim7'];
    }

    //----------------------------------------
    // incomplete seventh chords (no 5th)
    if(arraysEqual(structure, [0,4,11]) ) { 
        chordName = chordNameDictionary['Ma7'];
    }
    if(arraysEqual(structure, [0,4,10]) ) { 
        chordName = chordNameDictionary['7'];
    }
    if(arraysEqual(structure, [0,3,10]) ) { 
        chordName = chordNameDictionary['mi7'];
    }
//    if(arraysEqual(structure, [0,3,10]) ) { 
//        chordName = chordNameDictionary['m7b5'];
//    }
//    if(arraysEqual(structure, [0,3,9]) ) { 
//        chordName = chordNameDictionary['dim7'];
//    }

    // incomplete seventh chords (no 5th)
    // 1st inversion
    if(arraysEqual(structure, [0,7,8]) ) { 
        chordName = chordNameDictionary['Ma7'];
    }
    if(arraysEqual(structure, [0,6,8]) ) { 
        chordName = chordNameDictionary['7'];
    }
    if(arraysEqual(structure, [0,7,9]) ) { 
        chordName = chordNameDictionary['mi7'];
    }
//    if(arraysEqual(structure, [0,7,9]) ) { 
//        chordName = chordNameDictionary['m7b5'];
//    }
//    if(arraysEqual(structure, [0,6,9]) ) { 
//        chordName = chordNameDictionary['dim7'];
//    }

    // incomplete seventh chords (no 5th)
    // 3rd inversion
    if(arraysEqual(structure, [0,1,5]) ) { 
        chordName = chordNameDictionary['Ma7'];
    }
    if(arraysEqual(structure, [0,2,6]) ) { 
        chordName = chordNameDictionary['7'];
    }
    if(arraysEqual(structure, [0,2,5]) ) { 
        chordName = chordNameDictionary['mi7'];
    }
//    if(arraysEqual(structure, [0,2,5]) ) { 
//        chordName = chordNameDictionary['m7b5'];
//    }

    // this should already have been id as root postion diminished triad
//    if(arraysEqual(structure, [0,3,6]) ) { 
//        chordName = chordNameDictionary['dim7'];
//    }

//    console.log('structureToChordName: structure='+structure+' chordName='+chordName);
    return chordName;
}

function structureToRootIndex(structure) {
    var chordNameRootIndex = ['.', 0];
    //----------------------------------------
    // diads root position
    if(arraysEqual(structure, [0,4]) ) { 
        chordNameRootIndex = ['maj', 0];
    }
    if(arraysEqual(structure, [0,3]) ) { 
        chordNameRootIndex = ['min', 0];
    }
    // diads inversion
    if(arraysEqual(structure, [0,8]) ) { 
        chordNameRootIndex = ['maj', 1];
    }
    if(arraysEqual(structure, [0,9]) ) { 
        chordNameRootIndex = ['min', 1];
    }

    //----------------------------------------
    // triads root position
    if(arraysEqual(structure, [0,4,7]) ) { 
        chordNameRootIndex = ['maj', 0];
    }
    if(arraysEqual(structure, [0,3,7]) ) { 
        chordNameRootIndex = ['min', 0];
    }
    if(arraysEqual(structure, [0,3,6]) ) { 
        chordNameRootIndex = ['dim', 0];
    }
    if(arraysEqual(structure, [0,4,8]) ) { 
        chordNameRootIndex = ['aug', 0];
    }
    if(arraysEqual(structure, [0,5,7]) ) { 
        chordNameRootIndex = ['sus4', 0];
    }

// oh my! what to do? same as augmented I guess (ambiguous)
//    if(structure == [0,2,7]: ['sus2', 0],
//    if(structure == [0,2,7]: ['sus4', 2],
    // triads 1st inversion
    if(arraysEqual(structure, [0,3,8]) ) { 
        chordNameRootIndex = ['maj', 2];
    }
    if(arraysEqual(structure, [0,4,9]) ) { 
        chordNameRootIndex = ['min', 2];
    }
    if(arraysEqual(structure, [0,3,9]) ) { 
        chordNameRootIndex = ['dim', 2];
    }
    if(arraysEqual(structure, [0,4,8]) ) { 
        chordNameRootIndex = ['aug', 2];
    }
    if(arraysEqual(structure, [0,2,7]) ) {
        chordNameRootIndex = ['sus4', 2];
    }
    
    // triad 2nd inversions
    if(arraysEqual(structure, [0,5,9]) ) { 
        chordNameRootIndex = ['maj', 1];
    }
    if(arraysEqual(structure, [0,5,8]) ) { 
        chordNameRootIndex = ['min', 1];
    }
    if(arraysEqual(structure, [0,6,9]) ) { 
        chordNameRootIndex = ['dim', 1];
    }
    if(arraysEqual(structure, [0,4,8]) ) { 
        chordNameRootIndex = ['aug', 1];
    }
    if(arraysEqual(structure, [0,5,10]) ) {
        chordNameRootIndex = ['sus4', 1];
    }

    //----------------------------------------
    // seventh chords
    if(arraysEqual(structure, [0,4,7,11]) ) { 
        chordNameRootIndex = ['Ma7', 0];
    }
    if(arraysEqual(structure, [0,4,7,10]) ) { 
        chordNameRootIndex = ['7', 0];
    }
    if(arraysEqual(structure, [0,3,7,10]) ) { 
        chordNameRootIndex = ['mi7', 0];
    }
    if(arraysEqual(structure, [0,3,6,10]) ) { 
        chordNameRootIndex = ['m7b5', 0];
    }
    if(arraysEqual(structure, [0,3,6,9]) ) { 
        chordNameRootIndex = ['dim7', 0];
    }
    if(arraysEqual(structure, [0,2,4,5]) ) { 
        chordNameRootIndex = ['add9', 0];
    }
    
    // seventh chords 1st inversion
    if(arraysEqual(structure, [0,3,7,8]) ) { 
        chordNameRootIndex = ['Ma7', 3];
    }
    if(arraysEqual(structure, [0,3,6,8]) ) { 
        chordNameRootIndex = ['7', 3];
    }
    if(arraysEqual(structure, [0,4,7,9]) ) { 
        chordNameRootIndex = ['mi7', 3];
    }
    if(arraysEqual(structure, [0,3,7,9]) ) { 
        chordNameRootIndex = ['m7b5', 3];
    }
    if(arraysEqual(structure, [0,3,6,9]) ) { 
        chordNameRootIndex = ['dim7', 3];
    }

    // seventh chords 2nd inversion
    if(arraysEqual(structure, [0,4,5,9]) ) { 
        chordNameRootIndex = ['Ma7', 2];
    }
    if(arraysEqual(structure, [0,3,5,9]) ) { 
        chordNameRootIndex = ['7', 2];
    }
    if(arraysEqual(structure, [0,3,5,8]) ) { 
        chordNameRootIndex = ['mi7', 2];
    }
    if(arraysEqual(structure, [0,4,6,9]) ) { 
        chordNameRootIndex = ['m7b5', 2];
    }
    if(arraysEqual(structure, [0,3,6,9]) ) { 
        chordNameRootIndex = ['dim7', 2];
    }

    // seventh chords 3rd inversion
    if(arraysEqual(structure, [0,1,5,8]) ) { 
        chordNameRootIndex = ['Ma7', 1];
    }
    if(arraysEqual(structure, [0,2,6,9]) ) { 
        chordNameRootIndex = ['7', 1];
    }
    if(arraysEqual(structure, [0,2,5,9]) ) { 
        chordNameRootIndex = ['mi7', 1];
    }
    if(arraysEqual(structure, [0,2,5,8]) ) { 
        chordNameRootIndex = ['m7b5', 1];
    }
    if(arraysEqual(structure, [0,3,6,9]) ) { 
        chordNameRootIndex = ['dim7', 1];
    }

    //----------------------------------------
    // incomplete seventh chords (no 5th)
    if(arraysEqual(structure, [0,4,11]) ) { 
        chordNameRootIndex = ['Ma7', 0];
    }
    if(arraysEqual(structure, [0,4,10]) ) { 
        chordNameRootIndex = ['7', 0];
    }
    if(arraysEqual(structure, [0,3,10]) ) { 
        chordNameRootIndex = ['mi7', 0];
    }
// same as mi7
//    if(arraysEqual(structure, [0,3,10]) ) { 
//        chordNameRootIndex = ['m7b5', 0];
//    }
//    if(arraysEqual(structure, [0,3,9]) ) { 
//        chordNameRootIndex = ['dim7', 0];
//    }

    // incomplete seventh chords (no 5th)
    // 1st inversion
    if(arraysEqual(structure, [0,7,8]) ) { 
        chordNameRootIndex = ['Ma7', 2];
    }
    if(arraysEqual(structure, [0,6,8]) ) { 
        chordNameRootIndex = ['7', 2];
    }
    if(arraysEqual(structure, [0,7,9]) ) { 
        chordNameRootIndex = ['mi7', 2];
    }
// same as mi7
//    if(arraysEqual(structure, [0,7,9]) ) { 
//        chordNameRootIndex = ['m7b5', 2];
//    }
//    if(arraysEqual(structure, [0,6,9]) ) { 
//        chordNameRootIndex = ['dim7', 2];
//    }

    // incomplete seventh chords (no 5th)
    // 3rd inversion
    if(arraysEqual(structure, [0,1,5]) ) { 
        chordNameRootIndex = ['Ma7', 1];
    }
    if(arraysEqual(structure, [0,2,6]) ) { 
        chordNameRootIndex = ['7', 1];
    }
    if(arraysEqual(structure, [0,2,5]) ) { 
        chordNameRootIndex = ['mi7', 1];
    }
// same as mi7
//    if(arraysEqual(structure, [0,2,5]) ) { 
//        chordNameRootIndex = ['m7b5', 1];
//    }

    // this should already have been id as root postion diminished triad
//    if(arraysEqual(structure, [0,3,6]) ) { 
//        chordNameRootIndex = ['dim7', 1];
//    }
    
//    console.log('structure='+structure+' chordNameRootIndex='+chordNameRootIndex);
    return chordNameRootIndex;    
}

// check if arrays a and b are the same.
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If want arrays that contain the same elements but in different order 
    // to be considered the same, you should sort both arrays here.

    // (unsorted a and b)
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

// there might be a known better way to do this.
function compressArray(array, compressFactor) {
    var compressedArray = [];
    var subArray = [];
    var tempSubArray = [];
    var prevElement = '';
    var localArray = array.slice();
    var start = 0;
    var end = 0;
    var len = localArray.length/compressFactor;
    var firstTime = true;
    for(let i = 0; i<len; i++) {
        start = i * compressFactor;
        // slice off a chunk 
        tempSubArray = localArray.slice(start, (start + compressFactor) );
        // and reduce
        tempSubArray.forEach( element => {
            if(element != prevElement || firstTime) {
                subArray.push(element);
                firstTime = false;
            }
            prevElement = element;
        });
        // check  subArray.length if only one then use the element without the array
        if(subArray.length == 1) {
            compressedArray.push(subArray[0]);
            subArray = [];
        } else if(subArray.length > 1) {
            compressedArray.push(subArray);
            subArray = [];
        } else {
            alert('subArray='+subArray+' error in compressArray()')
        }
        tempSubArray = [];
        firstTime = true;
//        subArray = [];
    }
    return compressedArray;
}

// looks for subarrays within array
function containsSubarraysOrObjects(array) {
    var len = array.length;
    for(let i=0; i<len; i++) {
        if(typeof(array[i]) == 'object') {
//            console.log('object found at index '+i)
            return true;
        }    
    }
    return false;
}

function containsMultipleSubarraysOrObjects(array) {
    var len = array.length;
    var count = 0;
    for(let i=0; i<len; i++) {
        if(typeof(array[i]) == 'object') {
//            console.log('object found at index '+i)
            count++;
            if(count > 1) {
                return true;
            }
        } else {
            continue;
        }
    }
    return false;
}


function hasSameLenMultArrays(array) {
    var len = array.length;
    if(len === 1) {
        return false;
    }
    var arrayLen = 0;
    var oldArrayLen = 0;
    for(let i=0; i<len; i++) {
        if(typeof(array[i]) == 'object') {
//            console.log('object found at index '+i)
            arrayLen = array[i].length;
            // initialize oldArrayLen first time only
            if(oldArrayLen === 0)
                oldArrayLen = arrayLen; 
            
            if(oldArrayLen != arrayLen) {
                return false;
            }
        }  else {
            return false;
        }
    }
    return true;
}


// this assumes one (or more) of the 'notes' of the chord is an array of notes, one of which 
// is a chord tone along with the other coreNotes of the chord
function resolveMovingVoiceChord(chord) {
    var len = chord.length;
    var choices = [];
    var foundIndices = [];
    var choicesLen = 0;
    var coreNotes = [];
    var chordChoices = [];
    var oneChordChoice = [];
//    var chordProgression = [];
    var root, name, bass, chordName;
    var i = 0;
    var numOfArrays = 0;
//    console.log('len='+len+' chord='+chord);

    // divide chord between coreNotes and choices
    for(i=0; i<len; i++) {
        if(typeof(chord[i]) == 'object') {
            numOfArrays++;
//            console.log('chord['+i+']='+chord[i])
            choices.push(chord[i]);
            foundIndices.push(i);
        } else {
            coreNotes.push(chord[i])
        }
    }

	var numChoices = choices.length;
	var numIndices = foundIndices.length;
//	console.log('numIndices='+numIndices+' numChoices='+numChoices+' numOfArrays='+numOfArrays);
// if(numChoices>1) console.log('choices='+choices+' coreNotes='+coreNotes);
	
	// check to see if choices containsSubarraysOrObjects
	var hasMultipleMovingVoices = containsMultipleSubarraysOrObjects(choices);
	var sameLength = hasSameLenMultArrays(choices);
//	console.log('hasMultipleMovingVoices='+hasMultipleMovingVoices+' sameLength='+sameLength);

//----------------using chord, coreNotes and choices -------------------------------------------
    if( hasMultipleMovingVoices && sameLength ) {
        // make an array of parallel voices
        var parallelVoices = [];
        var oneMultVoice = [];
        var len = choices[0].length;
        var numChoices = choices.length;
        for(let j = 0; j < len; j++) {
            for(let i = 0; i < numChoices; i++) {
                oneMultVoice.push(choices[i][j])
            }
//            console.log('oneMultVoice='+oneMultVoice);
            parallelVoices.push(oneMultVoice);
            oneMultVoice = [];
        }
//        console.log('parallelVoices='+parallelVoices);
        // merge each with the coreNote using spread ... operator
        // to create an array of chord choices
        let voicesLen = parallelVoices.length;
//        console.log('voicesLen='+voicesLen);
		for(let i=0; i < voicesLen; i++) {
		    oneChordChoice = coreNotes.slice();		
		    oneChordChoice.push(...parallelVoices[i]);
		    chordChoices.push(oneChordChoice);
			oneChordChoice = [];
		}
        
    } else if(hasMultipleMovingVoices && !sameLength) {
        // merge two moving voices with the coreNotes.
        // to create an array of chord choices
        var len = choices.length;
        var shortLen = 10;
        var tempLen = 0;
        var whichIndex = 0;
        var v1Len = 0;
        var v2Len = 0;
        var v3Len = 0;
        var v4Len = 0;
        var Len2 = 0;
        var Index2 = 0;
        var Len3 = 0;
        var Index3 = 0;
        var Len4 = 0;
        var Index4 = 0;
        
//        console.log('len = '+len);

        // determine what voice has the least notes
        for(let i=0; i < len; i++){
            tempLen = choices[i].length;
            if(i == 0) v1Len = choices[i].length; 
            if(i == 1) v2Len = choices[i].length; 
            if(i == 2) v3Len = choices[i].length; 
            if(i == 3) v4Len = choices[i].length;
            if(tempLen < shortLen) { 
                shortLen = tempLen;
                whichIndex = i;
            }
        }
        if(len==2) {
            if(whichIndex == 0) {
                Len2 = choices[1].length;
                Index2 = 1;
            } else if(whichIndex == 1) {
                Len2 = choices[0].length;
                Index2 = 0;
            }
        } else if(len==3) {
            if(whichIndex == 0) {
                Len2 = choices[1].length;
                Index2 = 1;
                Len3 = choices[2].length;
                Index3 = 2;
            } else if(whichIndex == 1) {
                Len2 = choices[0].length;
                Index2 = 0;
                Len3 = choices[2].length;
                Index3 = 2;
            } else if(whichIndex == 2) {
                Len2 = choices[0].length;
                Index2 = 0;
                Len3 = choices[1].length;
                Index3 = 1;
            }
        } else if(len==4) {
            if(whichIndex == 0) {
                Len2 = choices[1].length;
                Index2 = 1;
                Len3 = choices[2].length;
                Index3 = 2;
                Len4 = choices[3].length;
                Index4 = 3;
            } else if(whichIndex == 1) {
                Len2 = choices[0].length;
                Index2 = 0;
                Len3 = choices[2].length;
                Index3 = 2;
                Len4 = choices[3].length;
                Index4 = 3;
            } else if(whichIndex == 2) {
                Len2 = choices[0].length;
                Index2 = 0;
                Len3 = choices[1].length;
                Index3 = 1;
                Len4 = choices[3].length;
                Index4 = 3;
            } else if(whichIndex == 3) {
                Len2 = choices[0].length;
                Index2 = 0;
                Len3 = choices[1].length;
                Index3 = 1;
                Len4 = choices[2].length;
                Index4 = 3;
            }
        }
        
        if(shortLen == Len3){
            // swap 2 and 3 values
            let temp = Index2;
            Index2 = Index3;
            Index3 = temp;

            temp = Len2;
            Len2 = Len3;
            Len3 = temp;
        }
        // if two are equal to shortLen simplify the loop
        if(shortLen == Len2) {
//            console.log('(shortLen==Len2) ='+ Len2);
            for(let i=0; i<shortLen; i++){
                oneChordChoice = coreNotes.slice();
                oneChordChoice.push(choices[whichIndex][i]);
                oneChordChoice.push(choices[Index2][i]);
                if( len>2){
                    for(let k=0; k < Len3; k++){
                        oneChordChoice.push(choices[Index3][k]);                
                        if(len==4){
                            for(let l=0; l < Len4; l++){
                                oneChordChoice.push(choices[Index4][l]);
                                chordChoices.push(oneChordChoice);
                                oneChordChoice = []; 
                                oneChordChoice = coreNotes.slice();
                                oneChordChoice.push(choices[whichIndex][i]);
                                oneChordChoice.push(choices[Index2][i]);
                                oneChordChoice.push(choices[Index3][k]);                
                            }
                        } else {
                            chordChoices.push(oneChordChoice);
                            oneChordChoice = [];
                            oneChordChoice = coreNotes.slice();
                            oneChordChoice.push(choices[whichIndex][i]);
                            oneChordChoice.push(choices[Index2][i]);
                    }
                    }
                } else {
                    chordChoices.push(oneChordChoice);
                    oneChordChoice = [];
                }
            }
        } // end if(shortLen == Len2)
        else {
        
        // loop over the short array
        for(let i=0; i < shortLen; i++){
		    oneChordChoice = coreNotes.slice();
		    oneChordChoice.push(choices[whichIndex][i]);
            // loop through the array 2
            for(let j=0; j < Len2; j++){
                oneChordChoice.push(choices[Index2][j]);

                if( len>2){
                    // loop through array 3
                    for(let k=0; k < Len3; k++){
                        oneChordChoice.push(choices[Index3][k]);                
                        if(len==4){
                            // loop through array 4 
                            for(let l=0; l < Len4; l++){
                                oneChordChoice.push(choices[Index4][l]);
                                chordChoices.push(oneChordChoice);
                                oneChordChoice = []; 
                                oneChordChoice = coreNotes.slice();
                                oneChordChoice.push(choices[whichIndex][i]);
                                oneChordChoice.push(choices[Index2][j]);
                                oneChordChoice.push(choices[Index3][k]);                
                            }
                        } else {
                            chordChoices.push(oneChordChoice);
                            oneChordChoice = [];
                            oneChordChoice = coreNotes.slice();
                            oneChordChoice.push(choices[whichIndex][i]);
                            oneChordChoice.push(choices[Index3][j]);                
                        }
                    }
                } else {
                    chordChoices.push(oneChordChoice);
                    oneChordChoice = [];
                }
            }
        } // end for loop

        } // end else

//        console.log('hasMultipleMovingVoices && !sameLength');
//        console.log('coreNotes='+coreNotes+' whichIndex='+whichIndex + ' shortLen='+shortLen);

    } else if(containsSubarraysOrObjects(chord)) {
        // merge one moving voice with the coreNotes.
        // to create an array of chord choices
        var len = choices[0].length;
		for(let i=0; i < len; i++) {
		    oneChordChoice = coreNotes.slice();
		    oneChordChoice.push(choices[0][i])
		    chordChoices.push(oneChordChoice);
			oneChordChoice = [];
		}

    } else {
        chordChoices.push(chord);
//        console.log('chord='+chord);
    }


/*----------------------------------------------------------	
	var lenChoices = chordChoices.length;
	var msg = '' + lenChoices + ' chord choices';
	for(let i=0; i<lenChoices; i++) {
		msg += '\n' + chordChoices[i];
	}	
//	console.log(msg);
if(Array.isArray(chordChoices)){
    let len = chordChoices.length;
    for(let i=0; i<len; i++){
        console.log('chordChoices['+i+'] = '+chordChoices[i]);
    }
}
//---------------------------------------------------------*/

// now analyze the chordChoices and choose the best option.	
	var myChord = pickBestChordChoice(chordChoices);
//	console.log('myChord.fullName='+myChord.fullName);
	return myChord;
}

function pickBestChordChoice(chordChoices) {
    const triadNames1 = ['','m','maj','min'];
    const triadNames2 = ['aug','dim'];
    const chordNames1 = ['ma7','m7','7'];
    const chordNames2 = ['dim7','m7b5','o7'];

    var root, name, bass;
    var scores = [];
    var nonHarmonicTones = [];
//    console.log('chordChoices='+chordChoices);
	chordChoices.forEach((element, index) => {
	    scores[index] = 1;
        root = getChordRoot(element);
        name = getChordName(element);
        bass = getBassNote(element);
        // assign the chordName and give each a score
        if(name == '(?)') {
            chordName = name;
            scores[index] += -1;
        } else if( triadNames1.includes(name) ) { // maj and min triads rated 3
            chordName = root + name;
            scores[index] += 3;
        } else if( triadNames2.includes(name) ) { // dim and aug triads rated 2
            chordName = root + name;
            scores[index] += 2;
        } else if( chordNames1.includes(name) ) { // ma7 m7 7 rated 1.8
            chordName = root + name;
            scores[index] += 1.8;
        } else if( chordNames2.includes(name) ) { // ma7 m7 7 rated 1.4
            chordName = root + name;
            scores[index] += 1.4;
        } else {  // other names rated 1
            chordName = root + name;
            scores[index] += 1;
        }

        if(root != bass) {
            chordName += '/' + bass;
            scores[index] += -1;
        }
//	    console.log('index='+index+' element='+element+' chordName='+chordName+' scores['+index+']='+scores[index]);	
	});
	var highScore = -10;
	var bestIndex;
	scores.forEach((element, index) => {
        if(element > highScore) {
            highScore = element;
            bestIndex = index;
        }
	});
//    console.log('bestIndex='+bestIndex+' chordChoices='+chordChoices);
	root = getChordRoot(chordChoices[bestIndex]);
	name = getChordName(chordChoices[bestIndex]);
	bass = getBassNote(chordChoices[bestIndex]);
	if(name == '(?)') {
		chordName = name;
	} else {
		chordName = root + name;
	}
	if(root != bass) {
		chordName += '/' + bass;
	}

//---------------------------------------
// chordContext object for each chord 'situation'
//    var oneChordContext = makeOneChordContext(bass, name, root, chordName, chordChoices[bestIndex]);
//    let aChordObject = new aChordContext(bass, name, root, chordName, chordChoices[bestIndex]);
    var aChordContext = makeAChordContext(bass, name, root, chordName, chordChoices[bestIndex]);
    return aChordContext;
}



function makeOneChordContext(bass, name, root, chordName, thisChord) {
    var oneChordContext = {};
    Object.defineProperties(oneChordContext, {
      'bassNote': {
        value: bass,
      },
      'name': {
        value: name,
      },
      'root': {
        value: root,
      },
      'fullName': {
        value: chordName,
      },
      'thisChord': {
        value: thisChord,
      },
      'localKey': { // array of notes played near this chord
        value: '', // getLocalKey,
      },
      'key': { // the key signature
        value: '', // getKey,
      },
      'nonHarmonicTones': {
        value: [],
      },
      'prevChord': {
       value: '', // (oneChordContext),
      },
      'nextChord': {
        value: '', // (oneChordContext),
      },
      'location': {
        value: '', // location
      },
      'isFermata': {
        value: '', // location
      },
      'meta': {
        value: '' // meta
      }		  
    });

    return oneChordContext;
}


function flatten(arr) {
    return arr.reduce(function(a,b) {
        return a.concat(Array.isArray(b) ? flatten(b) : b);
    }, []);
}


function intervalAnalysis(LilyArray1, LilyArray2) {
    var numHalfSteps;
    var voice1Higher = true;
    const gridWidth = getGridWidth(LilyArray1, LilyArray2);
//    console.log('gridWidth='+gridWidth);
    const Melody1_Grid = MelodyToPitchGrid(LilyArray1, gridWidth);
    const Melody2_Grid = MelodyToPitchGrid(LilyArray2, gridWidth);
    const Melody1_MIDI = translateNoteNamesToMIDI(Melody1_Grid);
    const Melody2_MIDI = translateNoteNamesToMIDI(Melody2_Grid);
//    console.log('LilyArray1= '+LilyArray1+'\LilyArray2= '+LilyArray2);
//    console.log('Melody1_Grid= '+Melody1_Grid+'\nMelody2_Grid= '+Melody2_Grid);
    const startingVoice1Higher = (Melody1_MIDI[0] > Melody2_MIDI[0]);
    var voicesCross = false;
    var crossingIndex = null;
    var halfStepArray = [];
    var intervalArray = [];
    Melody1_MIDI.forEach( (element, index) => {
        voice1Higher = element > Melody2_MIDI[index]? true: false;
        // if voice1Higher changes the voices have crossed. 
        if(voice1Higher != startingVoice1Higher) {
            voicesCross = true;
            crossingIndex = index;
        }
        numHalfSteps = Math.abs(element - Melody2_MIDI[index]);
        halfStepArray.push(numHalfSteps);
    });
    
    var intervalName;
    // now analysis the halfStepArray using the Melody grids to solve ambiguity
    halfStepArray.forEach( (element, index) => {
        intervalName = getIntervalName(Melody1_Grid[index], Melody2_Grid[index], element);
        intervalArray.push(intervalName);
    });

    // return the interval array
    return intervalArray;
}

function getIntervalName(name1, name2, halfSteps) {
    if(name1 == 'rest') {
        return name2;
    } else if(name2 == 'rest') {
        return name1;
    }
    
    var intervalName;
    var intervalNumber;
    var intervalQuality;
    // use names to get interval number
    const letter1 = name1[0];
    const letter2 = name2[0];
    const MIDI_1 = noteNameToMIDI(name1);
    const MIDI_2 = noteNameToMIDI(name2);
    const startingVoice1_Higher = (MIDI_1 > MIDI_2)? true: false;
    if(startingVoice1_Higher) {
        intervalNumber = getIntervalNumber(letter2, letter1);
    } else {
        intervalNumber = getIntervalNumber(letter1, letter2);    
    }
    
    if( (intervalNumber == 1) && (halfSteps == 12) ) {
        intervalNumber = 8;
    }
    // use half steps to define the interval name
    intervalName = resolveIntervalQuality(intervalNumber, halfSteps);
    return intervalName;
}

function resolveIntervalQuality(intervalNum, numHalfSteps) {
    var choices = halfStepsToNames[numHalfSteps];
    var len = choices.length;
    var intervalName;
    var myIntervalNum;
    if(numHalfSteps > 12) {
        myIntervalNum = intervalNum + 7;
    } else {
        myIntervalNum = intervalNum;
    }
    if(len > 1) {
        for(let i=0; i<len; i++) {
            if(choices[i].includes(myIntervalNum) ) {
                intervalName = choices[i];
            }
            
        }
    } else {
        intervalName = choices[0];    
    }
    return intervalName;
}


var halfStepsToNames = {
    0: ['Perfect 1'],
    1: ['Min 2'],
    2: ['Maj 2'],
    3: ['Min 3','Aug 2'],
    4: ['Maj 3','Dim 4'],
    5: ['Perfect 4'],
    6: ['Aug 4','Dim 5'],
    7: ['Perfect 5'],
    8: ['Aug 5','Min 6'],
    9: ['Maj 6','Dim 7'],
    10: ['Min 7','Aug 6'],
    11: ['Maj 7','Dim 8'],
    12: ['Perfect 8','Aug 7'],
    13: ['Min 9','Aug 8'],
    14: ['Maj 9'],
    15: ['Min 10','Aug 9'],
    16: ['Maj 10','Dim 11'],
    17: ['Perfect 11'],
    18: ['Aug 11','Dim 12'],
    19: ['Perfect 12'],
    20: ['Aug 12','Min 13'],
    21: ['Maj 13','Dim 14'],
    22: ['Min 14','Aug 13'],
    23: ['Maj 14','Dim 15'],
    24: ['Perfect 15','Aug 14']
}


function makeSimpleLetter(noteName) {
    var letter;
    if(noteName.length > 1) {
        letter.noteName[0];
    } else if (noteName.length == 1) {
        letter = noteName;
    } else {
        letter = '';
    }
    return letter.toUpperCase();
}


function getIntervalNumber(letterLowNote, letterHighNote) {
    const letters = ["A","B","C","D","E","F","G"];
    var myLetterLowNote;
    var myLetterHighNote;
    // to make this work for lilypond input we chop off and use only the 1st char
    // then toUpppercase that char. with makeSimpleLetter()
    myLetterLowNote = makeSimpleLetter(letterLowNote)
    myLetterHighNote = makeSimpleLetter(letterHighNote)

    var len = letters.length;
    var startingIndex;
    var i;
    var intervalNumber = 1;
    // set the first letter index
    for(i=0; i<len; i++) {
        if(letters[i] == myLetterLowNote) {
            startingIndex = i;
            break;
        }
    }
    for(i=0; i<len; i++) {
        if(letters[(i+startingIndex) % len] == myLetterHighNote) {
            break;
        }  else {
            intervalNumber += 1;
        }
    }
    return intervalNumber;
}


function findParallelIntervals(LilyArray1, LilyArray2) {
    var numHalfSteps;
    var currentNum;
    var intervalNum;
    var intervalName;
    var voice1Higher = true;
    const gridWidth = getGridWidth(LilyArray1, LilyArray2);
//    console.log('gridWidth='+gridWidth);
    const Melody1_Grid = MelodyToPitchGrid(LilyArray1, gridWidth);
    const Melody2_Grid = MelodyToPitchGrid(LilyArray2, gridWidth);
    const Melody1_MIDI = translateNoteNamesToMIDI(Melody1_Grid);
    const Melody2_MIDI = translateNoteNamesToMIDI(Melody2_Grid);
//    console.log('LilyArray1= '+LilyArray1+'\LilyArray2= '+LilyArray2);
//    console.log('Melody1_Grid= '+Melody1_Grid+'\nMelody2_Grid= '+Melody2_Grid);
    const startingVoice1Higher = (Melody1_MIDI[0] > Melody2_MIDI[0]);
    var voicesCross = false;
    var crossingIndex = null;
    var halfStepArray = [];
    var intervalArray = [];
    Melody1_MIDI.forEach( (element, index) => {
        voice1Higher = element > Melody2_MIDI[index]? true: false;
        // if voice1Higher changes the voices have crossed. 
        if(voice1Higher != startingVoice1Higher) {
            voicesCross = true;
            crossingIndex = index;
        }
        numHalfSteps = Math.abs(element - Melody2_MIDI[index]);
        halfStepArray.push(numHalfSteps);
    });
    
    // now analysis the halfStepArray using the Melody grids to solve ambiguity
    halfStepArray.forEach( (element, index) => {
        intervalName = getIntervalName(Melody1_Grid[index], Melody2_Grid[index], element);
        intervalNum = intervalName[intervalName.length-1];
        if( intervalNum == currentNum ) {
            // start/continue parallel ionterval count
            intervalArray.push(intervalName);
        } else {
            // stop parallel interval count
//            console.log("currentNum ="+currentNum+" intervalNum="+intervalNum)
        }
//        intervalArray.push(intervalName);
        currentNum = intervalNum; 

    });

    // return the interval array
    return intervalArray;

}

//-------------------------------------------------
// ----------- Roman Numerals ---------------------
//-------------------------------------------------
// major scales with enharmonic named notes outside of the scale
// indexes of 0 2 4 5 7 9 11 are the notes of the major scale
// indexes of 1 3 6 8 10 are notes outside of the scale but might be used
// in that key as chromatic alteration often passing diminished chords.
// or parallel minor chords used in the key.
// 
// indexes of 0 2 3 5 7 8 10 are the notes of the natural minor scale
// indexes of 9 and 11 are also used in harmonic and melodic minor scales
// indexes of 1 4 6 are notes outside of the scale but might be used

const c_major = ['C','C#/Db','D','D#/Eb','E','F','F#/Gb','G','G#/Ab','A','A#/Bb','B'];
const f_major = ['F','F#/Gb','G','G#/Ab','A','Bb','B/Cb','C','C#/Db','D','D#/Eb','E'];
const g_major = ['G','G#/Ab','A','A#/Bb','B','C','C#/Db','D','D#/Eb','E','E#/F','F#'];
const bb_major = ['Bb','B/Cb','C','C#/Db','D','Eb','E/Fb','F','F#/Gb','G','G#/Ab','A'];
const d_major = ['D','D#/Eb','E','E#/F','F#','G','G#/Ab','A','A#/Bb','B','B#/C','C#'];
const eb_major = ['Eb','E/Fb','F','F#/Gb','G','Ab','A/Bbb','Bb','B/Cb','C','C#/Db','D'];
const a_major = ['A','A#/Bb','B','B#/C','C#','D','D#/Eb','E','E#/F','F#','Fx/G','G#'];
const ab_major = ['Ab','A/Bbb','Bb','B/Cb','C','Db','D/Ebb','Eb','E/Fb','F','F#/Gb','G'];
const e_major = ['E','E#/F','F#','Fx/G','G#','A','A#/Bb','B','B#/C','C#','Cx/D','D#'];
const db_major = ['Db','D/Ebb','Eb','E/Fb','F','Gb','G/Abb','Ab','A/Bbb','Bb','B/Cb','C'];
const b_major = ['B','B#/C','C#','Cx/D','D#','E','E#/F','F#','Fx/G','G#','Gx/A','A#'];
const gb_major = ['Gb','G/Abb','Ab','A/Bbb','Bb','Cb','C/Dbb','Db','D/Ebb','Eb','E/Fb','F'];
const fs_major = ['F#','Fx/G','G#','Gx/A','A#','B','B#/C','C#','Cx/D','D#','Dx/E','E#'];
const cb_major = ['Cb','C/Dbb','Db','D/Ebb','Eb','Fb','F/Gbb','Gb','G/Abb','Ab','A/Bbb','Bb'];
const cs_major = ['C#','Cx/D','D#','Dx/E','E#','F#','Fx/G','G#','Gx/A','A#','Ax/B','B#'];

const a_minor = ['A','A#/Bb','B','C','C#','D','D#/Eb','E','F','F#','G','G#'];
const d_minor = ['D','D#/Eb','E','F','F#','G','G#/Ab','A','Bb','B','C','C#'];
const g_minor = ['G','G#/Ab','A','Bb','B','C','C#/Db','D','Eb','E','F','F#'];
const c_minor = ['C','C#/Db','D','Eb','E','F','F#/Gb','G','Ab','A','Bb','B'];
const f_minor = ['F','F#/Gb','G','Ab','A','Bb','B/Cb','C','Db','D','Eb','E'];
const bb_minor = ['Bb','B/Cb','C','Db','D','Eb','E/Fb','F','Gb','G','Ab','A'];
const eb_minor = ['Eb','E/Fb','F','Gb','G','Ab','A/Bbb','Bb','Cb','C','Db','D'];
const ab_minor = ['Ab','A/Bbb','Bb','Cb','C','Db','D/Ebb','Eb','Fb','F','Gb','G'];

const e_minor = ['E','E#/F','F#','G','G#','A','A#/Bb','B','C','C#','D','D#'];
const b_minor = ['B','B#/C','C#','D','D#','E','E#/F','F#','G','G#','A','A#'];
const fs_minor = ['F#','Fx/G','G#','A','A#','B','B#/C','C#','D','D#','E','E#'];
const cs_minor = ['C#','Cx/D','D#','E','E#','F#','Fx/G','G#','A','A#','B','B#'];
const gs_minor = ['G#','Gx/A','A#','B','B#','C#','Cx/D','D#','E','E#','F#','Fx'];
const ds_minor = ['D#','Dx/E','E#','F#','Fx/G','G#','Gx/A','A#','B','B#','C#','Cx'];
const as_minor = ['A#','B','B#','C#','Cx/D','D#','Dx/E','E#','F#','Fx/G','G#','Gx'];


var rootToScale = {
    'C': c_major,
    'F': f_major,
    'G': g_major,
    'Bb': bb_major,
    'D': d_major,
    'Eb': eb_major,
    'A': a_major,
    'Ab': ab_major,
    'E': e_major,
    'Db': db_major,
    'B': b_major,
    'G#': gb_major,
    'F#': fs_major,
    'Cb': cb_major,
    'C#': cs_major,
    'Am': a_minor,
    'Dm': d_minor,
    'Gm': g_minor,
    'Cm': c_minor,
    'Fm': f_minor,
    'Bbm': bb_minor,
    'Ebm': eb_minor,
    'Abm': ab_minor,
    'Em': e_minor,
    'Bm': b_minor,
    'F#m': fs_minor,
    'C#m': cs_minor,
    'G#m': gs_minor,
    'D#m': ds_minor,
    'A#m': as_minor,
}

var keyToScale = {
    'c \\major': c_major,
    'f \\major': f_major,
    'g \\major': g_major,
    'bes \\major': bb_major,
    'd \\major': d_major,
    'ees \\major': eb_major,
    'a \\major': a_major,
    'aes \\major': ab_major,
    'e \\major': e_major,
    'des \\major': db_major,
    'b \\major': b_major,
    'ges \\major': gb_major,
    'fis \\major': fs_major,
    'ces \\major': cb_major,
    'cis \\major': cs_major,
    'a \\minor': a_minor,
    'd \\minor': d_minor,
    'g \\minor': g_minor,
    'c \\minor': c_minor,
    'f \\minor': f_minor,
    'bes \\minor': bb_minor,
    'ees \\minor': eb_minor,
    'aes \\minor': ab_minor,
    'e \\minor': e_minor,
    'b \\minor': b_minor,
    'fis \\minor': fs_minor,
    'cis \\minor': cs_minor,
    'gis \\minor': gs_minor,
    'dis \\minor': ds_minor,
    'ais \\minor': as_minor,
}

var rootToKey = {
    'C': 'c \\major',
    'F': 'f \\major',
    'G': 'g \\major',
    'Bb': 'bes \\major',
    'D': 'd \\major',
    'Eb': 'ees \\major',
    'A': 'a \\major',
    'Ab': 'aes \\major',
    'E': 'e \\major',
    'Db': 'des \\major',
    'B': 'b \\major',
    'Gb': 'ges \\major',
    'F#': 'fis \\major',
    'Cb': 'ces \\major',
    'C#': 'cis \\major',
    'Am': 'a \\minor',
    'Dm': 'd \\minor',
    'Gm': 'g \\minor',
    'Cm': 'c \\minor',
    'Fm': 'f \\minor',
    'Bbm': 'bes \\minor',
    'Ebm': 'ees \\minor',
    'Abm': 'aes \\minor',
    'Em': 'e \\minor',
    'Bm': 'b \\minor',
    'F#m': 'fis \\minor',
    'C#m': 'cis \\minor',
    'G#m': 'gis \\minor',
    'D#m': 'dis \\minor',
    'A#m': 'ais \\minor',
}

var keyToRoot = {
    'c \\major': 'C',
    'f \\major': 'F',
    'g \\major': 'G',
    'bes \\major': 'Bb',
    'd \\major': 'D',
    'ees \\major': 'Eb',
    'a \\major': 'A',
    'aes \\major': 'Ab',
    'e \\major': 'E',
    'des \\major': 'Db',
    'b \\major': 'B',
    'ges \\major': 'Gb',
    'fis \\major': 'F#',
    'ces \\major': 'Cb',
    'cis \\major': 'C#',
    'a \\minor': 'A',
    'd \\minor': 'D',
    'g \\minor': 'G',
    'c \\minor': 'C',
    'f \\minor': 'F',
    'bes \\minor': 'Bb',
    'ees \\minor': 'Eb',
    'aes \\minor': 'Ab',
    'e \\minor': 'E',
    'b \\minor': 'B',
    'fis \\minor': 'F#',
    'cis \\minor': 'C#',
    'gis \\minor': 'G#',
    'dis \\minor': 'D#',
    'ais \\minor': 'A#',
}


var lilyDurationToNumber = {
    "1." : 144, 
    "1" : 96, 
    "2..": 84,
    "2.": 72, 
    "2" : 48,  
    "2t" : 32,
    "4..": 42,
    "4.": 36, 
    "4" : 24,  
    "4t" : 16,
    "8.": 18, 
    "8": 12,  
    "8t" : 8,
    "16.": 9, 
    "16": 6,  
    "16t" : 4,
    "32.": 4.5, 
    "32": 3,
    "64.": 2.25, 
    "64": 1.5,

    // tied notes
    "1~1": 192,
    "1~2.": 96+72,
    "1~2": 96+48,
    "1~4": 96+24,
    "1~8": 96+12,
    "2.~4": 96,
    "2~2": 96,
    "2~4": 48+24,
    "2~8": 48+12,
    "4~2": 24+48,
    "4~4": 48,
    "4~8.": 42,
    "4~8": 36,
    "4~16": 30,
    "8~2": 60,
    "8~4": 36,
    "8~8": 24,
    "8~16": 18
}

var numberToLilyDuration = {
    144: "1.",
    96: "1",
    84: "2..",
    72: "2.",
    48: "2",
    32: "2t",
    42: "4..",
    36: "4.",
    24: "4",
    16: "4t",
    18: "8.",
    12: "8",
    8: "8t",
    9: "16.",
    6: "16", 
    4: "16t",
    4.5: "32.",
    3: "32",
    2.25: "64.",
    1.5: "64"

/*------ TODO ------------
    // tied notes
    "1~1": 192,
    "1~2.": 96+72,
    "1~2": 96+48,
    "1~4": 96+24,
    "1~8": 96+12,
    "2~2": 96,
    "2~4": 48+24,
    "2~8": 48+12,
    "4~2": 24+48,
    "4~4": 48,
    "4~8": 36,
    "4~16": 30,
    "8~2": 60,
    "8~4": 36,
    "8~8": 24,
    "8~16": 18
//------------------------*/

}    

/*--------------------------------------
function keyToScale(key){
    console.log(key+"::key")
    var keyScale = [];
    if(key == 'c \\major'){
        keyScale = c_major.slice();
    } else if(key == 'f \\major'){
        keyScale = f_major.slice();
    } else if(key == 'g \\major'){
        keyScale = g_major.slice();
    } else if(key == 'bes \\major'){
        keyScale = bb_major.slice();
    } else if(key == 'd \\major'){
        keyScale = d_major.slice();
    } else if(key == 'ees \\major'){
        keyScale = eb_major.slice();
    } else if(key == 'a \\major'){
        keyScale = a_major.slice();
    } else if(key == 'aes \\major'){
        keyScale = ab_major.slice();
    } else if(key == 'e \\major'){
        keyScale = e_major.slice();
    } else if(key == 'des \\major'){
        keyScale = db_major.slice();
    } else if(key == 'b \\major'){
        keyScale = b_major.slice();
    } else if(key == 'ges \\major'){
        keyScale = gb_major.slice();
    } else if(key == 'fis \\major'){
        keyScale = fs_major.slice();
    } else if(key == 'ces \\major'){
        keyScale = cb_major.slice();
    } else if(key == 'cis \\major'){
        keyScale = cs_major.slice();
    }
    console.log("keyScale="+keyScale);
    return keyScale;
}
//-------------------------------------*/

const numToMajorKeyRomanNumeral = {
    0: "I", 1: "#i/bII", 2: "ii", 3: "#ii/bIII", 4: "iii", 5: "IV", 6: "#IV/bV",
    7: "V", 8: "#V/bVI", 9: "vi", 10: "#vi/bVII", 11: "vii"
}

const numToMinorKeyRomanNumeral = {
    0: "i", 1: "#i/bII", 2: "ii", 3: "bIII", 4: "iii", 5: "iv", 6: "#IV/bV",
    7: "V", 8: "bVI", 9: "vi", 10: "bVII", 11: "vii"
}

function calcRomanNumeral(key, root){
    if(root.includes('r')){
        return "";
    }
    let enharmonicChoice = -1;
    // trim spaces from the end of the key string
    var myKey = key.trimEnd();
//    console.log("myKey="+myKey+ " root="+root);
    // get the key's scale
    let myScale = keyToScale[myKey];
//    console.log('myScale='+myScale+' root='+root);
    let rootIndex = -1;
    let len = myScale.length;
    for(let i=0; i<len; i++){
        if(myScale[i] == root){
            rootIndex = i;
        } 
    }
    if(rootIndex == -1){ // not found yet, must be a chromatic note
        for(let i=0; i<len; i++){
            if( myScale[i].includes("/") && myScale[i].includes(root) ){
                rootIndex = i;
                let twoNotes = myScale[i];
                let enharmonic = twoNotes.split('/');
//                console.log('root='+root+' rootIndex='+rootIndex+' enharmonic='+enharmonic);
                if(root == enharmonic[0]){
                    enharmonicChoice = 0;
                    break;
                }else if(root == enharmonic[1]){
                    enharmonicChoice = 1;
                    break;
                } 
            }
        }         
    }
    // check for major/minor key
    let romanNumeral = '';
    if(myKey.includes('major')){
        romanNumeral = numToMajorKeyRomanNumeral[rootIndex];
    } else if(myKey.includes('minor')){
        romanNumeral = numToMinorKeyRomanNumeral[rootIndex];
    }
//    console.log('rootIndex='+rootIndex);

    // trap undefined and return '' instead of error i.e. Chorale 267
    if(romanNumeral == undefined) { 
        console.log('romanNumeral is undefined!');
        return '';
    }

    // if it's a chromatic note, deal with it here
    if( romanNumeral.includes('/') ){ 
//        console.log('romanNumeral='+romanNumeral)
        // choose (from calc above) the correct enharmonic related Roman Numeral 
        let twoRomanNumerals = romanNumeral.split('/');
        return twoRomanNumerals[enharmonicChoice];
    }

    // regular diatonic 
    return romanNumeral;
}


//-------------- not yet implemented -------------------------
function getPitchAtThisLocation(melody, location) {
    var melodyGrid = MelodyToPitchGrid(melody);
    
    // this function isn't implemented yet
    var index = translateLocationtoGridIndex(location);
    return melodyGrid[index];
}

// this function isn't implemented yet
function translateLocationtoGridIndex(locationInScore, gridWidth) {
    var thisGridWidth = gridWidth? gridWidth: defaultGridValue;
    
}
//---------------------------------------------------------------*/
// parameters:
// score = SATB lilypond arrays, arranged [ [S,,,],[A,,,],[T,,,],[B,,,] ]
// phraseLocations = array of duration numbers returned by FindPhrases()
//
// returns 3D array[ [[],[]...], [[],[]...], [[],[]...], [[],[]...] ]
// useage:
// phraseLocations = findPhrases(lilyPondBass);
// phrases = divideScoreIntoPhrases(SATBlilypond, phraseLocations);
// phrases[0][1] = the soprano part of phrase index 1 (second phrase)
// phrases[1][1] = the alto part of phrase index 1 (second phrase)
// phrases[2][1] = the tenor part of phrase index 1 (second phrase)
// phrases[3][1] = the bass part of phrase index 1 (second phrase)
function divideScoreIntoPhrases(score, phraseLocations){
    const validNotes = ['a','b','c','d','e','f','g','r'];
    let first_note = false;
//    let is_a_note = false;
    let myMarker = 'fermata';
    let arrayS = [];
    let arrayA = [];
    let arrayT = [];
    let arrayB = [];
    let phraseScore = [];
    let phraseScoreS = [];
    let phraseScoreA = [];
    let phraseScoreT = [];
    let phraseScoreB = [];
    let phraseIndex = 0;
    let stopLocation = 0;
    let current_duration = 0;
    let last_duration = 0;
    let lilyDuration = '';
    let runningTotal = 0;
    let trimmedLily = '';
    let noteTokens = [];
    let scoreAbsoluteOctaves = [];
    let noteIndex = 0;
    let noteAfterFermata = false;
    let indexOfFermataAlto = 0;
    let indexOfFermataTenor = 0;

    // loop through the SATB parts and divide them according to the 
    // phraseLocation parameter data
    for(let i= 0; i<4; i++){  
        trimmedLily = score[i].trim();
        trimmedLily = relativeToAbsolute(trimmedLily);
        noteTokens = trimmedLily.split(/\s+/g); // split at white space
        phraseIndex = 0;
        runningTotal = 0;
        first_note = false;
        stopLocation = phraseLocations[phraseIndex][1];
        absoluteOctaveCode = '';
        noteIndex = 0;
        noteAfterFermata = false;
        noteTokens.forEach( (element, index) => {
            // check if it is a note
            if(element == "{") {
                first_note = true;
            }
            let is_a_note = validNotes.includes(element[0]);
            // if it's not a note or the opening "{" hasn't been read
            if(is_a_note === false || !first_note) { 
                // copy into array without examining the element
                if(i==0){ arrayS.push(element); }
                if(i==1){ arrayA.push(element); }
                if(i==2){ arrayT.push(element); }
                if(i==3){ arrayB.push(element); }
                absoluteOctaveCode += " " + element;
            } else { // it is a note, decipher it
                noteIndex++;
                // check the marker
                if (element.includes(myMarker)) {
                    elements = element.split('\\');
                    note = elements[0];
                    current_duration = noteToNumber(note);
//-------------------------
                } else if(i == 1 && noteAfterFermata && (index > indexOfFermataAlto) ){
                    // be sure this has a duration number if not add one
                    note = element;
                    if(note.includes('~')){
                        lilyDuration = processTiedNote(note);
                    } else {
                        lilyDuration = getLilyDuration(note);
                    }
                    current_duration = noteToNumber(note);
                    noteAfterFermata = false;
                    if(current_duration == 0){
                        let lilyDur = numberToLilyDuration[last_duration];
                        note = note + lilyDur;
                        element = note;
                    }
//                    console.log('updated alto note='+note);
                } else if(i == 2 && noteAfterFermata && (index > indexOfFermataTenor) ){
                    // be sure this has a duration number if not add one
                    note = element;
                    if(note.includes('~')){
                        lilyDuration = processTiedNote(note);
                    } else {
                        lilyDuration = getLilyDuration(note);
                    }
                    current_duration = noteToNumber(note);
                    noteAfterFermata = false;
                    if(current_duration == 0){
                        let lilyDur = numberToLilyDuration[last_duration];
                        note = note + lilyDur;
                        element = note;
                    }
//-------------------------*/
                } else {
                    note = element;
                    current_duration = noteToNumber(note);
                }
                if(i==0){ arrayS.push(element);  }
                if(i==1){ arrayA.push(element);  }
                if(i==2){ arrayT.push(element); }
                if(i==3){ arrayB.push(element); }

                current_duration = current_duration? current_duration: last_duration;
                last_duration = current_duration;
                runningTotal = runningTotal + current_duration;
                if(runningTotal == stopLocation){
                    if(i==0){ // soprano
                        arrayS.push(' \\bar "|." }');
                        phraseScoreS.push(arrayS.join(' ')); 
                        arrayS = [];
                        arrayS.push("{ ");
//                        arrayS.push(absoluteOctaveCode)
                    }
                    if(i==1){ // alto
                        arrayA.push(' \\bar "|." }');
                        phraseScoreA.push(arrayA.join(' ')); 
                        arrayA = [];
                        arrayA.push("{ ");
//                        arrayA.push(absoluteOctaveCode);
                        indexOfFermataAlto = index;
                        noteAfterFermata = true;
                    }
                    if(i==2){ // tenor
                        arrayT.push(' \\bar "|." }');
                        phraseScoreT.push(arrayT.join(' ')); 
                        arrayT = [];
                        arrayT.push("{ ");
//                        arrayT.push(absoluteOctaveCode)
                        indexOfFermataTenor = index;
                        noteAfterFermata = true;
                    }
                    if(i==3){ // bass
                        arrayB.push(' \\bar "|." }');
                        phraseScoreB.push(arrayB.join(' ')); 
                        arrayB = [];
                        arrayB.push("{ ");
//                        arrayB.push(absoluteOctaveCode)
                    }
                    // check if we go around again
                    if(phraseIndex < phraseLocations.length-1){
                        phraseIndex++;
                    }
                    // new stop sign for next time around
                    stopLocation = phraseLocations[phraseIndex][1];
                }                
            }
        });
    }

    // gather the SATB for each phrase and put them into a single array
    let numOfPhrases = phraseScoreS.length;
    let onePhraseScore = [];

    // move through the phrases and gather SATB for each phrase
    // for use as a short example i.e. harmony class lessons
    for(let i=0; i<numOfPhrases; i++){
        onePhraseScore = [];
        onePhraseScore.push(phraseScoreS[i]);
        onePhraseScore.push(phraseScoreA[i]);
        onePhraseScore.push(phraseScoreT[i]);
        onePhraseScore.push(phraseScoreB[i]);
        phraseScore.push(onePhraseScore);
    }
    return phraseScore;
    
}

// this changes lilypond durations into a number for counting purposes
function noteToNumber(note){
    let possible_duration = 0;
    let myNote = note;
    let current_duration = 0;
    // look for tied notes
    if(note.includes('~')) {
        myNote = processTiedNote(myNote);
        possible_duration = lilyDurationToNumber[myNote];
        if(possible_duration) {
            current_duration = possible_duration;
        }
    } else {
        // decipher duration             
        possible_duration = lilyNoteToNumber(myNote);
        if(possible_duration) {
            current_duration = possible_duration;
        }
    }
    return current_duration;
}

//------------------------------------------------------------------
// this finds the fermata in the chorale and builds an array of that info
function findPhrases(lilyCode, marker) {
    var myMarker = marker? marker: 'fermata';
    var trimmedLily = lilyCode.trim();
    var noteTokens = trimmedLily.split(/\s+/g); // split at white space
    var phrases_start_end = [];
    var one_phrase = [];
//    var one_phrase_str = '';
    var last_location = 0;
    var this_location = 0;
    var runningTotal = 0;
    var current_duration = 0;
    var last_duration = 0;
    var note = '';
    var elements = [];
    var is_a_note = false;
    var validNotes = ['a','b','c','d','e','f','g','r'];
    var first_note = false;
    
    noteTokens.forEach( (element, index) => {
        // check if it is a note
        if(element == "{") {
            first_note = true;
        }
        var is_a_note = validNotes.includes(element[0]);
        if(is_a_note === false || !first_note) { 
            ; // continue
        } else {
            if (element.includes(myMarker)) {
//                console.log('fermata found at index='+index);
                elements = element.split('\\');
                note = elements[0];
                current_duration = noteToNumber(note);
                current_duration = current_duration? current_duration: last_duration;
                last_duration = current_duration;
                runningTotal = runningTotal + current_duration;
                this_location = runningTotal;
                one_phrase = [last_location, this_location];
                phrases_start_end.push(one_phrase);
                last_location = this_location;
                one_phrase = [];
            } else {
                note = element;
                current_duration = noteToNumber(note);
                current_duration = current_duration? current_duration: last_duration;
                last_duration = current_duration;
                runningTotal = runningTotal + current_duration;
            }
        }        
    });
    return phrases_start_end;
}

// this take a tied note in lilypond and removes the pitch 
// it returns just the durations tied together
function processTiedNote(tiedNote) {
    var notes = tiedNote.split('~');
    var len = notes.length;
    var myLilynote;
    var lilyDuration;
    var lilyArray = [];
    for(var i=0; i<len; i++) {
        myLilynote = notes[i];

        // chop off the pitch to get the lily duration
        if( myLilynote.includes('eses') || myLilynote.includes('isis') ) {
            lilyDuration = myLilynote.slice(5);    
        } else if( myLilynote.includes('es') || myLilynote.includes('is') ) {
            lilyDuration = myLilynote.slice(3);
        } else {
            lilyDuration = myLilynote.slice(1);        
        }
        if( lilyDuration.includes("''") || lilyDuration.includes(",,") ) {
            lilyDuration = lilyDuration.slice(2);            
        } else if(lilyDuration.includes("'") || lilyDuration.includes(",") ) {
            lilyDuration = lilyDuration.slice(1);            
        }
        lilyArray.push(lilyDuration);
    }
    return lilyArray.join('~');
}

function lilyNoteToNumber(lilynote) {
    var lilyDuration;
    var durationNumber;
    var myLilynote = lilynote.slice();
    // chop off the pitch to get the lily duration
    if( myLilynote.includes('eses') || myLilynote.includes('isis') ) {
        lilyDuration = myLilynote.slice(5);    
    } else if( myLilynote.includes('es') || myLilynote.includes('is') ) {
        lilyDuration = myLilynote.slice(3);
    } else {
        lilyDuration = myLilynote.slice(1);        
    }
    if( lilyDuration.includes("''") || lilyDuration.includes(",,") ) {
        lilyDuration = lilyDuration.slice(2);            
    } else if(lilyDuration.includes("'") || lilyDuration.includes(",") ) {
        lilyDuration = lilyDuration.slice(1);            
    } else if(lilyDuration.includes("'''") || lilyDuration.includes(",,,") ) {
        lilyDuration = lilyDuration.slice(3);            
    }
    durationNumber = lilyDurationToNumber[lilyDuration];
    return durationNumber;
}


const lilyOctaveToToneOctave = {

}


// convert from lilypond relative notation to absolute octave notation
function relativeToAbsolute(relativeLilyCode){
    const myMarker = 'fermata';
    let absoluteLilyCode = "";
    let relativeLilyOctave = '';
    let noteLilyOctave = '';
    let octaveNumber = -1;
    let startingOctaveNumber = -1;
    let octaveChange = 0;
    let absoluteOctave = '';
    let note = '';
    let oneLilyNoteToken = '';
    let durationLily = '';
    let prevPitchLily = '';
    let octaveMarkIndex;
    let trimmedLily = relativeLilyCode.trim();
    let noteTokens = trimmedLily.split(/\s+/g); // split at white space
    let is_a_note = false;
    let validNotes = ['a','b','c','d','e','f','g','r'];
    let musicAlphabet = ['a','b','c','d','e','f','g'];
    let myMusicAlphabet = [];
    let first_note = false;
    let elements = [];
    let hasFermata = false;
    let howManyTiedNotes = 0;
    let lastDuration = '';
    let indexOfNoteAfterFermata = 0;

    noteTokens.forEach( (element, index) => {
        hasFermata = false;
        // use the relative tag AND first note to calc the first absolute octave mark
        if(element.includes("relative")){
            // next token will be initial octave mark i.e. c'
            octaveMarkIndex = index+1;
//            absoluteLilyCode += element; 
            return;
        }
        if(octaveMarkIndex == index){
            // start off with the relative octave value
            prevPitchLily = element;
            // strip off the 'c'
            relativeLilyOctave = element.slice(1);
            startingOctaveNumber = lilyOctaveToOctaveNumber[relativeLilyOctave];
            octaveNumber = startingOctaveNumber;
            return;
        }
        // analyze each note to determine if a different octave mark is needed
        // (new octaves start at letter c) 
        if(element == "{") {
//            absoluteLilyCode += element + ' '; 
            first_note = true;
        }
        // check the first char for a-g i.e. is a note
        is_a_note = validNotes.includes(element[0]);
        if(is_a_note === false || !first_note) { 
            // non-note stuff before the first note, 
            // markup or whatever
            absoluteLilyCode += element + ' '; 
            return; // works like continue in a for loop
        } else if(is_a_note === false){ 
            // stuff after the first note but non-note
            // bar lines , markup etc
            absoluteLilyCode += element + ' '; 
            return; // works like continue in a for loop
        }

        // below here are notes ----------
        if (element.includes(myMarker)) {
            elements = element.split('\\');
            note = elements[0];
            hasFermata = true; // put the fermata back in later
            indexOfNoteAfterFermata = index+1;
        } else if(element.includes('r')) { // if it's a rest don't process octave any octave marks
            absoluteLilyCode += element + ' '; 
            return; // works like continue in a for loop            
        } else {
            note = element;
        }        

//        if(note.includes('r')){
//            console.log('note='+note);
//        }

        // Check if the relative code note has an octave mark
        noteLilyOctave = getLilyOctave(note);
        octaveChange = lilyOctaveToOctaveChange[noteLilyOctave];
        octaveNumber = octaveNumber + octaveChange;
        octaveChange = 0; // reset
        pitchLily = getLilyPitch(note);

        // analyze interval from previous note to determine if the note
        // is ascending or descending
        // IF (ascending AND crossing or landing on C), add 1 to octaveNumber
        // IF (descending AND crossing C), subtract 1 from octaveNumber
        myMusicAlphabet = makeMyMusicAlphabet(musicAlphabet, prevPitchLily);
        octaveChange = checkForCrossingOctaveBoundary(myMusicAlphabet, pitchLily);
        octaveNumber += octaveChange;
        absoluteOctave = octaveToLilyOctave[octaveNumber];
        durationLily = getLilyDuration(note);
        if(durationLily){
            lastDuration = durationLily;
        }

        // make an absolute octave version of the element

        // check for tied notes 
        if(note.includes('~')){
            elements = note.split('~'); 
            howManyTiedNotes = elements.length;
            oneLilyNoteToken = '';

            for(let i=0; i<howManyTiedNotes; i++){
                oneLilyNoteToken += pitchLily;
                oneLilyNoteToken += absoluteOctave;
                durationLily = getLilyDuration(elements[i])
                if(index == indexOfNoteAfterFermata && durationLily.trim() == ''){
                    oneLilyNoteToken += lastDuration;
                    console.log('tied note='+note+'\noneLilyNoteToken='+oneLilyNoteToken+'\nlastDuration='+lastDuration+'\ndurationLily='+durationLily)
                } else {
                    oneLilyNoteToken += durationLily;
                }
                if(i < howManyTiedNotes-1){
                    oneLilyNoteToken += '~';
                } 
            }
        } else { // regular untied notes
            oneLilyNoteToken = pitchLily;
            oneLilyNoteToken += absoluteOctave;
            oneLilyNoteToken += durationLily;
            if(index == indexOfNoteAfterFermata && durationLily.trim() == ''){
                oneLilyNoteToken += lastDuration;
            }
        }
        if(hasFermata){
            oneLilyNoteToken += "\\fermata ";
        }
        absoluteLilyCode += oneLilyNoteToken + " ";
        // if the note isn't a rest update prevPitchLily
        if( !pitchLily.includes('r') ){
            prevPitchLily = pitchLily;
        }
    });
    return absoluteLilyCode;   
}

// musicAlphabet had previous pitchletter at index 3
function checkForCrossingOctaveBoundary(musicAlphabet, lilyPitch){
    if(lilyPitch.includes('r')){
        return 0;
    }
    let indexOfB = 0;
    let indexOfC = 0;
    let indexOfNote = 0;
    // index 3 is the letter of the prevPitch
    let indexOfPrev = 3;
    let octaveChange = 0;
    let len = musicAlphabet.length;
    // find where C is
    for(let i=0; i<len; i++){
        if(musicAlphabet[i] == "b"){
            indexOfB = i;
        }
        if(musicAlphabet[i] == "c"){
            indexOfC = i;
        }
    }
    // find where lilyPitch is
    for(let i=0; i<len; i++){
        if(musicAlphabet[i] == lilyPitch[0]){
            indexOfNote = i;
        }
    }
    if(indexOfNote > indexOfPrev){
        // ascending
        if( (indexOfPrev < indexOfC)  && (indexOfC <= indexOfNote) ){
            // up: crossed or landed on C 
            octaveChange = 1;
}
    } else if(indexOfNote < indexOfPrev) {
        // descending
        if( (indexOfPrev >= indexOfC)  && (indexOfC > indexOfNote) ){
            // down: crossed  C
            octaveChange = -1;
}
    } else {
        octaveChange = 0;
    }
    return octaveChange;
}

// this function rearranges the musicAlphabet with the lilyPitch note in the middle
// using the index of this array helps calc when C is crossed from one
// note to the next
function makeMyMusicAlphabet(musicAlphabet, lilyPitch){
    let myMusicAlphabet = [];
    let len = musicAlphabet.length;
    let pitchIndex = 0;
    for(let i=0; i<len; i++){
        if( lilyPitch[0] == musicAlphabet[i] ){
            pitchIndex = i;
            break;
        }
    }
    // pitchIndex is the lilyPitch letter, we want to start +4 positions later
    // using %len to wrap around to the beginning
    for(let i=0; i<len; i++){
        myMusicAlphabet.push(musicAlphabet[(i+(pitchIndex+4))%len]);
    }
    return myMusicAlphabet;
}

function getLilyDuration(aLilyNote){
    let lilyNote = aLilyNote;
    let lilyDuration = '';
    // strip off the pitch
    if(lilyNote.includes('eses') || lilyNote.includes('isis')){
        lilyNote = lilyNote.slice(5);
    } else if(lilyNote.includes('es') || lilyNote.includes('is')){
        lilyNote = lilyNote.slice(3);    
    } else {
        lilyNote = lilyNote.slice(1);
    }
    // strip off octave signs
    if(lilyNote.includes("'''") || lilyNote.includes(",,,")){
        lilyDuration = lilyNote.slice(3);
    } else if(lilyNote.includes("''") || lilyNote.includes(",,")){
        lilyDuration = lilyNote.slice(2);
    } else if(lilyNote.includes("'") || lilyNote.includes(",")){
        lilyDuration = lilyNote.slice(1);    
    } else {
        lilyDuration = lilyNote.slice();
    }
    return lilyDuration;
}

function getLilyPitch(aLilyNote){
    // strip off the pitch
    let lilyNote = aLilyNote;
    let lilyPitch = '';
    if(lilyNote.includes('eses') || lilyNote.includes('isis')){
        lilyPitch = lilyNote.slice(0,5);
    } else if(lilyNote.includes('es') || lilyNote.includes('is')){
        lilyPitch = lilyNote.slice(0,3);    
    } else {
        lilyPitch = lilyNote.slice(0,1);
    }
    return lilyPitch;

}
function getLilyOctave(aLilyNote){
    let lilyOctave = '';
    let lilyNote = aLilyNote;
    let elements = [];
    // check for tied note
    if(lilyNote.includes('~')){
        elements = lilyNote.split('~');
        lilyNote = elements[0];
    }
    // strip off the duration
    if(lilyNote.includes('16') || lilyNote.includes('32')){
        lilyNote = lilyNote.slice(0,lilyNote.length-2);
    } else if(lilyNote.includes('1.') || lilyNote.includes('2.') || 
            lilyNote.includes('4.') || lilyNote.includes('8.')) {
        lilyNote = lilyNote.slice(0,lilyNote.length-2);
    } else if(lilyNote.includes('1') || lilyNote.includes('2') || 
            lilyNote.includes('4') || lilyNote.includes('8')) { 
        lilyNote = lilyNote.slice(0,lilyNote.length-1);
    }

    // strip off the pitch
    if(lilyNote.includes('eses') || lilyNote.includes('isis')){
        lilyOctave = lilyNote.slice(5);
    } else if(lilyNote.includes('es') || lilyNote.includes('is')){
        lilyOctave = lilyNote.slice(3);    
    } else {
        lilyOctave = lilyNote.slice(1);
    }
    return lilyOctave;
}



var octaveToLilyOctave = {
    0: ",,,",
    1: ",,",
    2: ",",
    3: "",
    4: "'",
    5: "''",
    6: "'''",
    7: "''''",
    8: "'''''",        
}

var lilyOctaveToOctaveNumber = {
    ",,,": 0,
    ",,": 1,
    ",": 2,
    "": 3,
    "'": 4,
    "''": 5,
    "'''": 6,
    "''''": 7,
    "'''''": 8        
}

var lilyOctaveToOctaveChange = {
    ",,,": -3,
    ",,": -2,
    ",": -1,
    "": 0,
    "'": 1,
    "''": 2,
    "'''": 3,
    "''''": 4,
    "'''''": 5        
}


var lilyOffsetFromC = {
    'c': 0, 'cis': 0, 'ces': 0, 'cisis': 0,
    'd': 1, 'dis': 1, 'des': 1, 'disis': 1,
    'e': 2, 'eis': 2, 'ees': 2,
    'f': 3, 'fis': 3, 'fes': 3, 'fisis': 3,
    'g': 4, 'gis': 4, 'ges': 4, 'gisis': 4,
    'a': 5, 'ais': 5, 'aes': 5, 'aisis': 5,
    'b': 6, 'bis': 6, 'bes': 6
}

var lilyToTonePitch = {
    'c': 'C', 'cis': 'C#', 'ces': 'Cb', 'cisis': 'Cx',
    'd': 'D', 'dis': 'D#', 'des': 'Db', 'disis': 'Dx',
    'e': 'E', 'eis': 'E#', 'ees': 'Eb',
    'f': 'F', 'fis': 'F#', 'fes': 'Fb', 'fisis': 'Fx',
    'g': 'G', 'gis': 'G#', 'ges': 'Gb', 'gisis': 'Gx',
    'a': 'A', 'ais': 'A#', 'aes': 'Ab', 'aisis': 'Ax',
    'b': 'B', 'bis': 'B#', 'bes': 'Bb'
}

//----------------- new code ---------------------------

// this aggregates the notes of a phrase and orders them
// using the last bass note of the phrase as the first 
// note of the scale.
// lilynotes = array[4] SATB parts of the phrase
// 
function makeScaleFromPhraseNotes(lilynotes){
//    let bassLen = lilynotes[3].length;
    let bassNote = '';
    let phraseScale = [];
    let sortedPhraseScale = [];
    let notes = '';
    let is_a_note = false;
    let noteTokens = [];
    let foundIndex = -1;
    let lilyPitch = '';
    let myMusicAlphabet = [];
    let validNotes = ['a','b','c','d','e','f','g'];
    // now go through all of the parts and add letter names not
    // already included to the phraseScale
    for(let i=0; i<4; i++){
//        console.log('i='+i+' lilynotes['+i+']='+lilynotes[i]);
        notes = lilynotes[i];
        notes = notes.trim();
        noteTokens = notes.split(/\s+/g); // split at white space
        noteTokens.forEach( (element, index) => {
            // check if this is a note
            is_a_note = validNotes.includes(element[0]);
            if(is_a_note) {
                lilyPitch = getLilyPitch(element);
                if(i==3){
                    bassNote = lilyPitch;
                }
            }
        
            // check if this pitch is already added
            // if not there add using phraseScale.push()
            if( !phraseScale.includes(lilyPitch) ){
                phraseScale.push(lilyPitch);
            }
        });
    }
    // make myMusicalAlphabet starting with bassNote
    for(let i=0; i<7; i++){
        if( bassNote[0] == validNotes[i] ){
            foundIndex = i;
        }
    }
    myMusicAlphabet.push(validNotes[foundIndex]);
    for(let i=1; i<7; i++){
        myMusicAlphabet.push(validNotes[(foundIndex+i)%7]);
    }
    // alphabetical sort the list using the first note as a starting point
    let len = phraseScale.length;
    for(let i=0; i<7; i++){
        for(let j=0; j<len; j++){
            if( phraseScale[j][0] == myMusicAlphabet[i] ){
                sortedPhraseScale.push(phraseScale[j]);
            }
        }
    }
//    console.log('phraseScale='+sortedPhraseScale);
    return sortedPhraseScale
} 

// loadChordArray(lilynotes)
// 
/*------------------------------------------------------
// new version of aChordContext
//  aChordContext object:
    {
      'bassNote': {  value: bass,  },  
      'chordQuality': {  value: chordQuality,  },  
      'root': {  value: root,  },  
      'fullName': {  value: chordName,  },  
      'thisChord': {  value: thisChord[],  },
      'localKey': {  value: '', // getLocalKey,  },
      'key': {    value: '', // getKey,  },
      'nonHarmonicTones': {  value: [],  },
      'prevChord2': {   value: '', // (oneChordContext),  },  
      'prevChord': {   value: '', // (oneChordContext),  },  
      'nextChord': {  value: '', // (oneChordContext),  },  
      'nextChord2': {  value: '', // (oneChordContext),  },  
      'location': {  value: '', // location  },  
      'isFermata': {  value: '', // location  }, 
      'meta': { value: '' // meta  } }
//--------------------------------------------------*/

// additional  are added to oneChordContext 
// so that chord progressions can be more easily detected.

//---------------------------------------------------------
// this turns the SATB parts into and array of chords objects
// param: lilynotes = array[4][ lilyCode ] SATB parts of the phrase
function loadChordArray(lilyNotes) {
    //------------------ start prep of data ---------------------------
        let myChordContexts = [];
        var index = getChoraleIndex();
        var pickup = getMetaPickup(BachChorales[index].meta);
        var timeSig = getMetaTimeSignature(BachChorales[index].meta);
        var key = getMetaKey(BachChorales[index].meta);
        const lily_soprano = lilyNotes[0];
        const lily_alto = lilyNotes[1];
        const lily_tenor = lilyNotes[2];
        const lily_bass = lilyNotes[3];
        
        const gridWidth = getGridWidth(lily_soprano, lily_alto, lily_tenor, lily_bass);
        const sopranoMelodyGrid = MelodyToPitchGrid(lily_soprano, gridWidth);
        const altoMelodyGrid = MelodyToPitchGrid(lily_alto, gridWidth);
        const tenorMelodyGrid = MelodyToPitchGrid(lily_tenor, gridWidth);
        const bassMelodyGrid = MelodyToPitchGrid(lily_bass, gridWidth);
        
        var len = bassMelodyGrid.length;
        if(sopranoMelodyGrid.length != len || altoMelodyGrid.length != len || tenorMelodyGrid.length != len) {
            var msg = 'grid array length error: ';
            if(sopranoMelodyGrid.length > len) {
                msg += 'soprano longer than bass';
            } else if(sopranoMelodyGrid.length < len) {
                msg += 'soprano shorter than bass';        
            } else if(altoMelodyGrid.length > len) {
                msg += 'alto longer than bass';        
            } else if(altoMelodyGrid.length < len) {
                msg += 'alto shorter than bass';        
            } else if(tenorMelodyGrid.length > len) {
                msg += 'tenor longer than bass';        
            } else if(tenorMelodyGrid.length < len) {
                msg += 'tenor shorter than bass';        
            }
            alert(msg);
        }
        // compress the grid arrays into desired size
        // 24 = quarter note 12 = eighth note
        var harmonyGridSize = getHarmonyGridSize();
        const compressFactor = harmonyGridSize / gridWidth;
        const sopranoGrid = compressArray(sopranoMelodyGrid, compressFactor);
        const altoGrid = compressArray(altoMelodyGrid, compressFactor);
        const tenorGrid = compressArray(tenorMelodyGrid, compressFactor);
        const bassGrid = compressArray(bassMelodyGrid, compressFactor);
        
        var melodyGrids = [];
    
        melodyGrids.push(sopranoGrid);
        melodyGrids.push(altoGrid);
        melodyGrids.push(tenorGrid);
        melodyGrids.push(bassGrid);
        var chordGrid = createChordGrid(melodyGrids);
    
    // chordGrid is an array of small arrays
    // containing the simultaneous notes per quarter note (gridWidth)
    // some of the chord array member may be subarrays of faster note values
    //--------------------- end data prep ------------------------------
    
    
        var root, name, bass, chordName, oldChordName;
        let chordQuality;
        var objectIsCreated = false;
        var nameWithTags, oneMsg;
        var gridCounter = 0;
        var pickupCounter = 0;
    //    var measureLength = 24;
        timeSig = timeSig.trim();
        var measureLength = timeSigToTicks[timeSig];
        var pickupLength = gridWidth * getPickupNumGrids(pickup, gridWidth);
        var sameChordTags = '';
        var chordProgression = [];
    
        // start lilypond code ---------------------------
//        var rNumeralsLilyPond = 'romanNums = \\lyricmode {\n';
//        var chordsLilyPond = 'harmonies = \\chordmode {\n  ';
    
        var chordNameLilyPond = '';
        var rNumLilyPond = '';
        var prevRNumLilyPond = '';
        var currRNumLilyPond = '';
    
        var msg = 'chordGrid='
        var newBarline = false;
        var chordObject;
        var thisChord;
        var figuredBass;
        var chordsLength = chordGrid.length;
        chordGrid.forEach( (chord, index) => {
            rNumLilyPond = '';
            gridCounter += harmonyGridSize;
            pickupCounter += harmonyGridSize;
    //        gridCounter += gridWidth;
    //        pickupCounter += gridWidth;
            oneMsg = '\n\n' + chord;
            
    //--------------------------------------------
            // new format will need each chord to be resolved into a single-level array
            // i.e. the subarray member needs to resolve to the single chord tone to 
            // work with the other notes of the chord 
    
            if(containsSubarraysOrObjects(chord) ) {
                chordObject = resolveMovingVoiceChord(chord);
                thisChord = chordObject.thisChord.slice();
                // add to global array for later detailed analysis
                chordObject = addChordProperties(chordObject, index, chordsLength);
                myChordContexts.push(chordObject);
                objectIsCreated = true;
            } else {
                thisChord = chord.slice();
                objectIsCreated = false;
            }
    //----------------------------------------------*/    
            root = getChordRoot(thisChord);
            name = getChordName(thisChord);
            chordQuality = getChordName(thisChord);
            bass = getBassNote(thisChord);
                
            oneMsg += '\nchord: ';
    
            chordNameLilyPond = pitchToLilyPitch[root];
            chordNameLilyPond += '4:';
            currRomanNum = calcRomanNumeral(key,root);
    
            if(chordQuality == '(?)') {
                chordName = chordQuality;
                chordNameLilyPond = 's4';
//                rNumLilyPond = "\\markup { "; // start an empty rNum lyric
            } else {
                chordNameLilyPond += chordNameToLilyChordName[chordQuality];
                chordName = root + chordQuality;
            }
            if(root != bass) {
                if(chordNameLilyPond != 's4'){
                    chordNameLilyPond += '/' + pitchToLilyPitch[bass];
                }
                chordName += '/' + bass;
                figuredBass = makeFiguredBass(bass, chordQuality, root, chordName);
    //            if(figuredBass){
    //               rNumLilyPond += figuredBass;
    //            }
            } else {
                figuredBass = makeFiguredBass(bass, chordQuality, root, chordName);
    //            if(figuredBass){
    //               rNumLilyPond += figuredBass;
    //            }
            }
    
            if(!objectIsCreated) {
//                let aChordObject = new aChordContext(bass, name, root, chordName, thisChord);
                let aChordObject = makeAChordContext(bass, chordQuality, root, chordName, thisChord);
                aChordObject = addChordProperties(aChordObject, index, chordsLength);
                myChordContexts.push(aChordObject);
            }
        });
        //-------------------------------------------------
            //-------------------------------------------------
            //-------------------------------------------------


            /*---------------------------------------------------------------
            //---------------------------------------------------------------
            // below here is analysis, which will be run on
            // the phrase once the objects are fully loaded
            //-------------------------------------------------
            //-------------------------------------------------
            //-------------------------------------------------
            if( (chordQuality == "" || chordQuality == "7") && !currRomanNum.includes('b') ){
                currRomanNum = currRomanNum.toUpperCase();
    
                // can't use '#' symbols in markup text with lilypond, 
                // must change them to ^ (# is part of scheme language)
                if(currRomanNum.includes("#")){
                    console.log("currRomanNum="+currRomanNum);
                    let adjustedRNum = currRomanNum.replace("#","^");
                    currRNumLilyPond = adjustedRNum + ' ' + figuredBass;
                } else {
                    currRNumLilyPond = currRomanNum + ' ' + figuredBass;
                }
    //            console.log('name='+name + '\ncurrRomanNum='+currRomanNum);
            } else {
                // can't use '#' symbols in markup text with lilypond, 
                // must change them to ^ (# is part of scheme language)
                if(currRomanNum.includes("#")){
                    console.log("currRomanNum="+currRomanNum);
                    let adjustedRNum = currRomanNum.replace("#","^");
                    currRNumLilyPond = adjustedRNum + ' ' + figuredBass;
                } else {
                    currRNumLilyPond = currRomanNum + ' ' + figuredBass;
                }
            }
            if(prevRNumLilyPond == currRNumLilyPond){
                rNumLilyPond = "\\markup { "; // start an empty rNum lyric
            } else {
                rNumLilyPond = "\\markup { " + currRNumLilyPond;
            }
    //        console.log('currRomanNum='+ currRomanNum + '\ncurrRNumLilyPond='+currRNumLilyPond);
            prevRNumLilyPond = currRNumLilyPond;
            //-------------------------------------------------    
    
    
            rNumLilyPond += " }4 "; // close out the lyric Roman Numeral
    
    //        console.log('chordName='+chordName +'\n lilyChordname='+ chordNameLilyPond);
            
            oldChordName = chordName;
            nameWithTags = chordName + sameChordTags;
    
            // add the chord name and roman numeral to the string
            chordsLilyPond += chordNameLilyPond;
            rNumeralsLilyPond += rNumLilyPond;
            if(index+1 % 8 == 0){
                chordsLilyPond += '\n  ';  
                rNumeralsLilyPond += '\n ';  
            } else {
                chordsLilyPond += ' ';
                rNumeralsLilyPond += ' ';  
            }
            chordProgression.push(nameWithTags);
            msg += oneMsg + nameWithTags;
            sameChordTags = '';
            // console.log(chordName);
            if(pickup) {
    //            console.log('pickupCounter='+pickupCounter+' pickupLength='+pickupLength);
                if(pickupCounter >= pickupLength) {
                    chordProgression.push('|');
                    newBarline = true;
                    pickup = false; // was a string now a boolean, is that weird? (pickup == '\partial 4')         
                } else {
                    newBarline = false;            
                }
                gridCounter = 0;
            }
            if(gridCounter >= measureLength) {
                chordProgression.push('|');
                newBarline = true;
                gridCounter = 0;
            } else {
                newBarline = false;
            }
        });
        // close out the lilypond code
        chordsLilyPond += '\n}\n';
        rNumeralsLilyPond += '\n}\n';
    
    //    console.log(chordContexts);    
    
        // does js do tuples??? collect the 4 return values
        var fourChordFormats = [];
        fourChordFormats.push(chordsLilyPond);
        fourChordFormats.push(rNumeralsLilyPond);
        fourChordFormats.push(chordProgression);
        fourChordFormats.push(chordGrid);
        return fourChordFormats;

    //-------------------------------------------------*/

    console.log(myChordContexts);

    /*-------------------------------------------------
        // take a second pass through the Chord objects
        chordContexts.forEach(element, index => {
            // set location (index)
            // set nextChord(index+1)
            // set nextChord2(index+2)
            // set localKey
            // set key
            // set nonHarmonicTones
            // set meta
            
            if(index==1){         // first chord won't have a prevChord
                // set prevChord = index-1;
            } else if(index==2){  // first two chords won't have a prevChord, prevChord2
                // set  prevChord2 = index-2;
            }
            if(index == (chordContexts.length-1)) {
                // set isFermata = true; // (last chord)
            }

        });

    //-------------------------------------------------*/

        return myChordContexts;
    }

    function makeAChordContext(bass, chordQuality, root, chordName, thisChord) {
        var aChordContext = {};
        Object.defineProperties(aChordContext, {
          'bassNote': {
            value: bass,
          },
          'chordQuality': {
            value: chordQuality,
          },
          'root': {
            value: root,
          },
          'fullName': {
            value: chordName,
          },
          'thisChord': {
            value: thisChord,
          }
          /*----------------------------          
          ,
          'localKey': { // array of notes played near this chord
            value: '', // getLocalKey,
          },
          'key': { // the key signature
            value: '', // getKey,
          },
          'nonHarmonicTones': {
            value: [],
          },
          'prevChord2': {
           value: '',
          },
          'prevChord': {
            value: '',
          },
          'nextChord': {
            value: '',
          },
          'nextChord2': {
            value: '',
          },
          'location': {
            value: '',
          },
          'isFermata': {
            value: '',
          },
          'meta': {
            value: '',
          },
          set setNextChord(value) {
            this.nextChord = value;
          },
          set nextChord2(value) {
            this.nextChord2 = value;
          },
          set prevChord(value) {
            this.prevChord = value;
          },
          set prevChord2(value) {
            this.prevChord2 = value;
          },
          set location(value) {
            this.location = value;
          },
          set meta(value) {
            this.meta = value;
          },
          set localKey(value) {
            this.localKey = value;
          },
          set key(value) {
            this.key = value;
          },
          set nonHarmonicTones(value) {
            this.nonHarmonicTones = value;
          },
          set isFermata(value) {
            this.isFermata = value;
          }
          //---------------------------------*/
        });
    
        return aChordContext;
    }


//--------------------------------------------------------------------
// constructor call with 'new' i.e. let chord = new aChordContext()
//-------------------------------------------------------------------
function aChordContext(bass, chordQuality, root, chordName, thisChord) {
    this.bassNote = bass;
    this.chordQuality = chordQuality;
    this.root = root;
    this.fullName = chordName;
    this.thisChord = thisChord,
    this.localKey = '';
    this.key = '';
    this.nonHarmonicTones = [];
    this.prevChord2 = 0;
    this.prevChord = 0;
    this.nextChord = 0;
    this.nextChord2 = 0;
    this.location = 0;
    this.isFermata = false;
    this.meta = '';
    this.setNextChord = function(value) {
        this.nextChord = value;
      };
    this.setNextChord2 = function(value) {
        this.nextChord2 = value;
      };
    this.setPrevChord = function(value) {
        this.prevChord = value;
      };
    this. setPrevChord2 = function(value) {
        this.prevChord2 = value;
      };
    this.setLocation = function(value) {
        this.location = value;
      };
    this.setMeta = function(value) {
        this.meta = value;
      };
    this.setLocalKey = function(value) {
        this.localKey = value;
      };
    this.setKey = function(value) {
        this.key = value;
      };
    this.setNonHarmonicTones = function(value) {
        this.nonHarmonicTones = value;
      };
    this.setIsFermata = function(value) {
        this.isFermata = value;
      };
}
//-------------------------------------------*/


// creates a tone js format array using param lilyKey i.e. 'g \\major'
function makeKeyScale(lilyKey){
    let keyNotes = keyToScale[lilyKey];
    let keyScale = [];
    let major_idx = [0,2,4,5,7,9,11];
    let minor_idx = [0,2,3,5,7,8,10];
    let idx;
    if(lilyKey.includes('major')){
        idx = major_idx;
    } else if(lilyKey.includes('minor')) {
        idx = minor_idx;
    } else {
        idx = major_idx;
    }
    let scaleLen = idx.length;
    for(let i=0; i<scaleLen; i++){
        keyScale.push(keyNotes[idx[i]]);
    }
    return keyScale;
}


// creates an array of notes being used in the chords of chordLocations array
// returns sorted array of notes with the starting note being the root of the
// chord at chordLocations[0] i.e. ['D','E','F#','G','A','B','C'] 
// sometimes less than 7 notes depending on the chords that are analyzed 
function getLocalNotes(chordContexts, chordLocations){
    let numOfChords = chordLocations.length;
    let notes = [];
    let validNotes = ['A','B','C','D','E','F','G'];
    let myMusicAlphabet = [];
    for(let i=0; i<numOfChords; i++){
        // thisChord format:  ['A4', 'E4', 'C#4', 'A3'] (high to low)
        let chordTones = chordContexts[chordLocations[i]].thisChord;
        chordTones.forEach(function(tone){
            let len = tone.length;
            // remove octave number of the chord tone
            notes.push(tone.slice(0,len-1));
        });
    }
    notes = notes.flat();
    let localNotes = [];
    // remove the dublicates
    notes.forEach(function(note){
        if(!localNotes.includes(note)){
            localNotes.push(note);
        }
    });

    // alphabetical sort the list using the first note as a starting point
    // use the root of the first chord as the firstNote of sorted scale
    let firstNote = chordContexts[chordLocations[0]].root;
    let foundIndex = -1;
    let sortedLocalNotes = [];
    for(let i=0; i<7; i++){
        if( firstNote[0] == validNotes[i] ){
            foundIndex = i;
        }
    }
    myMusicAlphabet.push(validNotes[foundIndex]);
    for(let i=1; i<7; i++){
        myMusicAlphabet.push(validNotes[(foundIndex+i)%7]);
    }
    let len = localNotes.length;
    for(let i=0; i<7; i++){
        for(let j=0; j<len; j++){
            if( localNotes[j][0] == myMusicAlphabet[i] ){
                sortedLocalNotes.push(localNotes[j]);
            }
        }
    }
    return sortedLocalNotes;
}

// seaches for the previous chord change (ignoring the prevChord if it is the same)
// returns index of found chord
function findPrevChordChange(chordContexts, chordLocation){
    if(chordLocation == 0) return '';
    let fullName = chordContexts[chordLocation].fullName;
    let currLoc = chordLocation;
    while(currLoc > 0){
        currLoc--;
        if(fullName != chordContexts[currLoc].fullName){
            return currLoc;
        }
    }
    return '';
}

// seaches for the next chord change (ignoring the nextChord if it is the same)
// returns index of found chord
function findNextChordChange(chordContexts, chordLocation){
    let len = chordContexts.length;
    if(chordLocation == len-1) return '';
    let fullName = chordContexts[chordLocation].fullName;
    let currLoc = chordLocation;
    while(currLoc < len-1){
        currLoc++;
        if(fullName != chordContexts[currLoc].fullName){
            return currLoc;
        }
    }
    return '';
}

function convertLilyToTonePitch(lilyNotes){
    let toneNotes = [];
    let len = lilyNotes.length;
    for(let i=0; i<len; i++){
        toneNotes.push(lilyToTonePitch[lilyNotes[i]]);
    }
    return toneNotes;
}


// takes local info and key signature to determine Key
// returns string 'D' or 'Dm'
function determineKey(chordContexts, keyNotes, localKey, localNotes){
    console.log('---------------------\ndetermineKey() start\n---------------------')
    let localKeyNotes = [];
    let localKeyNotes_IsDone = false;
    let keyNote_IsDone = false;
    let chordQ = '';
    let keyNote = '';
    let keyNoteArray = []; // to be used with scaleScores
    let chordQArray = [];
 
    // first and last chords are possible keys choices
    let firstChordName = chordContexts[0].fullName;
    let chordsLen = chordContexts.length;
    let lastChordName = chordContexts[chordsLen-1].fullName;
    let lastChordRoot = chordContexts[chordsLen-1].root;

//    let lastChords = findLastXChords(chordContexts, 3);
//    console.log('lastChords='+lastChords);
    let scaleScores3 = compareTwoScales(localKey, keyNotes);
    let relativeScaleRoot = '';

    //----------------------------------------------------------------------
    if ( scaleScores3[0]==100 && scaleScores3[1]==100 && scaleScores3[2]==100 ){
    // localKey and keyNotes are equal or modes

        // need to determine if this is relative minor cadence
        if( chordContexts[0].key.includes('major') ){
            relativeScaleRoot = majorRootToRelativeMinorRoot[keyNotes[0]];
            if(lastChordRoot == relativeScaleRoot) {
                localKeyNotes = makeModeFromScale(keyNotes,6);
//                localKeyNotes.push(makeModeFromScale(keyNotes,6));
                chordQ = 'm';
            }
            
        } // could be a relative major cadence, take a look
        else if( chordContexts[0].key.includes('minor') ) {
            relativeScaleRoot = minorRootToRelativeMajorRoot[keyNotes[0]];
            if(lastChordRoot == relativeScaleRoot) {
                localKeyNotes = makeModeFromScale(keyNotes,3);
                chordQ = '';
//                localKeyNotes.push(makeModeFromScale(keyNotes,6));
            }
        }

        // check if localKey was a mixolydian mode (V chord)
        if(scaleScores3[3] == 5) {
            localKeyNotes = makeModeFromScale(keyNotes,5);
            chordQ = '';
//            localKeyNotes.push(keyNotes);
        }

        if(scaleScores3[3] == 1) {
            localKeyNotes = keyNotes;
//            localKeyNotes.push(keyNotes);
        }
//        console.log('scaleScores3= '+scaleScores3+'\nlocalKeyNotes= '+localKeyNotes);
//        chordQArray.push(chordQ);
        localKeyNotes_IsDone = true;
    }
    /*-------------------------------------------------------------------
    // if scaleScores1[1] is higher than scaleScores2[1]
    //   choose localKey
    if(scaleScores1[1] > scaleScores2[1]){
        localKeyNotes = makeKeyFromNotes(localKey, localNotes);
        localKeyNotes_IsDone = true;
    }

    // scaleScores1[0] will always be 100%
    if(scaleScores2[0] < 85 ) {
        // choose localKey
        localKeyNotes = makeKeyFromNotes(localKey, localNotes); 
        localKeyNotes_IsDone = true;
    } 

    // the higher the scaleScoresX[2] value (length percent between scale1 and scale2)
    // the more it confirms the scores of scaleScoresX[0] and scaleScoresX[1]
    //----------------------------------------------------------------------*/
    
    if(!localKeyNotes_IsDone){
        localKeyNotes = makeKeyFromNotes(localKey, localNotes); 
//        console.log(' ! localKeyNotes_IsDone from determineKey(): localKey='+localKey+'\nlocalNotes='+localNotes);
//        console.log(' ! localKeyNotes_IsDone from determineKey(): localKeyNotes='+localKeyNotes);
    } 
//    else {
//        console.log('localKeyNotes_IsDone from determineKey(): localKeyNotes='+localKeyNotes);
//    }

/*---------------------------------------------------------------
    if(Array.isArray(localKeyNotes[0]) && localKeyNotes.length > 1){
        for(let i=0; i<localKeyNotes.length; i++){
            console.log('localKeyNotes['+i+']= '+localKeyNotes[i]);
        }
    } else {
        console.log('localKeyNotes= '+localKeyNotes);
    }
//----------------------------------------------------------------*/

    // use localKeyNotes and Cadence_type to filter down the choices
    // 

//--------------------------------------------------------------------------
    // compare localKeyNotes with localKey
    let arrayOfScores = [];
    let my_localKeyNotes = [];
//    console.log('localKeyNotes='+localKeyNotes+' is mult-array:'+Array.isArray(localKeyNotes[0]))
    if(Array.isArray(localKeyNotes[0])){
        for(let i=0; i<localKeyNotes.length; i++){
            chordQ = '';
            scaleScores3 = compareTwoScales(localKeyNotes[i], keyNotes);
//            console.log('hello: scaleScores3['+i+']= '+scaleScores3+'\nlocalKeyNotes['+i+']= '+localKeyNotes[i]);
//            console.log('localKeyNotes='+localKeyNotes);
            arrayOfScores.push(scaleScores3);
            keyNote_IsDone = false;
            if(scaleScores3[0]==100 && scaleScores3[1]==100 && scaleScores3[2]==100){
                // need to determine if this is relative minor cadence
                if( chordContexts[0].key.includes('major') ){
                    relativeScaleRoot = majorRootToRelativeMinorRoot[keyNotes[0]];
                    if(lastChordRoot == relativeScaleRoot) {
                        my_localKeyNotes = makeModeFromScale(keyNotes,6);
                        keyNote = my_localKeyNotes[0];
                        keyNoteArray.push(keyNote);
//                        console.log('assignment keyNote='+keyNote);
                        chordQ = 'm';
                        keyNote_IsDone = true;
                    }
                } else if( chordContexts[0].key.includes('minor') ) {
                    relativeScaleRoot = minorRootToRelativeMajorRoot[keyNotes[0]];
                    if(lastChordRoot == relativeScaleRoot) {
                        my_localKeyNotes = makeModeFromScale(keyNotes,3);
                        keyNote = my_localKeyNotes[0];
                        keyNoteArray.push(keyNote);
                        chordQ = '';
//                        console.log('assignment keyNote='+keyNote);
                        keyNote_IsDone = true;
                    }
                }
                if(!keyNote_IsDone){
//                    console.log('scaleScores3[]='+scaleScores3[3]);
                    my_localKeyNotes = keyNotes;
                    keyNote = my_localKeyNotes[0];
                    keyNoteArray.push(keyNote);
//                    console.log('assignment keyNote='+keyNote);
                    keyNote_IsDone = true;
                }
            }
            if(!keyNote_IsDone){
//                console.log('localKeyNotes=\n'+localKeyNotes.join('\n')+'\nkeyNote NOT assigned');
                // is the root of the last chord the 1st note of this scale?
                let calcFirstNote = localKeyNotes[i][0];
//                console.log('lastChordRoot='+lastChordRoot+' calcFirstNote='+calcFirstNote);
                if(lastChordRoot == calcFirstNote) {
                    keyNote = calcFirstNote;
                    keyNoteArray.push(keyNote);
//                    console.log('assignment keyNote='+keyNote);
                    keyNote_IsDone = true;
                }
                
                // is the root of the last chord the 5th note of this scale?
                let VchordRoot = localKeyNotes[i][4];
//                console.log('lastChordRoot='+lastChordRoot+' VchordRoot='+VchordRoot);
                if(lastChordRoot == VchordRoot) {
                    keyNote = localKeyNotes[i][0];
                    keyNoteArray.push(keyNote);
                    let isMajor = analyzeScaleAgainstMajor(localKeyNotes[i]);
                    let isMinor = analyzeScaleAgainstMinor(localKeyNotes[i]);
                    let isHarmonicMajor = analyzeScaleAgainstHarmonicMajor(localKeyNotes[i]);
                    if(!isMajor[0] && isMinor[0] && isMinor[1][0] == localKeyNotes[i][0]) {
//                        keyNote += 'm';
                        chordQ = 'm';
                    } else if(isMajor[0]){
                        chordQ = '';
                    }
//                    console.log('assignment keyNote='+keyNote);
                    keyNote_IsDone = true;
                }

                // is the last chord the VI chord in a minor key, i.e. V - VI
                let vi_chordRoot = minorRootToVIChordRoot[calcFirstNote];
//                console.log('lastChordRoot = '+lastChordRoot+' vi_chordRoot = '+vi_chordRoot);
                if(lastChordRoot == vi_chordRoot) {
//                    my_localKeyNotes = makeModeFromScale(localKeyNotes[i],6);
//                    console.log('localKeyNotes='+my_localKeyNotes);
                    keyNote = calcFirstNote;
                    keyNoteArray.push(keyNote);
//                    console.log('assignment keyNote='+keyNote);
                    chordQ = 'm';
                    keyNote_IsDone = true;
                }


                // is the root of the last chord the 6th note of this scale (relative minor)?
                relativeScaleRoot = majorRootToRelativeMinorRoot[calcFirstNote];
//                console.log('calcFirstNote='+calcFirstNote+' lastChordRoot='+lastChordRoot+' relativeScaleRoot='+relativeScaleRoot);
//                console.log('lastChordRoot='+lastChordRoot+' relativeScaleRoot='+relativeScaleRoot);
                if(lastChordRoot == relativeScaleRoot) {
                    my_localKeyNotes = makeModeFromScale(localKeyNotes[i],6);
//                    console.log('localKeyNotes='+my_localKeyNotes);
                    keyNote = my_localKeyNotes[0];
                    keyNoteArray.push(keyNote);
//                    console.log('assignment keyNote='+keyNote);
                    chordQ = 'm';
                    keyNote_IsDone = true;
                }
                // is the root of the last chord the 3rd note of this scale (relative major)?
                relativeScaleRoot = minorRootToRelativeMajorRoot[calcFirstNote];
//                console.log('calcFirstNote='+calcFirstNote+' lastChordRoot='+lastChordRoot+' relativeScaleRoot='+relativeScaleRoot);
//                console.log('lastChordRoot='+lastChordRoot+' relativeScaleRoot='+relativeScaleRoot);
                if(lastChordRoot == relativeScaleRoot) {
                    my_localKeyNotes = makeModeFromScale(localKeyNotes[i],3);
//                    console.log('keyNotes='+keyNotes+'\nlocalKeyNotes='+my_localKeyNotes);
                    keyNote = my_localKeyNotes[0];
                    keyNoteArray.push(keyNote);
//                    console.log('assignment keyNote='+keyNote);
                    keyNote_IsDone = true;
                }
                // is the last note the 4th note of the this scale?
                if(lastChordRoot == localKeyNotes[i][3]){
                    keyNote = localKeyNotes[i][0];
                    keyNoteArray.push(keyNote);
//                    console.log('assignment keyNote='+keyNote);
                    keyNote_IsDone = true;
                }
            }
            chordQArray.push(chordQ);
        }
        // if still not done, maybe the key signature is the best choice
        if(!keyNote_IsDone) {
            keyNote = keyNotes[0];
            keyNoteArray.push(keyNote);
//            console.log('assignment keyNote='+keyNote);
            keyNote_IsDone = true;
        }
    } else {
        // localKeyNotes is a single dimension array
        chordQ = '';
        scaleScores3 = compareTwoScales(localKeyNotes, keyNotes);
//        console.log('scaleScores3='+scaleScores3+'\nlocalKeyNotes='+localKeyNotes+'\nkeyNotes='+keyNotes);
        arrayOfScores.push(scaleScores3);
        keyNote_IsDone = false;
        if(scaleScores3[0]==100 && scaleScores3[1]==100 && scaleScores3[2]==100){

            // need to determine if this is relative minor cadence
            if( chordContexts[0].key.includes('major') ){
                relativeScaleRoot = majorRootToRelativeMinorRoot[keyNotes[0]];
                if(lastChordRoot == relativeScaleRoot) {
                    localKeyNotes = makeModeFromScale(keyNotes,6);
                    keyNote = localKeyNotes[0];
                    keyNoteArray.push(keyNote);
//                    console.log('assignment keyNote='+keyNote);
                    chordQ = 'm';
                    keyNote_IsDone = true;
                }
            } else if( chordContexts[0].key.includes('minor') ) {
                relativeScaleRoot = minorRootToRelativeMajorRoot[keyNotes[0]];
                if(lastChordRoot == relativeScaleRoot) {
                    localKeyNotes = makeModeFromScale(keyNotes,3);
                    keyNote = localKeyNotes[0];
                    keyNoteArray.push(keyNote);
                    chordQ = '';
//                    console.log('assignment keyNote='+keyNote);
                    keyNote_IsDone = true;
                }
            }
            if(!keyNote_IsDone){
                // if localKeyNotes is the 5th mode of keyNotes, update: localKeyNotes = keyNotes
                if(scaleScores3[3] == 5){
                    localKeyNotes = keyNotes;
//                    console.log('if(scaleScores3[3] == 5) keyNotes='+keyNotes+'\nlocalKeyNotes='+localKeyNotes);
                }
//                console.log('scaleScores3[3]='+scaleScores3[3]);

                keyNote = localKeyNotes[0];
                keyNoteArray.push(keyNote);
//                console.log('assignment keyNote='+keyNote);
                keyNote_IsDone = true;
            }
        }
        if(!keyNote_IsDone){
//            console.log('arrayOfScores= '+arrayOfScores);
            // is the root of the last chord the 1st note of localKeyNotes?
            let calcFirstNote = localKeyNotes[0];
            if(lastChordRoot == calcFirstNote) {
                keyNote = localKeyNotes[0];
                keyNoteArray.push(keyNote);
//                console.log('assignment keyNote='+keyNote);
                keyNote_IsDone = true;
            }
            // is the root of the last chord the 5th note of this scale?
            let VchordRoot = localKeyNotes[4];
            if(lastChordRoot == VchordRoot) {
                keyNote = localKeyNotes[0];
                keyNoteArray.push(keyNote);
                let isMajor = analyzeScaleAgainstMajor(localKeyNotes);
                let isMinor = analyzeScaleAgainstMinor(localKeyNotes);
                let isHarmonicMajor = analyzeScaleAgainstHarmonicMajor(localKeyNotes);
                if(!isMajor[0] && isMinor[0] && isMinor[1][0] == localKeyNotes[0]) {
//                    keyNote += 'm';
                    chordQ = 'm';
                } else if(isMajor[0]){
                    chordQ = '';
                }
//                console.log('assignment keyNote='+keyNote);
                keyNote_IsDone = true;
            }
            // is the root of the last chord the 6th note of this scale (relative minor)?
            relativeScaleRoot = majorRootToRelativeMinorRoot[localKeyNotes[0]];
            if(lastChordRoot == relativeScaleRoot) {
                localKeyNotes = makeModeFromScale(localKeyNotes,6);
                keyNote = localKeyNotes[0];
                keyNoteArray.push(keyNote);
//                console.log('assignment keyNote='+keyNote);
                chordQ = 'm';
                keyNote_IsDone = true;
            }
            // is the root of the last chord the 3rd note of this scale (relative major)?
            relativeScaleRoot = minorRootToRelativeMajorRoot[localKeyNotes[0]];
            if(lastChordRoot == relativeScaleRoot) {
                localKeyNotes = makeModeFromScale(localKeyNotes,3);
                keyNote = localKeyNotes[0];
                keyNoteArray.push(keyNote);
                chordQ = '';
//                console.log('assignment keyNote='+keyNote);
                keyNote_IsDone = true;
            }
        }
        chordQArray.push(chordQ);
    }
    console.log('====================================');
    let highestScore = -1;
    let highestScoreIndex = -1;
    let currentScore = 0;
    for(let i=0; i<keyNoteArray.length; i++){
        console.log('arrayOfScores['+i+']='+arrayOfScores[i]);
        console.log('keyNoteArray['+i+']='+keyNoteArray[i]);
        console.log('chordQArray['+i+']='+chordQArray[i]);
        let oneScore = arrayOfScores[i];
        let aKeyNote = keyNoteArray[i];
        let quality = chordQArray[i];
        if(oneScore[0] == 100 && oneScore[1] == 100 && oneScore[2] == 100){
            if(oneScore[3] == 1){
                keyNote = aKeyNote;
                chordQ = quality;
            }
        } else if(oneScore[0] > highestScore){
            highestScoreIndex = i;
            highestScore = oneScore[0];
            keyNote = aKeyNote;
            chordQ = quality;
        }

    }
    console.log('====================================');

    //--------------------------------------------------------------------------
    if(keyNote == ''){
        console.log('determineKey()->keyNote is blank');
    } else {
        console.log('keyNote='+ keyNote + chordQ);
    }
    console.log('---------------------\ndetermineKey() end\n---------------------')
    return (keyNote + chordQ);
}


function makeKeyFromNotes(localKey, localNotes){
    console.log('---------------------\nmakeKeyFromNotes() start\n---------------------')
//    console.log('localKey='+localKey+'\nlocalNotes='+localNotes);
    let lenLocalKey = localKey.length;
    let lenLocalNotes = localNotes.length;
    let newLocalKey = [];
    let lenNewLocalKey = 0;
    let numOfEachLetter = [];
    let missingLetters = [];
    let numOfOneLetter = 0;
    let hasMultiples = false;
    let whichLetterHasMultiple = [];
    let coreScaleNotes = [];
    let coreScaleNotes2 = [];
    let multLetters = [];
    let multLetters2 = [];
    let possibleScales = [];
    let onePossibleScale = [];
    let myScaleScores = [];
    let returnScales = [];
    let valid_notes = ['A','B','C','D','E','F','G'];
    let isLarge_localNotes = false;
    let highScore = 0;

    if(localKey.length>9){
        newLocalKey = localNotes;
        if(localNotes.length > 7){
            isLarge_localNotes = true;
        }
    } else {
        newLocalKey = localKey;
    }
    lenNewLocalKey = newLocalKey.length;

    // check to see if this scale has a missing letter name
    // but also has two of the same letter name
    // i.e. fails (newLocal.length > 7) but needs some processing
    //--------------------------------------------------------
    let numSharps = 0;
    let numFlats = 0;
    valid_notes.forEach(function(item, index, array){
        numOfOneLetter = 0;
        numSharps = 0;
        numFlats = 0;
        for(let i=0; i<lenNewLocalKey; i++){
            if(newLocalKey[i].includes(item)){
                numOfOneLetter++;
            }
            if(newLocalKey[i].includes('#')){
                numSharps++;
            }
            if(newLocalKey[i].includes('b')){
                numFlats++;
            }
        }
        if(numOfOneLetter == 0){
            missingLetters.push(array[index]);
            // add # or b version of this letter??? don't add E# or B#
            if(numSharps>1 && array[index] != 'B' && array[index] != 'E' ) {
                missingLetters.push( (array[index]+'#') ) 
            }
            // don't add Fb or Cb
            if(numFlats>1 && array[index] != 'F' && array[index] != 'C' ){
                missingLetters.push( (array[index]+'b') ) 
            }
        }
    });
    if(missingLetters.length){
        console.log('missingLetters='+missingLetters);
        for(let i=0; i<missingLetters.length; i++){
            newLocalKey.push(missingLetters[i]);
        }
        newLocalKey = newLocalKey.flat().sort();
    }

    //-------------------------------------------------------*/
    console.log('newLocalKey='+newLocalKey);
    if(newLocalKey.length > 7){
        // find the letter that has two entries
        valid_notes.forEach(function(item, index, array){
            numOfOneLetter = 0;
            for(let i=0; i<newLocalKey.length; i++){
                if(newLocalKey[i].includes(item)){
                    numOfOneLetter++;
                }
            }
            if(numOfOneLetter > 1){
                whichLetterHasMultiple.push(index);
            }
            numOfEachLetter.push(numOfOneLetter);
        });

        if(whichLetterHasMultiple.length && (whichLetterHasMultiple.length < 5) ) {
            let lettersLen = whichLetterHasMultiple.length;
            if(lettersLen > 1){
                coreScaleNotes2 = newLocalKey; // we'll 'slice' coreScaleNotes2 multiple times
                for(let i=0; i<lettersLen; i++){
                    coreScaleNotes2 = removeLetterFromScale( coreScaleNotes2, valid_notes[whichLetterHasMultiple[i]] );               
                    multLetters = getLetterFromScale( newLocalKey, valid_notes[whichLetterHasMultiple[i]] );
                    multLetters2.push(multLetters);
                }
//                console.log('coreScaleNotes2='+coreScaleNotes2+'\nmultLetters2='+multLetters2);
                let numOfPossibles = 2 ** lettersLen; // assuming there is only two letters per
                let twoMultLetters = [ [0,0],[1,0], [0,0],[1,1], [0,1],[1,0], [0,1],[1,1] ];

                let threeMultLetters = [ [0,0],[1,0],[2,0], [0,0],[1,0],[2,1], [0,0],[1,1],[2,0], 
                                         [0,0],[1,1],[2,1], [0,1],[1,0],[2,0], [0,1],[1,0],[2,1],
                                         [0,1],[1,1],[2,0], [0,1],[1,1],[2,1] ];

                let fourMultLetters =  [ [0,0],[1,0],[2,0],[3,0], [0,0],[1,0],[2,0],[3,1], 
                     [0,0],[1,0],[2,1],[3,0], [0,0],[1,0],[2,1],[3,1], [0,0],[1,1],[2,0],[3,0], 
                     [0,0],[1,1],[2,0],[3,1], [0,0],[1,1],[2,1],[3,0], [0,0],[1,1],[2,1],[3,1], 
                     [0,1],[1,0],[2,0],[3,0], [0,1],[1,0],[2,0],[3,1], [0,1],[1,0],[2,1],[3,0], 
                     [0,1],[1,0],[2,1],[3,1], [0,1],[1,1],[2,0],[3,0], [0,1],[1,1],[2,0],[3,1], 
                     [0,1],[1,1],[2,1],[3,0], [0,1],[1,1],[2,1],[3,1] ];

                highScore = 0;

                //  make the possible scales
                for(let j=0; j<numOfPossibles; j++){
                    
                    onePossibleScale.push(coreScaleNotes2);
//                    console.log('j='+j);
                    // loop through the chromatic notes
                    for(let i=0; i<lettersLen; i++){ // assuming there is only two letters per
                        idx = (j*lettersLen)+i;
                        // different setup for each number lettersLen
                        if(lettersLen == 2){
                            let noteIndex = twoMultLetters[idx][0];
                            let whichLetterIndex = twoMultLetters[idx][1];
//                            console.log('lettersLen='+lettersLen+' noteIndex='+noteIndex+' whichLetterIndex='+whichLetterIndex);
                            onePossibleScale.push(multLetters2[noteIndex][whichLetterIndex]);
                        }
                        if(lettersLen == 3){
                            let noteIndex = threeMultLetters[idx][0];
                            let whichLetterIndex = threeMultLetters[idx][1];
//                            console.log('lettersLen='+lettersLen+' noteIndex='+noteIndex+' whichLetterIndex='+whichLetterIndex);
                            onePossibleScale.push(multLetters2[noteIndex][whichLetterIndex]);

                        }
                        if(lettersLen == 4){
                            let noteIndex = fourMultLetters[idx][0];
                            let whichLetterIndex = fourMultLetters[idx][1];
//                            console.log('lettersLen='+lettersLen+'noteIndex='+noteIndex+' whichLetterIndex='+whichLetterIndex);
                            onePossibleScale.push(multLetters2[noteIndex][whichLetterIndex]);
                        }
                    }
                    onePossibleScale = onePossibleScale.flat().sort();
//                    onePossibleScale = onePossibleScale.sort();
                    let aScore = [];
                    if(isLarge_localNotes){
                        aScore = compareTwoScales(onePossibleScale, localNotes);
                    } else {
                        aScore = compareTwoScales(localNotes, onePossibleScale);
                    }
//                    console.log('aScore='+aScore+'\nlocalNotes='+localNotes+'\nonePossibleScale='+onePossibleScale);
                    if(aScore[0]==100){
                        myScaleScores.push(aScore);
                        possibleScales.push(onePossibleScale);
                        highScore = 100;
                    } else {
                        // add only the highest score
                        if(aScore[0] > highScore){
                            myScaleScores = [];
                            possibleScales = [];
                            myScaleScores.push(aScore);
                            possibleScales.push(onePossibleScale);
                            highScore = aScore[0];
//                            console.log('highScore='+highScore);
                        } else if(aScore[0] == highScore){
                            myScaleScores.push(aScore);
                            possibleScales.push(onePossibleScale);
                        }
                    }                   
//                    possibleScales.push(onePossibleScale);
                    onePossibleScale = [];
                }
                
            } else { // letterLen == 1
                highScore = 0;
                coreScaleNotes = removeLetterFromScale( newLocalKey, valid_notes[whichLetterHasMultiple[0]] );
                multLetters = getLetterFromScale( newLocalKey, valid_notes[whichLetterHasMultiple[0]] );
//                console.log('localKey='+localKey+'\ncoreScaleNotes='+coreScaleNotes+'\nmultLetters='+multLetters);
                for(let i=0; i<multLetters.length; i++){
                    onePossibleScale.push(coreScaleNotes);
                    onePossibleScale.push(multLetters[i]);
                    onePossibleScale = onePossibleScale.flat().sort();
//                    console.log('onePossibleScale '+i+' =\n'+onePossibleScale);

                    let aScore = [];
                    if(isLarge_localNotes){
                        aScore = compareTwoScales(onePossibleScale, localNotes);
                    } else {
                        aScore = compareTwoScales(localNotes, onePossibleScale);
                    }
//                    let aScore = compareTwoScales(localNotes, onePossibleScale);
//                    console.log('aScore='+aScore+'\nlocalNotes='+localNotes+'\nonePossibleScale='+onePossibleScale);

                    if(aScore[0]==100){
                        myScaleScores.push(aScore);
                        possibleScales.push(onePossibleScale);
                    } else {
                        // add only the highest score
                        if(aScore[0] > highScore){
//                            myScaleScores = [];
//                            possibleScales = [];
                            myScaleScores.push(aScore);
                            possibleScales.push(onePossibleScale);
                            highScore = aScore[0];
//                            console.log('highScore='+highScore);
                        } else if(aScore[0] == highScore){
                            myScaleScores.push(aScore);
                            possibleScales.push(onePossibleScale);
                        }
                    }                    
//                    console.log('localNotes='+localNotes+'\nScore: '+aScore);
                    onePossibleScale = [];
                }
//                console.log('coreScaleNotes='+coreScaleNotes+' multLetters='+multLetters);
            }
        }
//        console.log('numOfEachLetter = '+numOfEachLetter);
    } else {
//        console.log('localKey='+localKey);
        myScaleScores.push(compareTwoScales(localNotes,newLocalKey));
        possibleScales.push(newLocalKey);
    }
//    console.log('myScaleScores='+myScaleScores);
    highScore = -1;
    let oneScore = 0;
    let indexOfHighScore = -1;
    let indicesOfHighScores = [];

    for(let i=0; i<myScaleScores.length; i++){
        oneScore = myScaleScores[i][0];
        if(oneScore > highScore) {
            highScore = oneScore;
            indexOfHighScore = i;
            indicesOfHighScores = [];
            indicesOfHighScores.push(i);
        } else if(oneScore == highScore) {
            indicesOfHighScores.push(i);
        }
    }
    if(indexOfHighScore!=-1){
//        console.log('indicesOfHighScores='+indicesOfHighScores[0]+'\npossibleScales=\n'+possibleScales.join('\n'));
        for(let i=0; i<indicesOfHighScores.length; i++){
//            console.log('('+highScore+') Best choice scale='+possibleScales[indicesOfHighScores[i]]);
            let isMajor = analyzeScaleAgainstMajor(possibleScales[indicesOfHighScores[i]]);
            let isMinor = analyzeScaleAgainstMinor(possibleScales[indicesOfHighScores[i]]);
            let isHarmonicMajor = analyzeScaleAgainstHarmonicMajor(possibleScales[indicesOfHighScores[i]]);
//            console.log('isMajor='+isMajor+' isMinor='+isMinor);

            if( isMajor[0] ){
//                console.log('Scale='+isMajor[1]);
//                console.log('keyRoot='+isMajor[1][0]);
                returnScales.push(isMajor[1]);
                if( (possibleScales[indicesOfHighScores[i]][0]) == (isMajor[1][0]) ){
//                    console.log('Choose ME!!!');
//                    keyRoot = isMajor[1][0];
                }

            }
            if( isMinor[0] ) {
//                console.log('Scale='+isMinor[1]);
//                console.log('keyRoot='+isMinor[1][0]+'m');
                returnScales.push(isMinor[1]);
                if( (possibleScales[indicesOfHighScores[i]][0]) == (isMinor[1][0]) ){
//                    console.log('Choose ME!!!');
//                    keyRoot = isMinor[1][0] + 'm';
                }
            }
            if( isHarmonicMajor[0] ){
//                console.log('Scale='+isMajor[1]);
//                console.log('keyRoot='+isMajor[1][0]);
                returnScales.push(isHarmonicMajor[1]);
                if( (possibleScales[indicesOfHighScores[i]][0]) == (isHarmonicMajor[1][0]) ){
//                    console.log('Choose ME!!!');
//                    keyRoot = isMajor[1][0];
                }

            }
        }
    }
    console.log('returnScales=\n'+returnScales.join('\n'));
    console.log('---------------------\nend makeKeyFromNotes()\n---------------------')
    return returnScales;
}


// removes all versions of letter from scale ie. letter C will remove C, C#, Cb if found
// returns new scale with the letter(s) removed
function removeLetterFromScale(scale, letter){
    let len = scale.length;
    let newScale = [];
    for(let i=0; i<len; i++){
        if(!scale[i].includes(letter)){
            newScale.push(scale[i]);
        }
    }
    return newScale;
}

// returns an array of all versions of the letter from the scale i.e. letter C will 
// return an array ['C','C#'] if the scale contained both C and C#
function getLetterFromScale(scale, letter){
    let len = scale.length;
    let letters = [];
    for(let i=0; i<len; i++){
        if(scale[i].includes(letter)){
            letters.push(scale[i]);
        }
    }
    return letters;
}

// modeNumber: (0 || 1)=major, 2=dorian, 3=phrygian, 4=lydian, 5=mixolydian, 6=aeolian, 7=locrian 
let myScaleX = ['A','B','C','D','E','F','G'];
function makeModeFromScale(scale, modeNumber){
    if(modeNumber < 0 || modeNumber > 7) return [];
    let len = scale.length;
    let modeScale = [];
    let modeNum = (modeNumber > 0)? (modeNumber-1): modeNumber;
    for(let i=0; i<len; i++){
        modeScale.push(scale[ ((i + modeNum) % len) ])
    }
    return modeScale;
}

function printSelectedChords(chordContexts, chordLocs, keyNote){
    let len = chordLocs.length;
    let msg = 'Cadence: ';
    let chordRoot = '';
    let key = rootToKey[keyNote];
//    console.log('keyNote='+keyNote+' key='+key);
    for(let i=0; i<len; i++){
        if(i) { msg += ' - '; }
        msg += chordContexts[chordLocs[i]].fullName;
        msg += ' (';
        chordRoot = chordContexts[chordLocs[i]].root;
        msg += calcRomanNumeral(key, chordRoot);
        msg += ') ';
    }
    console.log(msg);
}


function addCalcKeyProperty(chordObjects, chordLocs, keyNote){
    let len = chordLocs.length;
    let chordRoot = '';
    let key = rootToKey[keyNote];
    let romanNumeral = '';
//    console.log('before loop: chordObjects=');
//    console.log(chordObjects);
    for(let i=0; i<len; i++){
        chordObjects = addSingleChordObjectProperty(chordObjects, 'calcKey', keyNote, chordLocs[i]);
        chordRoot = chordObjects[chordLocs[i]].root;
        romanNumeral = calcRomanNumeral(key, chordRoot);
        chordObjects = addSingleChordObjectProperty(chordObjects, 'romanNumeral', romanNumeral, chordLocs[i]);
    }
//    console.log('after loop: chordObjects=');
//    console.log(chordObjects);
    return chordObjects;
}

let cadenceNames = ['Authentic Cadence: V - I','Plagal Cadence: IV - I', 'Deceptive Cadence: V - VI', 'Half Cadence: any - V'];
function checkForCadence(chordContexts, chordLocs){
    console.log('---------------------\ncheckForCadence() start\n---------------------');
    let keyNote = '';
    let chordQ = '';
    let len = chordLocs.length;
    let roots = [];
    let cadenceIndex = -1;
    let cadenceName = '';
    let chordQualities = [];
    let localNotes = getLocalNotes(chordContexts, chordLocs);

    let myKey = chordContexts[0].key.trim();
    let myKeyScale = makeKeyScale(myKey);
//    let keyNote = keyToRoot[myKey];
    let myLocalKey = chordContexts[0].localKey;
    let myLocalKeyToneJS = convertLilyToTonePitch(myLocalKey);

    // gather the chord qualities of the chords we are analyzing
    for(let i=0; i<len; i++){
        roots.push(chordContexts[chordLocs[i]].root);
        chordQualities.push(chordContexts[chordLocs[i]].chordQuality);
//        console.log('i='+i+' chord:' + chordContexts[chordLocs[i]].root + chordContexts[chordLocs[i]].chordQuality);
    }

    let localCalcKey = determineKey(chordContexts, myKeyScale, myLocalKeyToneJS, localNotes);
//    console.log('early in checkForCadence: localCalcKey='+localCalcKey);    

    //-----------------------------------------------------------------------
    // AUTHENTIC cadence ----------------------------------------------------
    // check if there is a circle progression and V-I (also include vii-I)
    //-----------------------------------------------------------------------
    if(roots[len-1] == roots[len-2]){
        if(isCircleRootMvt(roots[len-3],roots[len-1])) {
            if( chordQualities[len-3] == '' || chordQualities[len-3] == '7' ){
                if( chordQualities[len-1] == '' || chordQualities[len-1] == 'm' ){
//                    console.log('root='+roots[len-3]+' nextRoot='+roots[len-1]);
                    cadenceName = cadenceNames[0];
                    cadenceIndex = 0;
                }
            }
        } else if(isStepwiseRootMvt(roots[len-3],roots[len-1])){
            if( chordQualities[len-3] == 'dim' || chordQualities[len-3] == 'dim7' ){
                if( chordQualities[len-1] == '' || chordQualities[len-1] == 'm' ){
//                    console.log('root='+roots[len-3]+' nextRoot='+roots[len-1]);
                    cadenceName = cadenceNames[0];
                    cadenceIndex = 0;
                }
            }
        }
    } else {
        if(isCircleRootMvt(roots[len-2],roots[len-1])) {
            if( chordQualities[len-2] == '' || chordQualities[len-2] == '7' ){
                if( chordQualities[len-1] == '' || chordQualities[len-1] == 'm' ){
//                    console.log('root='+roots[len-2]+' nextRoot='+roots[len-1]);
                    cadenceName = cadenceNames[0];
                    cadenceIndex = 0;
                }              
            }
        } else if(isStepwiseRootMvt(roots[len-2],roots[len-1])){
            if( chordQualities[len-2] == 'dim' || chordQualities[len-2] == 'dim7' ){
                if( chordQualities[len-1] == '' || chordQualities[len-1] == 'm' ){
//                    console.log('root='+roots[len-3]+' nextRoot='+roots[len-1]);
                    cadenceName = cadenceNames[0];
                    cadenceIndex = 0;
                }
            }            
        }
    }
    if(cadenceIndex!=-1){
//        console.log('cadenceName='+cadenceName);
//        console.log('==============================');
//        return cadenceName;
        if(cadenceIndex == 0 || cadenceIndex == 1){ // V - I or IV - I
            keyNote = roots[len-1];
//            console.log('keyNote='+keyNote+' localCalcKey='+localCalcKey);
            if( localCalcKey && (keyNote != localCalcKey) ){
                keyNote = localCalcKey;
            }
            chordQ = chordQualities[len-1];

        } else if(cadenceIndex == 2){  // V - VI
            keyNote = circleMovement[ roots[len-2] ];
            chordQ = chordQualities[len-1];

        } else if(cadenceIndex == 3){  // any - V 
            keyNote = circleMovement[ roots[len-1] ];
            chordQ = chordQualities[len-1];

        }
//        console.log('keyNote='+keyNote+chordQ);
        printSelectedChords(chordContexts, chordLocs, keyNote);
        chordContexts = addCalcKeyProperty(chordContexts, chordLocs, keyNote);
        console.log(chordContexts);
        console.log('---------------------\ncheckForCadence() end\n---------------------');
        return cadenceIndex;
    }

    //-----------------------------------------------------------------------
    // PLAGAL cadence ----------------------------------------------------
    // check if there is IV-I 
    //-----------------------------------------------------------------------
    if(roots[len-1] == roots[len-2]){
        if(isBackCircleRootMvt(roots[len-3],roots[len-1])) {
            if( chordQualities[len-3] == '' || chordQualities[len-3] == 'm' ){
                if( chordQualities[len-1] == '' || chordQualities[len-1] == 'm' ){
//                    console.log('root='+roots[len-3]+' nextRoot='+roots[len-1]);
                    cadenceName = cadenceNames[1];
                    cadenceIndex = 1;
                }
            }
        }
    } else {
        if(isBackCircleRootMvt(roots[len-2],roots[len-1])) {
            if( chordQualities[len-2] == '' || chordQualities[len-2] == 'm' ){
                if( chordQualities[len-1] == '' || chordQualities[len-1] == 'm' ){
                    console.log('root='+roots[len-2]+' nextRoot='+roots[len-1]);
                    cadenceName = cadenceNames[1];
                    cadenceIndex = 1;
                }              
            }
        }
    }
    if(cadenceIndex!=-1){
//        console.log('cadenceName = '+cadenceName);
//        console.log('==============================');
//        return cadenceName;
        if(cadenceIndex == 0 || cadenceIndex == 1){ // V - I or IV - I
            keyNote = roots[len-1];
            if(localCalcKey && (keyNote != localCalcKey)){
                keyNote = localCalcKey;
                cadenceIndex = 3;
            }
            chordQ = chordQualities[len-1];
        } else if(cadenceIndex == 2){  // V - VI
            keyNote = circleMovement[ roots[len-2] ];
            chordQ = chordQualities[len-1];
        } else if(cadenceIndex == 3){  // and - V
            keyNote = circleMovement[ roots[len-1] ];
            chordQ = chordQualities[len-1];
        }
        if(keyNote[-1]=='m'){
//            console.log('keyNote='+keyNote);            
        } else {
//            console.log('keyNote='+keyNote+chordQ);
        }
        printSelectedChords(chordContexts, chordLocs, keyNote);
        chordContexts = addCalcKeyProperty(chordContexts, chordLocs, keyNote);
        console.log(chordContexts);
        console.log('---------------------\ncheckForCadence() end\n---------------------');
        return cadenceIndex;
        
    }

    //-----------------------------------------------------------------------
    // DECEPTIVE cadence ----------------------------------------------------
    // check if there is V-VI
    // TODO: V - anything (iii, IV)
    //-----------------------------------------------------------------------
    let Vchord = '';
    let keyLetter = '';
    if(roots[len-1] == roots[len-2]){
        //-------------
        if(localCalcKey.includes('m')){
            // chop off the 'm'
            let len = localCalcKey.length;
            keyLetter = localCalcKey.slice(0,-1);
        } else {
            keyLetter = localCalcKey.slice();
        }
        //------------------*/
        Vchord = backCircleMovement[keyLetter];
//        Vchord = backCircleMovement[localCalcKey];
        console.log('(D1) root='+roots[len-3]+' localCalcKey='+localCalcKey);
        if( isStepwiseRootMvt(roots[len-3],roots[len-1]) && (roots[len-3]==Vchord) ) {
            if( chordQualities[len-3] == '' || chordQualities[len-3] == '7' ){
                if( chordQualities[len-1] == '' || chordQualities[len-1] == 'm' ){
                    console.log('root='+roots[len-2]+' nextRoot='+roots[len-1]);
                    cadenceName = cadenceNames[2];
                    cadenceIndex = 2;
                }
            }
        }
    } else {
        if(localCalcKey.includes('m')){
            // chop off the 'm'
            let len = localCalcKey.length;
            keyLetter = localCalcKey.slice(0,-1);
        } else {
            keyLetter = localCalcKey.slice();
        }
        //------------------*/
        Vchord = backCircleMovement[keyLetter];
//        Vchord = backCircleMovement[localCalcKey];
//        console.log('(D2) root='+roots[len-2]+' localCalcKey='+localCalcKey+' Vchord='+Vchord);
//        console.log('(roots[len-2]==localCalcKey) = '+roots[len-2]==localCalcKey);
        if(isStepwiseRootMvt(roots[len-2],roots[len-1]) && (roots[len-2]==Vchord) ) {
            if( chordQualities[len-2] == '' || chordQualities[len-2] == '7' ){
                if( chordQualities[len-1] == '' || chordQualities[len-1] == 'm' ){
                    console.log('root='+roots[len-2]+' nextRoot='+roots[len-1]);
                    cadenceName = cadenceNames[2];
                    cadenceIndex = 2;
                }              
            }
        }
    }
    console.log('cadenceIndex='+cadenceIndex);
    if(cadenceIndex!=-1){
        if(cadenceIndex == 0 || cadenceIndex == 1){ // V - I or IV - I
            if(localCalcKey && keyNote != localCalcKey){
                keyNote = localCalcKey;
            }
            keyNote = roots[len-1];
            chordQ = chordQualities[len-1];
        } else if(cadenceIndex == 2){  // V - VI
            if(keyNote != localCalcKey){
                keyNote = localCalcKey;
            }
            keyNote = circleMovement[ roots[len-2] ];
            chordQ = chordQualities[len-1];
        } else if(cadenceIndex == 3){  // and - V
            keyNote = circleMovement[ roots[len-1] ];
            chordQ = chordQualities[len-1];
        }
        console.log('keyNote='+keyNote+chordQ);
        printSelectedChords(chordContexts, chordLocs, keyNote);
        chordContexts = addCalcKeyProperty(chordContexts, chordLocs, keyNote);
        console.log(chordContexts);
        console.log('---------------------\ncheckForCadence() end\n---------------------');
        return cadenceIndex;
    }

    //-----------------------------------------------------------------------
    // HALF cadence ----------------------------------------------------
    // check if there is any-V , V must be major,
    //-----------------------------------------------------------------------
    if( chordQualities[len-1] == '' ){
        // TODO: verify by localNotes and lastRoot if last chord is a V
//        let lastRoot = roots[len-1];
//        console.log('cadenceName='+cadenceName);
//        console.log('root='+roots[len-2]+' nextRoot='+roots[len-1]);
        cadenceName = cadenceNames[3];
        cadenceIndex = 3;
    }

    // if none found returns ( cadenceName = '' or cadenceIndex = -1)
//    console.log('==============================');
//    console.log('cadenceIndex='+cadenceIndex);
    if(cadenceIndex == 0 || cadenceIndex == 1){ // V - I or IV - I
        if(localCalcKey && (keyNote != localCalcKey)){
            keyNote = localCalcKey;
        }
        keyNote = roots[len-1];
        chordQ = chordQualities[len-1];
    } else if(cadenceIndex == 2){  // V - VI
        keyNote = circleMovement[ roots[len-2] ];
        chordQ = chordQualities[len-1];
    } else if(cadenceIndex == 3){  // any - V
//        console.log('hello3 keyNote='+keyNote+' roots[len-1]='+roots[len-1]);
        if(keyNote != localCalcKey){
            keyNote = localCalcKey;
        }
//        keyNote = circleMovement[ roots[len-1] ];
        chordQ = chordQualities[len-1];
    }
    console.log('keyNote='+keyNote+chordQ);
    printSelectedChords(chordContexts, chordLocs, keyNote);
    chordContexts = addCalcKeyProperty(chordContexts, chordLocs, keyNote);
    console.log(chordContexts);
    console.log('---------------------\ncheckForCadence() end\n---------------------');
    return cadenceIndex;
//    return cadenceName;
}

function analyzeScaleAgainstMajor(scale){
    // scale is often sorted starting on 'A'
    // but that usually isn't the root of the scale
    // search from all starting note of scale
    let numOfModes = scale.length;
    let modeScale = [];
    let major_idx = [0,2,4,5,7,9,11];
    let root = '';
    let majorScaleChrom = [];
    let majorScale = [];
    let len = major_idx.length;
    let score = [];
    for(let n=0; n<numOfModes; n++){
        majorScaleChrom = [];
        majorScale = [];
        modeScale = makeModeFromScale(scale,(n+1));
        root = modeScale[0];
        majorScaleChrom = rootToScale[root];
        if(!majorScaleChrom){ continue; }
        for(let i=0; i<len; i++){
            majorScale.push(majorScaleChrom[major_idx[i]]);
        }
        score = compareTwoScales(modeScale, majorScale);
        if(score[0]==100 && score[1]==100 && score[2]==100 && score[3]==1){
            return [true, modeScale];
        }
    }
    return [false, scale];
    
}

// returns array[(true/false), scale]
// if true the returned scale is the modeScale
// if false the returned scale is the same as parameter input
function analyzeScaleAgainstMinor(scale){
    // scale is often sorted starting on 'A'
    // but that usually isn't the root of the scale
    // search from all starting note of scale
    let numOfModes = scale.length;
    let modeScale = [];
    let root = '';
//    root += 'm';
    let minorScaleChrom = rootToScale[root];
    let minor1_idx = [0,2,3,5,7,8,10]; // natural minor
    let minor2_idx = [0,2,3,5,7,8,11]; // harmonic minor
    let minor3_idx = [0,2,3,5,7,9,11]; // melodic minor
    let minorScale1 = [];
    let minorScale2 = [];
    let minorScale3 = [];
    let score = [];

    let len = minor1_idx.length;

    for(let n=0; n<numOfModes; n++){
        // natural minor --------------------------------------------
        minorScaleChrom = [];
        minorScale1 = [];
        modeScale = makeModeFromScale(scale,(n+1));
        root = modeScale[0];
        root += 'm';
        minorScaleChrom = rootToScale[root];
        if(!minorScaleChrom){ continue; }
        for(let i=0; i<len; i++){
            minorScale1.push(minorScaleChrom[minor1_idx[i]]);
        }
        score = compareTwoScales(modeScale, minorScale1);
        if(score[0]==100 && score[1]==100 && score[2]==100 && score[3]==1){
            return [true, modeScale];
        }

        // harmonic minor --------------------------------------------
        minorScaleChrom = [];
        minorScale2 = [];
        modeScale = makeModeFromScale(scale,(n+1));
        root = modeScale[0];
        root += 'm';
        minorScaleChrom = rootToScale[root];
        if(!minorScaleChrom){ continue; }
        for(let i=0; i<len; i++){
            minorScale2.push(minorScaleChrom[minor2_idx[i]]);
        }
        score = compareTwoScales(modeScale, minorScale2);
        if(score[0]==100 && score[1]==100 && score[2]==100 && score[3]==1){
            return [true, modeScale];
        }
    
        // melodic minor --------------------------------------------
        minorScaleChrom = [];
        minorScale3 = [];
        modeScale = makeModeFromScale(scale,(n+1));
        root = modeScale[0];
        root += 'm';
        minorScaleChrom = rootToScale[root];
        if(!minorScaleChrom){ continue; }
        for(let i=0; i<len; i++){
            minorScale3.push(minorScaleChrom[minor3_idx[i]]);
        }
        score = compareTwoScales(modeScale, minorScale3);
        if(score[0]==100 && score[1]==100 && score[2]==100 && score[3]==1){
            return [true, modeScale];
        }
    
    }

    return [false, scale];
}

function analyzeScaleAgainstHarmonicMajor(scale){
    // scale is often sorted starting on 'A'
    // but that usually isn't the root of the scale
    // search from all starting note of scale
    let numOfModes = scale.length;
    let modeScale = [];
    let harmMajor_idx = [0,2,4,5,7,8,11];
    let root = '';
    let majorScaleChrom = [];
    let harmMajorScale = [];
    let len = harmMajor_idx.length;
    let score = [];
    for(let n=0; n<numOfModes; n++){
        majorScaleChrom = [];
        harmMajorScale = [];
        modeScale = makeModeFromScale(scale,(n+1));
        root = modeScale[0];
        majorScaleChrom = rootToScale[root];
        if(!majorScaleChrom){ continue; }
        for(let i=0; i<len; i++){
            if(i==5){
                let enharmonicNotes = majorScaleChrom[harmMajor_idx[i]].split('/');
                harmMajorScale.push(enharmonicNotes[1]);
                
            } else {
                harmMajorScale.push(majorScaleChrom[harmMajor_idx[i]]);
            }
        }
        score = compareTwoScales(modeScale, harmMajorScale);
        if(score[0]==100 && score[1]==100 && score[2]==100 && score[3]==1){
            return [true, modeScale];
        }
    }
    return [false, scale];
    
}


// this function doesn't care about order of elements in the scales
// (assumes that scales are already sorted if that is important)
// this function returns an array of 4 values:
// return  array[score1Percent, score2Percent,lengthPercent, modeIndex]
// 1) score1Percent is percentage of notes in scale 2 that are also in scale 1
// 2) score2Percent is percentage of notes in scale 1 that are also in scale 2
// 2) lengthPercent is ratio len1/len2 as a percent
// 4) modeIndex (undefined unless the first three are 100%)
// modeIndex is a number of the mode scale 1 is compared to scale 2 (parent scale)
// examples: 
// D dorian scale compared to a C major scale would return a modeIndex value of 2
// G mixolydian scale compared to a C major scale would return 5
// modeIndex of 1 means scale 1 and scale 2 are equal.
//
function compareTwoScales(scale1, scale2){
    // determine what notes of scale1 are not in scale2
    // score1 ++ if 'in'
    cadenceIndex = 0;
    let len1 = scale1.length;
    let score1 = 0;
    for(let i=0; i<len1; i++){
        if(scale2.includes(scale1[i])){
            score1++;
        } 
//        else {
//            score1--;
//        }
    }
    // determine what notes of scale2 are not in scale1
    // score2 ++ if 'in'
    let len2 = scale2.length;
    let score2 = 0;
    for(let i=0; i<len2; i++){
        if(scale1.includes(scale2[i])){
            score2++;
        } 
//        else {
//            score2--;
//        }
    }
    let score1Percent = Math.round(score1/len1*100);
    let score2Percent = Math.round(score2/len2*100);
    let lengthPercent = Math.round(len1/len2*100);
    let modeIndex; // undefined

    if(score1Percent==100 && score2Percent==100 && lengthPercent==100){
        // determine what mode scale 1 is compared to scale 2 (parent scale)
        modeIndex = (scale2.indexOf(scale1[0]) + 1);
    }
//    console.log('scale1='+scale1+'\nscale2='+scale2);
//    console.log('score1Percent='+score1Percent+' score2Percent='+score2Percent);
    return [score1Percent, score2Percent,lengthPercent, modeIndex];    
}

function findLastXChords(chordContexts,numOfChords){
    let len = chordContexts.length;
    let lastXChords = [];
    let chordName = '';
    let num = numOfChords
    let count = 0;
    for(let i = len-1; i>0; i--){
        if(count >= num){ break; }

        let fullName = chordContexts[i].fullName;
        if(chordName != fullName){
            // found a new chord
            lastXChords.push(i);
            count++;
            // update current chordName
            chordName = fullName;
        } else {
            lastXChords.pop();
            lastXChords.push(i);
        }
    }
    return lastXChords.reverse();
}


// searches for V-I chord progressions, makes an array of locations of the V chords
function findV_I(chordContexts){
    // search for major or 7 chordQuality
    let V_I = []
    let chordsLength = chordContexts.length;
    let myKey = chordContexts[0].key.trim();
    let myKeyScale = makeKeyScale(myKey);
    let keyNote = keyToRoot[myKey];
    let myLocalKey = chordContexts[0].localKey;
    for(let i=0; i<chordsLength; i++){
        // look for V but don't check the last chord
        if( (i < chordsLength-1) && ( chordContexts[i].chordQuality == '' || chordContexts[i].chordQuality == '7') ) {
            let root = chordContexts[i].root;
            let chordLocs = [];
            chordLocs.push(i);
            let nextChordLoc = findNextChordChange(chordContexts, i);
            if(nextChordLoc) { chordLocs.push(nextChordLoc); }
            let prevChordLoc = findPrevChordChange(chordContexts, i);
            if(prevChordLoc) { chordLocs.push(prevChordLoc); }

            let localNotes = getLocalNotes(chordContexts, chordLocs);
            let myLocalKeyToneJS = convertLilyToTonePitch(myLocalKey);
//            console.log('\ni='+i+' myLocalKey='+myLocalKeyToneJS+'\n localNotes='+localNotes);

            // check if the next chord is cycle root movement
            let nextRoot = chordContexts[i+1].root;
            let circleRootMvt = isCircleRootMvt(root, nextRoot);
            let chordQuality2 = chordContexts[i+1].chordQuality;
            // check that the I chord is major or minor
            if( circleRootMvt && (chordQuality2 == '' || chordQuality2 == 'm' || chordQuality2 == 'sus4') ){
                let localCalcKey = determineKey(chordContexts, myKeyScale, myLocalKeyToneJS, localNotes)    
                V_I.push(i);
            }
        }
    }
    return V_I;
}

// searches for II-V-I chord progressions, makes an array of locations of the II chords
function findII_V_I(chordContexts){
    // search for major or 7 chordQuality
    let II_V_I = []
    let chordsLength = chordContexts.length;
    let myKey = chordContexts[0].key.trim();
    let keyNote = keyToRoot[myKey];
    for(let i=0; i<chordsLength; i++){
        // look for V but don't check the first or last chord
        if( (i > 0 && i < chordsLength-1) && 
          ( chordContexts[i].chordQuality == '' || chordContexts[i].chordQuality == '7') ) {
            // check if the next chord is cycle root movement
            let prevRoot = chordContexts[i-1].root;
            let root = chordContexts[i].root;
            // skip the I chord from being considered
            if(root == keyNote){ continue; }

            let nextRoot = chordContexts[i+1].root;
            let circleRootMvt = isCircleRootMvt(root, nextRoot);
            let chordQuality2 = chordContexts[i+1].chordQuality;
            // check that the I chord is major or minor
            if( circleRootMvt && (chordQuality2 == '' || chordQuality2 == 'm') ){
                // check if there is a ii chord before the V
                let circleRootMvt2 = isCircleRootMvt(prevRoot, root);
                if(circleRootMvt2){
                    II_V_I.push(i-1); // use the II chord location (i-1)
                }
            }
        }
    }
    return II_V_I;
}

function findCircleProgressions(chordContexts){
    // search for circle movement
    let startCircle = false;
    let circles = []
    let chordsLength = chordContexts.length;
    for(let i=0; i<chordsLength; i++){
        if( (i < chordsLength-1) ) {
            let root = chordContexts[i].root;
            let nextRoot = chordContexts[i+1].root;
            let circleRootMvt = isCircleRootMvt(root, nextRoot);
            if(circleRootMvt) {
                startCircle = true;
                // chordContexts[i].fullName;
                circles.push(i);
            } else {
                startCircle = false;
                // space
            }
        }
    }
    return circles;
}

function printOutCircles(chordContexts, arrayOfCircles){
    let numOfCircles = arrayOfCircles.length;
    let msg = '';
    let lastIndex = -11;
    for(let i=0; i<numOfCircles; i++){
        // check for consecutive numbers
        if( (lastIndex+1) != arrayOfCircles[i] ) {
            // print this at the start of a new circle chain
            msg += '\nCircle Progression at index ' + arrayOfCircles[i];
            msg += '\n' + chordContexts[arrayOfCircles[i]].fullName;
        }

        msg += ' - ' + chordContexts[arrayOfCircles[i]+1].fullName;
        lastIndex = arrayOfCircles[i];
    }
    if(msg){
        console.log(msg);
    }

}

function printOut_V_I_Report(chordContexts, arrayOfVs){
    let numOfVs = arrayOfVs.length;
    let msg = '';

    for(let i=0; i<numOfVs; i++){
        // get the name of the V chord
        msg += '\nV - I at index ' + arrayOfVs[i];
        msg += '\n' + chordContexts[arrayOfVs[i]+1].root;
        if( (chordContexts[arrayOfVs[i]+1].chordQuality == 'sus4') ){
            msg += '';
        } else {
            msg += chordContexts[arrayOfVs[i]+1].chordQuality;
        }
        msg += ': ' + chordContexts[arrayOfVs[i]].fullName;
        msg += ' - ' + chordContexts[arrayOfVs[i]+1].fullName;
    }
    if(msg){
        console.log(msg);
    }
}

function printOut_II_V_I_Report(chordContexts, arrayOfIIs){
    let numOfIIs = arrayOfIIs.length;
    let msg = '';
    for(let i=0; i<numOfIIs; i++){
        // get the name of the V chord
        msg += '\nII - V - I at index ' + arrayOfIIs[i];
        msg += '\nkey of ' + chordContexts[arrayOfIIs[i]+2].root + chordContexts[arrayOfIIs[i]+2].chordQuality;
        msg += ': ' + chordContexts[arrayOfIIs[i]].fullName;
        msg += ' - ' + chordContexts[arrayOfIIs[i]+1].fullName;
        msg += ' - ' + chordContexts[arrayOfIIs[i]+2].fullName;
    }
    if(msg){
        console.log(msg);
    }
}

function isCircleRootMvt(root, nextRoot) {
    let correctCircleMovement = circleMovement[root];
    return (correctCircleMovement == nextRoot);
}

function isBackCircleRootMvt(root, nextRoot) {
    let correctBackCircleMovement = backCircleMovement[root];
    return (correctBackCircleMovement == nextRoot);
}

function isStepwiseRootMvt(root, nextRoot) {
    let correctStepMovement = stepwiseMovement[root];
    let enharmonics = correctStepMovement.split('/');
    return ( enharmonics[0] == nextRoot || enharmonics[1] == nextRoot );
}

const majorRootToRelativeMinorRoot = {
    'Ab': 'F', 'A': 'F#', 'A#': 'Fx',
    'Bb': 'G', 'B': 'G#', 'B#': 'Gx',
    'Cb': 'Ab', 'C': 'A', 'C#': 'A#',
    'Db': 'Bb', 'D': 'B', 'D#': 'B#',
    'Eb': 'C', 'E': 'C#', 'E#': 'Cx',
    'Fb': 'Db', 'F': 'D', 'F#': 'D#',
    'Gb': 'Eb', 'G': 'E', 'G#': 'E#'
}

const minorRootToVIChordRoot = {
    'Ab': 'Fb', 'A': 'F', 'A#': 'F#',
    'Bb': 'Gb', 'B': 'G', 'B#': 'G#',
    'Cb': 'Abb', 'C': 'Ab', 'C#': 'A',
    'Db': 'Bbb', 'D': 'Bb', 'D#': 'B',
    'Eb': 'Cb', 'E': 'C', 'E#': 'C#',
    'Fb': 'Dbb', 'F': 'Db', 'F#': 'D',
    'Gb': 'Ebb', 'G': 'Eb', 'G#': 'E'
}

const minorRootToRelativeMajorRoot = {
    'F': 'Ab', 'F#': 'A', 'Fx': 'A#',
    'G': 'Bb', 'G#': 'B', 'Gx': 'B#',
    'Ab': 'Cb', 'A': 'C', 'A#': 'C#',
    'Bb': 'Db', 'B': 'D', 'B#': 'D#',
    'C': 'Eb', 'C#': 'E', 'Cx': 'E#',
    'Db': 'Fb', 'D': 'F', 'D#': 'F#',
    'Eb': 'Gb', 'E': 'G', 'E#': 'G#'
}

const circleMovement = {
    'Ab': 'Db', 'A': 'D', 'A#': 'D#',
    'Bb': 'Eb', 'B': 'E', 'B#': 'E#',
    'Cb': 'Fb', 'C': 'F', 'C#': 'F#',
    'Db': 'Gb', 'D': 'G', 'D#': 'G#',
    'Eb': 'Ab', 'E': 'A', 'E#': 'A#',
    'Fb': 'Bbb', 'F': 'Bb', 'F#': 'B',
    'Gb': 'Cb', 'G': 'C', 'G#': 'C#'
}

const backCircleMovement = {
    'Ab': 'Eb', 'A': 'E', 'A#': 'E#',
    'Bb': 'F', 'B': 'F#', 'B#': 'Fx',
    'Cb': 'Gb', 'C': 'G', 'C#': 'G#',
    'Db': 'Ab', 'D': 'A', 'D#': 'A#',
    'Eb': 'Bb', 'E': 'B', 'E#': 'B#',
    'Fb': 'Cb', 'F': 'C', 'F#': 'C#',
    'Gb': 'Db', 'G': 'D', 'G#': 'D#'
}

const stepwiseMovement = {
    'Ab': 'Bb/Bbb', 'A': 'B/Bb', 'A#': 'B#/B',
    'Bb': 'C/Cb', 'B': 'C#/C', 'B#': 'Cx/C#',
    'Cb': 'Db/Dbb', 'C': 'D/Db', 'C#': 'D#/D',
    'Db': 'Eb/Ebb', 'D': 'E/Eb', 'D#': 'E#/E',
    'Eb': 'F/Fb', 'E': 'F#/F', 'E#': 'Fx/F#',
    'Fb': 'Gb/Gbb', 'F': 'G/Gb', 'F#': 'G#/G',
    'Gb': 'Ab/Abb', 'G': 'A/Ab', 'G#': 'A#/A'
}

const stepwiseMovementDown = {
    'Ab': 'G/Gb', 'A': 'G#/G', 'A#': 'Gx/G#',
    'Bb': 'A/Ab', 'B': 'A#/A', 'B#': 'Ax/A#',
    'Cb': 'Bb/Bbb', 'C': 'B/Bb', 'C#': 'B#/B',
    'Db': 'C/Cb', 'D': 'C#/C', 'D#': 'Cx/C#',
    'Eb': 'D/Db', 'E': 'D#/D', 'E#': 'Dx/D#',
    'Fb': 'Eb/Ebb', 'F': 'E/Eb', 'F#': 'E#/E',
    'Gb': 'F/Fb', 'G': 'F#/F', 'G#': 'Fx/F#'
}
