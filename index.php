<?php

$book = "";
$chapter = "";
$displayIndex = false;

$bibleBookArray = null;
if (file_exists('bibleBookArray.php')) {
  $bibleBookArray = include('bibleBookArray.php');
}

$bibleIntArray = null;
if (file_exists('bibleIntArray.php')) {
  $bibleIntArray = include('bibleIntArray.php');
}

if (isset($_GET['book'])) {
  $bookInt = $bibleBookArray[$_GET['book']];
  $book = " where book = $bookInt";
} else {
  $displayIndex = true;
}

if (isset($_GET['chapter'])) {
  $chapterInt = $_GET['chapter'];
  $chapter = " AND chapter = $chapterInt";
}

print("<!DOCTYPE html>\n");
print("<html lang=\"en\">\n");
print("<head>\n");

// Get title
print("<title>Bible</title>");
// End Get Title


print("<link rel=\"stylesheet\" href=\"lib/bootstrap.min.css\" />");
print("<script src=\"lib/jquery.min.js\"></script>");
print("<script src=\"lib/bootstrap.min.js\"></script>");
print("<link rel=\"stylesheet\" href=\"lib/custom.css?p=kfjihcg8\" />");



    
print("</head>");
  
print("<body id=\"pagetop\">");
print("<div id=\"content\" class=\"container\">");


if (file_exists('../properties/dbconfig.php')) {
  include('../properties/dbconfig.php');
} else {
  die('config not found');
}

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$tableToUse = $bookInt <= 66 ? $tableName : $apocryphaTableName;

$sql = "SELECT * FROM " . $tableToUse . " " . $book . $chapter . " order by book, chapter, verse;";


$result = $conn->query($sql);

if ($result->num_rows > 0 && !$displayIndex) {
    $properBookName = $bibleIntArray["$bookInt"];
    echo "<h1 class=\"bible-main-h1\">$properBookName $chapterInt</h1>";
    
    if ($bookInt > 66) {
      echo "<p><em>(From the Apocrypha, which is <strong>not</strong> a part of the Holy Bible.)</em></p>";
    }

    $currentChapter = 0;
    while ($row = $result->fetch_assoc()) {
        if ($chapterInt == "" && $row[verse] == 1) {
          echo "<h2>Chapter " . ++$currentChapter . "</h2>";
        }
        
        if ($bookInt <= 66) {
          echo "<span class=\"bible-ref-div\" id=\"v" . $row["chapter"] . "-" . $row["verse"] . "\">(" . $row["chapter"] . ":" . $row["verse"] . ") <span class=\"bible-main-div\">" . $row["text"] . "</span></span><br>";
        } else {
          echo "<span class=\"apoc-div\" id=\"v" . $row["chapter"] . "-" . $row["verse"] . "\">(" . $row["chapter"] . ":" . $row["verse"] . ") " . $row["text"] . "</span><br>";
        }
    }
    
    echo "<br><br><br>";
    
} else {
  if (file_exists("index-old.php")) {
    include("index-old.php");
  }
}
$conn->close();

        

print("</div>");
print("</body>");
  
print("</html>");

?>