var extensionAndAnchor = '#v';
var aHrefTag = '<a href="http://bible.irruptiondays.org?book=';
var closeATag = '</a>';
var closeAHref1 = '-1" target="bible" class="verseRef">'; //for chapters, no verse specified
var closeAHref = '" target="bible" class="verseRef" title="Verse opens in a new window or tab">';
var verseRegex = /(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Psalms|Proverbs|Ecclesiastes|Song of Songs|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation) ((\d*)*(^a-zA-Z)*(\d*:\d*)*(\d*-\d*)*(\d*, \d*)*(\d*; \d*)*(?! [A-Z]))*/g;

function getFilenameFromVerseRef(verseReference) {
    if (verseReference.toLowerCase() == 'psalm') {
      return 'psalms';
    }
    return verseReference;
}


function verseParser() {
  var re = $('body').html().replace(verseRegex, function(w) { 

      console.log('w', w);
      //return "<span style=\"color: red;\">" + w + "</span>";
  


      
      var hasNumber = /\d/;
      if (!hasNumber.test(w.substring(1, w.length))) {
        return w;
      }

      let verseRef = w.split(" ");

      let bookName = getBook(verseRef);
      
      let taggedReference = '';
      
      let splitOnSemi = w.split(';');

      for (let i = 0; i < splitOnSemi.length; ++i) {
        
          let splitOnComma = splitOnSemi[i].split(',');
          
          let currentChapter = null;

        for (let j = 0; j < splitOnComma.length; ++j) {
          
          let chapterAndVerse = [];

          if (isNaN(splitOnComma[j].charAt(0)) || isNaN(splitOnComma[j].charAt(2))) {
            // handle initial name
            console.log('w', w);
            console.log('splitOnComma[j]: ', splitOnComma[j]);
            console.log('charAt2: ', splitOnComma[j].charAt(2));
            console.log('bookname ', bookName);
            chapterAndVerse = splitOnColon(splitOnComma[j].replace(bookName, ''));
          } else {
            chapterAndVerse = splitOnColon(splitOnComma[j]);
          }
          
          
          if (chapterAndVerse.chapter && !currentChapter) {
            currentChapter = chapterAndVerse.chapter;
          } else {
            chapterAndVerse.chapter = currentChapter;
          }
          
          taggedReference += aHrefTag + getBookFilename(verseRef) + extensionAndAnchor + chapterAndVerse.chapter + '-' + chapterAndVerse.verse + closeAHref + splitOnComma[j] + closeATag
          
          if (j != splitOnComma.length - 1 ) {
            taggedReference += ', ';
          }

        } 
        
        if (i != splitOnSemi.length - 1) {
          taggedReference += '; ';
        }
        
      }

      return taggedReference; 
    });

  $('body').html(re);
}

function getBook(verseRefArray) {
  // handle First and Second X
    if (verseRefArray[0] == 1 || verseRefArray[0] == 2 || verseRefArray[0] == 3) {
      return (verseRefArray[0] + ' ' + verseRefArray[1]);
    } else if (verseRefArray[0].toLowerCase() == 'song') {
      return ('Song of Songs');
    } else {
      return verseRefArray[0];
    }
}

function getBookFilename(verseRefArray) {
  // handle First and Second X
    if (verseRefArray[0] == 1 || verseRefArray[0] == 2 || verseRefArray[0] == 3) {
      return (verseRefArray[0].trim() + verseRefArray[1].trim()).replace(' ', '').toLowerCase();
    } else if (verseRefArray[0].toLowerCase() == 'song') {
      return ('songofsongs');
    } else if (verseRefArray[0].toLowerCase() == 'psalm') {
      return 'psalms';
    } else {
      return verseRefArray[0].replace(' ', '').toLowerCase();
    }
}

function getBookNameLength(verseRefArray) {
  if (verseRefArray[0] == 1 || verseRefArray[0] == 2 || verseRefArray[0] == 3) {
    return 2;
  } else if (verseRefArray[0].toLowerCase() == 'song') {
    // check for song by itself
    return 3;
  } else {
    return 1;
  }
}

function endsWithNonDigit(wholeString) {
      return isNaN(wholeString.charAt(wholeString.length -1));
}

function getStringWithoutTrailingChar(wholeString) {
  if (endsWithNonDigit(wholeString)) {
    return wholeString.substring(0, wholeString.length - 1);
  } else {
    return wholeString;
  }
}

function splitOnColon(colonSequence) {
  console.log('colonSeq', colonSequence);
  if (colonSequence.includes(':')) {
    let chapterVerse = colonSequence.split(":");
    let verse = ['1'];
    if (chapterVerse[1]) {
      verse = chapterVerse[1].split("-");
    }
    return {
      chapter: chapterVerse[0].trim(),
      verse: verse[0].trim()
    };
  } else {
    return {
      chapter: null,
      verse: colonSequence.split('-')[0].trim()
    };
  }
}

function isSimpleReference(wholeString) {
  return !getStringWithoutTrailingChar(wholeString).includes(',') && 
    !getStringWithoutTrailingChar(wholeString).includes(';') && 
    wholeString.includes(':');
}



