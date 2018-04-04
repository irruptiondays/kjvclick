    
var aHrefTag = '<a href="bible.irruptiondays.org?page=';
var closeATag = '</a>';
var extensionAndAnchor = '#v';
var closeAHref1 = '-1" target="bible" class="verseRef">'; //for chapters, no verse specified
var closeAHref = '" target="bible" class="verseRef" title="Verse opens in a new window or tab">';
var verseRegex = /(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Psalms|Proverbs|Ecclesiastes|Song of Songs|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation) ((\d*)*(\d*:\d*)*(\d*-\d*)*(\d*, \d*)*(\d*; \d*)*)*/g;

function getFilenameFromVerseRef(verseReference) {
    if (verseReference.toLowerCase() == 'psalm') {
      return 'psalms';
    }
    return verseReference;
}
//var verseRegex = /(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Psalms|Proverbs|Ecclesiastes|Song of Songs|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation) (?:\d\s*)?[A-Z]?[a-z]+\s*\d+(?:[:-]\d+)?(?:\s*-\s*\d+)?(?::\d+|(?:\s*[A-Z]?[a-z]+\s*\d+:\d+))?/


function verseParser() {
  var re = $('body').html()
    
    .replace(verseRegex, function(w) {

      let verseRef = w.split(" ");

      //console.log(getBook(verseRef));

      let bookName = getBook(verseRef);
      let references = verseRef.slice(getBookNameLength(verseRef));

      console.log(references);

      if (isSimpleReference(w)) {
        //console.log('####### ref ', references[0]);
          let chapterVerse = splitOnColon(references[0]);
          console.log('Chapter: ', chapterVerse.chapter);
          console.log('Verse: ', chapterVerse.verse);
      }


      //getReferences = 
      console.log('w: ', endsWithNonDigit(w));
      console.log('Ends with ? ', endsWithNonDigit(w));

      return '<span style="color:red;">' + w + '</span>';
    });

  $('body').html(re);
}

function getBook(verseRefArray) {
  // handle First and Second X
    if (verseRefArray[0] == 1 || verseRefArray[0] == 2 || verseRefArray[0] == 3) {
      return (verseRefArray[0]+verseRefArray[1]).toLowerCase();
    } else if (verseRefArray[0].toLowerCase() == 'song') {
      return ('songofsongs');
    } else if (verseRefArray[0].toLowerCase() == 'psalm') {
      return 'psalms';
    } else {
      return verseRefArray[0].toLowerCase();
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
    /*if (wholeString.endsWith(':')) {
      return wholeString.substring(0, wholeString.length - 1);
    } else {
      return wholeString;
    }*/
    return wholeString.endsWith(':') ||
      wholeString.endsWith(';') ||
      wholeString.endsWith(',') ||
      wholeString.endsWith('-'); 
}

function getStringWithoutTrailingChar(wholeString) {
  if (endsWithNonDigit(wholeString)) {
    return wholeString.substring(0, wholeString.length - 1);
  } else {
    return wholeString;
  }
}

function splitOnColon(colonSequence) {
  let chapterVerse = colonSequence.split(":");
  // check to see if - is there first
  let verse = chapterVerse[1].split("-");
  return {
    chapter: chapterVerse[0],
    verse: verse[0]
  };
}

function isSimpleReference(wholeString) {
  return !getStringWithoutTrailingChar(wholeString).includes(',') && 
    !getStringWithoutTrailingChar(wholeString).includes(';') && 
    wholeString.includes(':');
}



